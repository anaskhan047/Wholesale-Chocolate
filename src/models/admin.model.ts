import { model, models, Schema } from "mongoose";

const adminSchema = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true },
);

export const Admin = models.Admin || model("Admin", adminSchema);
