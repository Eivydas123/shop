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
exports.index = exports.updateUserRole = exports.create = void 0;
const catchAsync_js_1 = __importDefault(require("../utils/catchAsync.js"));
const appError_js_1 = __importDefault(require("../utils/appError.js"));
const roleModel_js_1 = __importDefault(require("../model/roleModel.js"));
const userModel_js_1 = __importDefault(require("../model/userModel.js"));
exports.create = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.body;
    const roleCreate = yield roleModel_js_1.default.create({
        role,
        createdBy: req.user._id,
    });
    res.status(201).json({ status: "success", roleCreate });
}));
exports.updateUserRole = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.params;
    const { role } = req.body;
    if (!role) {
        return next(new appError_js_1.default("Please provide a role", 422));
    }
    const findUser = yield userModel_js_1.default.findById(user);
    if (!findUser) {
        return next(new appError_js_1.default("This user is no longer exists", 404));
    }
    const findRole = yield roleModel_js_1.default.findOne({ role });
    if (!findRole) {
        return next(new appError_js_1.default("This role does not exists", 404));
    }
    findUser.role = findRole.role;
    yield findUser.save({ validateBeforeSave: false });
    res.status(200).json({ status: "success", data: { user: findUser } });
}));
exports.index = catchAsync_js_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield roleModel_js_1.default.find().populate("createdBy", "name email");
    res.status(200).json({ status: "success", data: { roles } });
}));
