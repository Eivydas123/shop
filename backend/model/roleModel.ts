import mongoose, { Document } from "mongoose";
import { IUser } from "./userModel";
const objectID = mongoose.Schema.Types.ObjectId;

interface IRole extends Document {
  role: string;
  createdBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}
const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "{PATH} is required"],
      lowercase: true,
      unique: true,
      trim: true,
      validate: [
        {
          validator: async function (role: string) {
            const roleModel = this as unknown as IRole;
            if (roleModel.isModified("role" || roleModel.isNew)) {
              //@ts-ignore
              const doc: IRole = await roleModel.constructor.findOne({
                role: role,
              });

              if (doc) {
                return false;
              }
            }

            return true;
          },
          message: (props) => `The specified ${props.path} is already in use.`,
        },
      ],
    },
    createdBy: { type: objectID, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRole>("Role", roleSchema);
