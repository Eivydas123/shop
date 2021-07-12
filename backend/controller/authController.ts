import User, { IUser } from "../model/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { IJWT } from "../typescript/interfaces/IJWT";
import { redisGet, redisSet, redisDel } from "../utils/redis";
import ip from "ip";
import os from "os";
import { NextFunction, Request, Response } from "express";

const jwtCookieLifeTime = 365 * 24 * 60 * 60 * 1000;

declare global {
  namespace Express {
    interface Request {
      file: { filename: string };
      user: IUser;
      unauthorizedUser: IUser;
    }
  }
}

const getOS = () => {
  const hostName: string = os.hostname();
  const platform: string = os.platform();
  const ipAddress: string = ip.address();
  return { hostName, platform, ip: ipAddress };
};

const whitelistRefreshToken = catchAsync(
  async (
    userId: string,
    refreshToken: string,
    rememberMe: boolean
  ): Promise<void> => {
    const lifeTime = rememberMe ? 365 * 24 * 60 * 60 : 12 * 60 * 60;
    await redisSet(userId.toString(), refreshToken, "EX", lifeTime);
  }
);
const generateJWTAccessToken = (
  user: IUser,
  res: Response,
  req: Request,
  rememberMe: boolean
): string => {
  const os = getOS();
  const remember: boolean = !!rememberMe;
  const accessToken = jwt.sign(
    { id: user._id, os, remember },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  if (remember) {
    res.cookie("jwtAccessToken", accessToken, {
      httpOnly: true,
      maxAge: jwtCookieLifeTime,
      sameSite: true,
    });
  } else {
    res.cookie("jwtAccessToken", accessToken, {
      httpOnly: true,
      sameSite: true,
    });
  }

  return accessToken;
};
const generateJWTRefreshToken = async (
  user: IUser,
  res: Response,
  req: Request,
  rememberMe: boolean
): Promise<string> => {
  const os = getOS();
  const remember = !!rememberMe;

  const refreshToken = jwt.sign(
    { id: user._id, os, remember },
    process.env.JWT_REFRESH,
    {
      expiresIn: rememberMe ? process.env.JWT_REFRESH_EXPIRES_IN : "12h",
    }
  );

  if (remember) {
    res.cookie("jwtRefreshToken", refreshToken, {
      httpOnly: true,
      maxAge: jwtCookieLifeTime,
      sameSite: true,
    });
  } else {
    res.cookie("jwtRefreshToken", refreshToken, {
      httpOnly: true,
      sameSite: true,
    });
  }
  await whitelistRefreshToken(user._id, refreshToken, rememberMe);
  return refreshToken;
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name, passwordConfirmation } = req.body;
    const os = getOS();
    await User.create({
      email,
      password,
      name,
      passwordConfirmation,
      authorizedDevices: os,
    });

    res.status(201).json({ status: "success" });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide E-mail and Password", 422));
    }

    const user: IUser = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new AppError("Incorrect E-mail or Password", 422));
    }
    if (user.compareOS()) {
      user.save();
      req.unauthorizedUser = user;
      return next(new AppError("unauthorized device", 403));
    }
    generateJWTAccessToken(user, res, req, rememberMe);
    generateJWTRefreshToken(user, res, req, rememberMe);

    res.status(200).json({ status: "success" });
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jwtAccessToken, jwtRefreshToken } = req.cookies;

    if (!jwtRefreshToken) {
      if (jwtAccessToken) {
        return res
          .clearCookie("jwtAccessToken")
          .clearCookie("jwtRefreshToken")
          .sendStatus(204);
      }
      return next(new AppError("No refresh token found", 400));
    }
    const verifyRefreshToken = jwt.verify(
      jwtRefreshToken,
      process.env.JWT_REFRESH
    ) as IJWT;
    await redisDel(verifyRefreshToken.id);

    return res
      .clearCookie("jwtAccessToken")
      .clearCookie("jwtRefreshToken")
      .sendStatus(204);
  }
);

export const authorizeDevice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    console.log(req.unauthorizedUser);
  }
);
export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, oldPassword } = req.body;
    const { jwtRefreshToken } = req.cookies;

    const user = await User.findById(req.user._id).select("+password");

    const passwordCompare = await user.comparePasswords(
      oldPassword,
      user.password
    );
    if (!passwordCompare) {
      return next(new AppError("Passwords do not match", 422));
    }

    user.password = password;
    await user.save();

    const verifyRefreshToken = jwt.verify(
      jwtRefreshToken,
      process.env.JWT_REFRESH
    ) as IJWT;
    generateJWTAccessToken(user, res, req, verifyRefreshToken.remember);
    generateJWTRefreshToken(user, res, req, verifyRefreshToken.remember);

    // console.log(updatePassword);
    res.status(200).json({ status: "success", data: { user } });
  }
);

export const auth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwtAccessToken;
    const refreshToken = req.cookies.jwtRefreshToken;

    if (!token || !refreshToken) {
      res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
      return next(new AppError("You are not logged in 1", 401));
    }

    const verifyAccessToken = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    }) as IJWT;
    const verifyRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH
    ) as IJWT;

    const { hostName, platform, ip } = getOS();

    if (
      verifyAccessToken.os.hostName !== hostName ||
      verifyAccessToken.os.platform !== platform ||
      verifyAccessToken.os.ip !== ip
    ) {
      await redisDel(verifyRefreshToken.id);
      res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
      return next(new AppError("Unauthenticated", 401));
    }

    const redisRefreshToken = await redisGet(verifyRefreshToken.id);

    if (
      !redisRefreshToken ||
      verifyRefreshToken.id !== verifyAccessToken.id ||
      redisRefreshToken !== refreshToken
    ) {
      await redisDel(verifyRefreshToken.id);
      res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
      return next(new AppError("You are not logged in 4", 401));
    }

    const user = await User.findById(verifyAccessToken.id);

    if (!user || user.deletedAt) {
      await redisDel(verifyRefreshToken.id);
      res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
      return next(new AppError("No such a user in token 2", 401));
    }

    if (verifyAccessToken.exp * 1000 <= Date.now()) {
      generateJWTAccessToken(user, res, req, verifyRefreshToken.remember);
      console.log("access token created");
      req.user = user;
      next();
    } else {
      req.user = user;
      next();
    }
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
