import express from "express";
import userRoutes from "./userRoutes";
import roleRoutes from "./roleRoutes";

const Router = express.Router();

Router.use("/user", userRoutes);
Router.use("/role", roleRoutes);

export default Router;
