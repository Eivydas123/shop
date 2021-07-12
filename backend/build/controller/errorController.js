"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_js_1 = __importDefault(require("./../utils/appError.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const sendErrorDev = (err, res) => {
    res.status(err.myStatusCode).json({
        status: err.myStatus,
        error: err,
        message: err.myMessage,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.myStatusCode).json({
            status: err.myStatus,
            message: err.myMessage,
            // error: err,
        });
    }
    else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong!!!",
            // stack: err,
        });
    }
};
const handleCastErrorDB = (err) => {
    return new appError_js_1.default("Invalid data format", 400);
};
const handleDuplicateError = (error) => {
    return new appError_js_1.default(`Duplicate field values`, 409);
};
const handleValidationError = (error, res) => {
    const formatedError = Object.values(error.errors)
        .map((err) => {
        var _a;
        return ({
            message: err.message,
            field: err.path,
            value: (_a = err.value) !== null && _a !== void 0 ? _a : "",
        });
    })
        .reduce((obj, cur) => (Object.assign(Object.assign({}, obj), { [cur.field]: cur })), {});
    return res.status(422).json({ status: "fail", errors: formatedError });
};
const handleJWTError = (error, res, req) => {
    res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
    return new appError_js_1.default("Invalid token please log in again", 401);
};
const handleCSRFError = (error) => {
    return new appError_js_1.default(error.message, 403);
};
const handleMulterError = (error) => {
    console.log(error);
    return new appError_js_1.default(error.message, 400);
};
exports.default = (err, req, res, next) => {
    err.myStatusCode = err.myStatusCode || 500;
    err.myStatus = err.myStatus || "error";
    console.log(err);
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({}, err);
        if (err instanceof mongoose_1.default.Error.CastError)
            error = handleCastErrorDB(error);
        if (err.code === 11000)
            error = handleDuplicateError(error);
        if (err instanceof mongoose_1.default.Error.ValidationError)
            return (error = handleValidationError(error, res));
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
            error = handleJWTError(error, res, req);
        if (err.code === "EBADCSRFTOKEN")
            error = handleCSRFError(error);
        if (err instanceof multer_1.default.MulterError)
            error = handleMulterError(error);
        // if (err.name === "Error") error = handleRedisError(error);
        sendErrorProd(Object.assign(Object.assign({}, error), { message: err.message }), res);
    }
};
