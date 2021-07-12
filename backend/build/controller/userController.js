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
exports.user = exports.me = exports.updateMe = exports.resetPassword = exports.forgotPassword = exports.destroyMe = void 0;
const userModel_js_1 = __importDefault(require("../model/userModel.js"));
const catchAsync_js_1 = __importDefault(require("../utils/catchAsync.js"));
const appError_js_1 = __importDefault(require("../utils/appError.js"));
const filterObject_js_1 = __importDefault(require("../utils/filterObject.js"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const unlinkAsync = util_1.promisify(fs_1.default.unlink);
const accessAsync = util_1.promisify(fs_1.default.access);
const fsPromises = fs_1.default.promises;
exports.destroyMe = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_js_1.default.findByIdAndUpdate(req.user._id, {
        deletedAt: Date.now(),
    });
    yield redisDel(req.user._id.toString());
    res
        .status(200)
        .clearCookie("jwtAccessToken")
        .clearCookie("jwtRefreshToken")
        .json({ status: "success" });
}));
exports.forgotPassword = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_js_1.default.findOne({ email });
    if (!user) {
        return next(new appError_js_1.default("There is no user with that email", 400));
    }
    const resetToken = yield user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    console.log(resetToken);
    res.status(200).json({ status: "success", data: { token: resetToken } });
}));
exports.resetPassword = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password, passwordConfirmation } = req.body;
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = yield userModel_js_1.default.findOne({ passwordResetToken: hashedToken });
    console.log(user);
    if (!user || user.passwordResetTokenExpiresAt < Date.now()) {
        return next(new appError_js_1.default("Token is invalid or has expired", 400));
    }
    user.password = password;
    user.passwordConfirmation = passwordConfirmation;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    yield user.save();
    res.status(200).json({ status: "success" });
}));
exports.updateMe = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filtered = filterObject_js_1.default(req.body, "email", "name");
    if (req.file) {
        const user = yield userModel_js_1.default.findById(req.user._id).select("avatar");
        if (user.avatar) {
            yield unlinkAsync(`public/images/avatars/${user.avatar}`);
        }
        filtered.avatar = req.file.filename;
    }
    const updatedUser = yield userModel_js_1.default.findByIdAndUpdate(req.user._id, filtered, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ status: "success", data: { user: updatedUser } });
}));
exports.me = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const me = yield userModel_js_1.default.findById(req.user._id);
    res.status(200).json({ status: "success", data: { me } });
}));
exports.user = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_js_1.default.findById(id);
    // if (!user) {
    //   return next(new AppError("No user found ", 404));
    // }
    res.status(200).json({ status: "success", data: { user } });
}));
