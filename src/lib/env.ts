import { AppError } from "@/lib/errors";

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function getMongoUri() {
  const uri = readEnv("MONGO_URI");
  if (!uri) {
    throw new Error("MONGO_URI is missing in .env");
  }
  if (uri.includes("<db_username>") || uri.includes("<db_password>")) {
    throw new Error(
      "MONGO_URI still has a placeholder. Replace <db_username> and <db_password> with your Atlas credentials",
    );
  }
  return uri;
}

export function getSecretKey() {
  const secret = readEnv("SECRET_KEY");
  if (!secret) {
    throw new Error("SECRET_KEY is missing in .env");
  }
  return secret;
}

export function getDbName() {
  return readEnv("DB_NAME") || "wholesale_chocolate";
}

export function getCloudinaryConfig() {
  const cloudName = readEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = readEnv("CLOUDINARY_API_KEY");
  const apiSecret = readEnv("CLOUDINARY_API_SECRET");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError(
      "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env",
      500,
    );
  }

  return { cloudName, apiKey, apiSecret };
}
