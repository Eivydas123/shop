import mongoose from "mongoose";
import multer from "multer";
import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import AppError from "../utils/appError";
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.myStatusCode).json({
    status: err.myStatus,
    error: err,
    message: err.myMessage,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.myStatusCode).json({
      status: err.myStatus,
      message: err.myMessage,
      // error: err,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!!!",
      // stack: err,
    });
  }
};

const handleCastErrorDB = () => {
  return new AppError("Invalid data format", 400);
};
const handleDuplicateError = () => {
  return new AppError(`Duplicate field values`, 409);
};
const handleValidationError = (
  error: mongoose.Error.ValidationError,
  res: Response
) => {
  const formattedError = Object.values(error.errors)
    .map((err: any) => ({
      message: err.message,
      field: err.path,
      value: err.value ?? "",
    }))
    .reduce((obj, cur) => ({ ...obj, [cur.field]: cur }), {});
  return res.status(422).json({ status: "fail", errors: formattedError });
};
const handleJWTError = (res: Response) => {
  res.clearCookie("jwtAccessToken").clearCookie("jwtRefreshToken");
  return new AppError("Invalid token please log in again", 401);
};
const handleCSRFError = (error: { message: string }) =>
  new AppError(error.message, 403);
const handleMulterError = (error: Error) => {
  console.log(error);
  return new AppError(error.message, 400);
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.myStatusCode = err.myStatusCode || 500;
  err.myStatus = err.myStatus || "error";
  console.log(err);
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB();
    if (err.code === 11000) error = handleDuplicateError();
    if (err instanceof mongoose.Error.ValidationError)
      return (error = handleValidationError(error, res));
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
      error = handleJWTError(res);
    if (err.code === "EBADCSRFTOKEN") error = handleCSRFError(error);
    if (err instanceof multer.MulterError) error = handleMulterError(error);
    // if (err.name === "Error") error = handleRedisError(error);

    sendErrorProd({ ...error, message: err.message }, res);
  }
};
