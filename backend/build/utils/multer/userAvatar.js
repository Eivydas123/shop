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
exports.resize = exports.userAvatar = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const appError_js_1 = __importDefault(require("../appError.js"));
const sharp_1 = __importDefault(require("sharp"));
const catchAsync_js_1 = __importDefault(require("../catchAsync.js"));
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/avatars");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `avatar-${v4()}.${ext}`);
//   },
// });
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new appError_js_1.default("This route only supports images", 400), false);
    }
};
exports.userAvatar = multer_1.default({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 15 * 1000 * 1000, files: 1 },
});
exports.resize = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return next();
    req.file.filename = `avatar-${uuid_1.v4()}.jpeg`;
    yield sharp_1.default(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg()
        .toFile(`public/images/avatars/${req.file.filename}`);
    next();
}));
