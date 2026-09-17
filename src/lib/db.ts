import mongoose from "mongoose";
import { getDbName, getMongoUri } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { getConnectUri } from "@/lib/mongo-uri";
import { ensureAdmin } from "@/lib/seed-admin";

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as typeof globalThis & {
  mongooseCache?: Cache;
};

const cache = globalCache.mongooseCache ?? { conn: null, promise: null };
globalCache.mongooseCache = cache;

export async function connectDb() {
  try {
    if (cache.conn) {
      return cache.conn;
    }

    if (!cache.promise) {
      cache.promise = getConnectUri(getMongoUri()).then((uri) =>
        mongoose.connect(uri, {
          dbName: getDbName(),
          bufferCommands: false,
          family: 4,
          serverSelectionTimeoutMS: 12000,
        }),
      );
    }

    cache.conn = await cache.promise;
    await ensureAdmin();
    return cache.conn;
  } catch (error) {
    cache.conn = null;
    cache.promise = null;
    console.error("MongoDB connection failed:", error);
    throw new AppError(
      "Cannot connect to database. Check MONGO_URI in .env",
      503,
    );
  }
}
