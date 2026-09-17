import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
  },
  { timestamps: true },
);

export const User = models.User || model("User", userSchema);
