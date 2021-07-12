import mongoose, { Document } from "mongoose";
const objectID = mongoose.Schema.Types.ObjectId;
interface roleDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  role: string;
  createdBy: any;
}
const roleShema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "{PATH} is required"],
      lowercase: true,
      unique: true,
      trim: true,
      validate: [
        {
          validator: async function (role) {
            if (this.isModified("role" || this.isNew)) {
              const doc = await this.constructor.findOne({ role });

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

export default mongoose.model<roleDocument>("Role", roleShema);
