"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.auth = exports.updatePassword = exports.logout = exports.login = exports.signUp = void 0;
const userModel_js_1 = __importDefault(require("../model/userModel.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_js_1 = __importDefault(require("../utils/catchAsync.js"));
const appError_js_1 = __importDefault(require("../utils/appError.js"));
const redis_js_1 = require("../utils/redis.js");
const os_1 = __importDefault(require("os"));
const jwtCookieLifeTime = 365 * 24 * 60 * 60 * 1000;
const getOS = (req) => {
    const hostName = os_1.default.hostname();
    const platfrom = os_1.default.platform();
    const ip = req.ip;
    return { hostName, platfrom, ip };
};
const whitelistRefreshToken = catchAsync_js_1.default((userId, refreshToken, rememberMe) => __awaiter(void 0, void 0, void 0, function* () {
    const lifeTime = rememberMe ? 365 * 24 * 60 * 60 : 12 * 60 * 60;
    console.log(lifeTime);
    yield redis_js_1.redisSet(userId.toString(), refreshToken, "EX", lifeTime);
}));
const generateJWTAcccessToken = (user, res, req, rememberMe) => {
    const os = getOS(req);
    const remember = !!rememberMe;
    const accessToken = jsonwebtoken_1.default.sign({ id: user._id, os, remember }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    if (remember) {
        res.cookie("jwtAccessToken", accessToken, {
            httpOnly: true,
            maxAge: jwtCookieLifeTime,
            sameSite: true,
        });
    }
    else {
        res.cookie("jwtAccessToken", accessToken, {
            httpOnly: true,
            sameSite: true,
        });
    }
    return accessToken;
};
const generateJWTRefreshToken = (user, res, req, rememberMe) => __awaiter(void 0, void 0, void 0, function* () {
    const os = getOS(req);
    const remember = !!rememberMe;
    const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, os, remember }, process.env.JWT_REFRESH, {
        expiresIn: rememberMe ? process.env.JWT_REFRESH_EXPIRES_IN : "12h",
    });
    if (remember) {
        res.cookie("jwtRefreshToken", refreshToken, {
            httpOnly: true,
            maxAge: jwtCookieLifeTime,
            sameSite: true,
        });
    }
    else {
        res.cookie("jwtRefreshToken", refreshToken, {
            httpOnly: true,
            sameSite: true,
        });
    }
    yield whitelistRefreshToken(user._id, refreshToken, rememberMe);
    return refreshToken;
});
exports.signUp = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, passwordConfirmation } = req.body;
    yield userModel_js_1.default.create({
        email,
        password,
        name,
        passwordConfirmation,
    });
    res.status(201).json({ status: "success" });
}));
exports.login = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
        return next(new appError_js_1.default("Please provide E-mail and Password", 422));
    }
    const user = yield userModel_js_1.default.findOne({ email }).select("+password");
    if (!user || !(yield user.comparePasswords(password, user.password))) {
        return next(new appError_js_1.default("Incorrect E-mail or Password", 422));
    }
    generateJWTAcccessToken(user, res, req, rememberMe);
    generateJWTRefreshToken(user, res, req, rememberMe);
    res.status(200).json({ status: "success" });
}));
exports.logout = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwtAccessToken, jwtRefreshToken } = req.cookies;
    if (!jwtRefreshToken) {
        if (jwtAccessToken) {
            return res
                .clearCookie("jwtAccessToken")
                .clearCookie("jwtRefreshToken")
                .sendStatus(204);
        }
        return next(new appError_js_1.default("No refresh token found", 400));
    }
    const verifyRefreshToken = jsonwebtoken_1.default.verify(jwtRefreshToken, process.env.JWT_REFRESH);
    yield redis_js_1.redisDel(verifyRefreshToken.id);
    return res
        .clearCookie("jwtAccessToken")
        .clearCookie("jwtRefreshToken")
        .sendStatus(204);
}));
exports.updatePassword = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword } = req.body;
    const { jwtRefreshToken } = req.cookies;
    const user = yield userModel_js_1.default.findById(req.user._id).select("+password");
    const passwordCompare = yield user.comparePasswords(oldPassword, user.password);
    if (!passwordCompare) {
        return next(new appError_js_1.default("Passwords do not match", 422));
    }
    user.password = password;
    yield user.save();
    const verifyRefreshToken = jsonwebtoken_1.default.verify(jwtRefreshToken, process.env.JWT_REFRESH);
    generateJWTAcccessToken(user, res, req, verifyRefreshToken.remember);
    generateJWTRefreshToken(user, res, req, verifyRefreshToken.remember);
    // console.log(updatePassword);
    res.status(200).json({ status: "success", data: { user } });
}));
exports.auth = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwtAccessToken;
    const refreshToken = req.cookies.jwtRefreshToken;
    if (!token || !refreshToken) {
        res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
        return next(new appError_js_1.default("You are not logged in 1", 401));
    }
    const verifyAccsessToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, {
        ignoreExpiration: true,
    });
    const verifyRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH);
    const { hostName, platform, ip } = getOS(req);
    if (verifyAccsessToken.os.hostName !== hostName ||
        verifyAccsessToken.os.platform !== platform ||
        verifyAccsessToken.os.ip !== ip) {
        yield redis_js_1.redisDel(verifyRefreshToken.id);
        res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
        return next(new appError_js_1.default("Unauthenticated", 401));
    }
    const redisRefreshToken = yield redis_js_1.redisGet(verifyRefreshToken.id);
    if (!redisRefreshToken ||
        verifyRefreshToken.id !== verifyAccsessToken.id ||
        redisRefreshToken !== refreshToken) {
        yield redis_js_1.redisDel(verifyRefreshToken.id);
        res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
        return next(new appError_js_1.default("You are not logged in 4", 401));
    }
    const user = yield userModel_js_1.default.findById(verifyAccsessToken.id);
    if (!user || user.deletedAt) {
        yield redis_js_1.redisDel(verifyRefreshToken.id);
        res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
        return next(new appError_js_1.default("No such a user in token 2", 401));
    }
    if (verifyAccsessToken.exp * 1000 <= Date.now()) {
        generateJWTAcccessToken(user, res, req, verifyRefreshToken.remember);
        console.log("access token created");
        req.user = user;
        next();
    }
    else {
        req.user = user;
        next();
    }
}));
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new appError_js_1.default("You don't have permission to perform this action", 403));
    }
    next();
};
exports.restrictTo = restrictTo;
