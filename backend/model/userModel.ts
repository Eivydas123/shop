import mongoose, { Document } from "mongoose";
import validators from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ip from "ip";
import os from "os";
export interface IAuthorizedDevices {
  _id: string;
  hostName: string;
  platform: string;
  ip: string;
}
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  password: string;
  passwordConfirmation: string;
  avatar: string;
  deletedAt: Date;
  passwordResetToken: string;
  code: number;
  codeExpiresAt: Date;
  passwordResetTokenExpiresAt: Date;
  authorizedDevices: IAuthorizedDevices[];
  createPasswordResetToken(): string;
  compareOS: () => boolean;
  comparePasswords: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const authorizedDevicesSchema = new mongoose.Schema({
  hostName: { type: String, required: true },
  platform: { type: String, required: true },
  ip: { type: String, required: true },
});
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "{PATH} is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "{PATH} is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [
        {
          validator: async function (email) {
            if (this.isModified("email" || this.isNew)) {
              const doc = await this.constructor.findOne({ email });

              if (doc) {
                return false;
              }
            }
            return true;
          },
          message: (props) => `The specified ${props.path} is already in use.`,
        },
        {
          validator: validators.isEmail,
          message: (props) => `${props.path} is not valid`,
        },
      ],
    },
    password: {
      type: String,
      required: [true, "{PATH} is required"],
      select: false,
      validate: [
        {
          validator: (val: string) =>
            validators.isStrongPassword(val, { minSymbols: 0 }),
          message: (props) =>
            `${props.path} must contain at least one upperCase, one lowerCase, one number and total length must be 8 characters long`,
        },
      ],
    },
    passwordConfirmation: {
      type: String,
      required: [true, "{PATH} is required"],
      validate: {
        validator: function (passwordConfirmation) {
          console.log("running");
          return passwordConfirmation === this.password;
        },
        message: (props) => `passwords must match`,
      },
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "{PATH} is required"],
      default: "user",
    },
    code: { type: Number, min: 1000, max: 9999 },
    codeExpiresAt: Date,
    authorizedDevices: [authorizedDevicesSchema],
    avatar: String,
    deletedAt: Date,
    passwordResetToken: { type: String, index: true },
    passwordResetTokenExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("running");
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;

  next();
});
userSchema.pre(["find", "findOne"], async function (next) {
  this.find({ deletedAt: { $exists: false } });

  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.compareOS = async function (this: IUser) {
  const findDevice = this.authorizedDevices.find(
    (item) =>
      item.ip === ip.address() &&
      item.platform === os.platform() &&
      item.hostName === os.hostname()
  );
  if (findDevice) {
    const code: number = Math.floor(1000 + Math.random() * 9000);
    this.code = code;
    this.codeExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
    return false;
  }
  return true;
};
userSchema.methods.createPasswordResetToken = function (this: IUser) {
  const token: string = crypto.randomBytes(64).toString("hex");
  const hashedToken: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return token;
};

export default mongoose.model<IUser>("User", userSchema);
