import mongoose from "mongoose";
import { AppError } from "@/lib/errors";

export function isObjectId(id: string) {
  return mongoose.isValidObjectId(id);
}

export function requireObjectId(id: string, label = "Item") {
  if (!isObjectId(id)) {
    throw new AppError(`${label} not found`, 404);
  }
  return id;
}
