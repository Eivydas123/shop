import express from "express";
import {
  signUp,
  login,
  logout,
  auth,
  updatePassword,
  restrictTo,
  authorizeDevice,
} from "../controller/authController";
import {
  updateMe,
  forgotPassword,
  resetPassword,
  me,
  user,
  destroyMe,
} from "../controller/userController";
import rateLimit from "express-rate-limit";
import roleRoutes from "./roleRoutes";
import { userAvatar, resize } from "../utils/multer/userAvatar";

const Router = express.Router();

const loginRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

Router.use("/:user/role", roleRoutes);
// Router.param("id", (req, res, next, id) => {
//   if (!ObjectId.isValid(id)) {
//     return next(new AppError("Invalid Database ID", 400));
//   }
//   next();
// });

Router.post(
  "/signup",
  // registerValidator,
  // registerValidationResults,
  signUp
);
Router.post("/login", loginRateLimit, login);
Router.post("/logout", logout);
Router.post("/authorize-device", authorizeDevice);
Router.patch("/update-password", auth, updatePassword);
Router.patch("/update-me", auth, userAvatar.single("avatar"), resize, updateMe);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password/:token", resetPassword);
Router.get("/me", auth, restrictTo("admin", "user"), me);
Router.get("/:id", auth, restrictTo("admin", "user"), user);

Router.delete("/", auth, destroyMe);

export default Router;
