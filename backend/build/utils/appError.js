"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(myMessage, myStatusCode) {
        super(myMessage);
        this.myMessage = myMessage;
        this.myStatusCode = myStatusCode;
        this.myStatus = `${myStatusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
