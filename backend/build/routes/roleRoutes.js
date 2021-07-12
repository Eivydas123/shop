"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_js_1 = require("../controller/authController.js");
const roleController_js_1 = require("../controller/roleController.js");
const Router = express_1.default.Router({ mergeParams: true });
Router.use(authController_js_1.auth, authController_js_1.restrictTo("admin"));
Router.route("/").get(roleController_js_1.index).post(roleController_js_1.create).patch(roleController_js_1.updateUserRole);
exports.default = Router;
