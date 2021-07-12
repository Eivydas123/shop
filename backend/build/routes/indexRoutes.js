"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_js_1 = __importDefault(require("./userRoutes.js"));
const roleRoutes_js_1 = __importDefault(require("./roleRoutes.js"));
const Router = express_1.default.Router();
Router.use("/user", userRoutes_js_1.default);
Router.use("/role", roleRoutes_js_1.default);
exports.default = Router;
