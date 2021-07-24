import User, { IUser } from "../model/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import filterObject from "../utils/filterObject";
import fs from "fs";
import crypto from "crypto";
import { promisify } from "util";
import { NextFunction, Request, Response, RequestHandler } from "express";
// import client from "../utils/redis";

const unlinkAsync = promisify(fs.unlink);

export const destroyMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user._id, {
      deletedAt: new Date(Date.now()),
    });
    // await client.del(req.user._id.toString());
    res
      .status(200)
      .clearCookie("jwtAccessToken")
      .clearCookie("jwtRefreshToken")
      .json({ status: "success" });
  }
);
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("There is no user with that email", 400));
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateModifiedOnly: true });
    console.log(resetToken);
    res.status(200).json({ status: "success", data: { token: resetToken } });
  }
);
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password, passwordConfirmation } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken });
    if (
      !user ||
      (user.passwordResetTokenExpiresAt &&
        user.passwordResetTokenExpiresAt < new Date(Date.now()))
    ) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    console.log(passwordConfirmation, password);
    user.password = password;
    user.passwordConfirmation = passwordConfirmation;
    user.passwordChangedAt = new Date(Date.now());
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    const data = await user.save({ validateModifiedOnly: true });
    console.log(data);
    res.status(200).json({ status: "success" });
  }
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filtered = filterObject(req.body, "email", "name");

    if (Object.keys(filtered).length === 0 && !req.file) {
      return next(new AppError("nothing to update", 400));
    }

    if (req.file) {
      const user = await User.findById(req.user._id).select("avatar");
      if (user?.avatar) {
        try {
          await unlinkAsync(`public/images/avatars/${user.avatar}`);
        } catch (err: any) {
          if (err.code !== "ENOENT") return next(err);
        }
        filtered.avatar = req.file.filename;
      }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filtered, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { user: updatedUser } });
  }
);

export const me = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const me = await User.findById(req.user._id);
    res.status(200).json({ status: "success", data: { me } });
  }
);
export const user = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    // if (!user) {
    //   return next(new AppError("No user found ", 404));
    // }
    res.status(200).json({ status: "success", data: { user } });
  }
);
