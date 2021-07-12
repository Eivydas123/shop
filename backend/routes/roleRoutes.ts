import express from "express";
import { auth, restrictTo } from "../controller/authController";
import { index, create, updateUserRole } from "../controller/roleController";

const Router = express.Router({ mergeParams: true });

Router.use(auth, restrictTo("admin"));
Router.route("/").get(index).post(create).patch(updateUserRole);

export default Router;
