"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_js_1 = require("../controller/authController.js");
const userController_js_1 = require("../controller/userController.js");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const roleRoutes_js_1 = __importDefault(require("./roleRoutes.js"));
const userAvatar_js_1 = require("../utils/multer/userAvatar.js");
const Router = express_1.default.Router();
const loginRateLimit = express_rate_limit_1.default({
    windowMs: 1 * 60 * 1000,
    max: 5,
});
Router.use("/:user/role", roleRoutes_js_1.default);
// Router.param("id", (req, res, next, id) => {
//   if (!ObjectId.isValid(id)) {
//     return next(new AppError("Invalid Database ID", 400));
//   }
//   next();
// });
Router.post("/signup", 
// registerValidator,
// registerValidationResults,
authController_js_1.signUp);
Router.post("/login", loginRateLimit, authController_js_1.login);
Router.post("/logout", authController_js_1.logout);
Router.patch("/update-password", authController_js_1.auth, authController_js_1.updatePassword);
Router.patch("/update-me", authController_js_1.auth, userAvatar_js_1.userAvatar.single("avatar"), userAvatar_js_1.resize, userController_js_1.updateMe);
Router.post("/forgot-password", userController_js_1.forgotPassword);
Router.post("/reset-password/:token", userController_js_1.resetPassword);
Router.get("/me", authController_js_1.auth, authController_js_1.restrictTo("admin", "user"), userController_js_1.me);
Router.get("/:id", authController_js_1.auth, authController_js_1.restrictTo("admin", "user"), userController_js_1.user);
Router.delete("/", authController_js_1.auth, userController_js_1.destroyMe);
exports.default = Router;
