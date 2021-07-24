import mongoose, { Document } from "mongoose";
import validators from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ip from "ip";
import os from "os";
export interface IAuthorizeDevice {
  code: Number;
  tokenExpiresAt: string;
}
export interface IAuthorizedDevices {
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
  passwordConfirmation: string | undefined;
  avatar: string;
  deletedAt: Date | undefined;
  passwordResetToken: string | undefined;
  code: number | undefined;
  codeExpiresAt: Date | undefined;
  authorizeDevice: IAuthorizeDevice;
  passwordResetTokenExpiresAt: Date | undefined;
  passwordChangedAt: Date;
  authorizedDevices: IAuthorizedDevices[];
  createPasswordResetToken(): string;
  compareOS: () => boolean;

  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  comparePasswords: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const authorizedDevicesSchema = new mongoose.Schema(
  {
    hostName: { type: String, required: true },
    platform: { type: String, required: true },
    ip: { type: String, required: true },
  },
  { _id: false }
);
const authorizeDeviceSchema = new mongoose.Schema(
  {
    code: { type: Number, required: true },
    token: { type: String, required: true },
    tokenExpiresAt: { type: Date, required: true },
  },
  { _id: false }
);
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
          validator: async function (email: string) {
            const user = this as unknown as IUser;
            if (user.isModified("email" || user.isNew)) {
              //@ts-ignore
              const doc: IUser = await user.constructor.findOne({
                email,
              });

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
      required: true,
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
      required: true,
      validate: {
        validator: function (passwordConfirmation: string) {
          const user = this as unknown as IUser;
          console.log("running", "is" + passwordConfirmation, user.password);
          return passwordConfirmation === user.password;
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
    authorizeDevice: authorizeDeviceSchema,
    authorizedDevices: [authorizedDevicesSchema],
    avatar: String,
    deletedAt: Date,
    passwordResetToken: { type: String, index: true },
    passwordResetTokenExpiresAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();
  user.password = await bcrypt.hash(this.password, 12);
  user.passwordConfirmation = undefined;

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
userSchema.methods.compareOS = function () {
  const user = this as IUser;
  const findDevice = user.authorizedDevices.find(
    (item) =>
      item.ip === ip.address() &&
      item.platform === os.platform() &&
      item.hostName === os.hostname()
  );
  if (findDevice) return true;

  const code: number = Math.floor(1000 + Math.random() * 9000);
  user.code = code;
  user.codeExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
  return false;
};
const createToken = () => {
  const token: string = crypto.randomBytes(64).toString("hex");
  const hashedToken: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  return { token, hashedToken };
};
userSchema.methods.createPasswordResetToken = function () {
  const user = this as IUser;
  const { token, hashedToken } = createToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return token;
};
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  const user = this as IUser;
  if (!user.passwordChangedAt) return false;
  console.log(
    JWTTimestamp,
    Math.floor(user.passwordChangedAt.getTime() / 1000)
  );
  return JWTTimestamp < Math.floor(user.passwordChangedAt.getTime() / 1000);
};

export default mongoose.model<IUser>("User", userSchema);
