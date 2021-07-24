import multer, { FileFilterCallback } from "multer";
import { v4 } from "uuid";
import AppError from "../appError";
import sharp from "sharp";
import catchAsync from "../catchAsync";
import { NextFunction, Request, RequestHandler, Response } from "express";

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/avatars");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `avatar-${v4()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req: Request, file: any, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("This route only supports images", 400));
  }
};
export const userAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 15 * 1000 * 1000, files: 1 },
});
export const resize = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `avatar-${v4()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg()
      .toFile(`public/images/avatars/${req.file.filename}`);
    next();
  }
);
