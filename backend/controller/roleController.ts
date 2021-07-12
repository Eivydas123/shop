import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Role from "../model/roleModel";
import User from "../model/userModel";
import { NextFunction, Request, Response } from "express";

export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    const roleCreate = await Role.create({
      role,
      createdBy: req.user._id,
    });
    res.status(201).json({ status: "success", roleCreate });
  }
);
export const updateUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.params;
    const { role } = req.body;
    if (!role) {
      return next(new AppError("Please provide a role", 422));
    }
    const findUser = await User.findById(user);
    if (!findUser) {
      return next(new AppError("This user is no longer exists", 404));
    }
    const findRole = await Role.findOne({ role });
    if (!findRole) {
      return next(new AppError("This role does not exists", 404));
    }
    findUser.role = findRole.role;
    await findUser.save({ validateBeforeSave: false });
    res.status(200).json({ status: "success", data: { user: findUser } });
  }
);
export const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roles = await Role.find().populate("createdBy", "name email");
    res.status(200).json({ status: "success", data: { roles } });
  }
);
