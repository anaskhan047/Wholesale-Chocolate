import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "@/lib/env";
import { AppError } from "@/lib/errors";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

function configureCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return cloudinary;
}

export function validateImageFile(file: File) {
  if (!file || file.size === 0) {
    throw new AppError("Please choose an image");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new AppError("Image must be JPG, PNG, or WEBP");
  }

  if (file.size > MAX_BYTES) {
    throw new AppError("Image must be smaller than 5MB");
  }

  return file;
}

export function uploadImage(file: File, folder = "wholesale-chocolate/categories") {
  const client = configureCloudinary();

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError("Image upload failed. Check Cloudinary keys", 502));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    file
      .arrayBuffer()
      .then((buffer) => {
        stream.end(Buffer.from(buffer));
      })
      .catch(reject);
  });
}

export async function uploadImageFromPath(
  filePath: string,
  folder = "wholesale-chocolate/categories",
) {
  const client = configureCloudinary();
  const result = await client.uploader.upload(filePath, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  if (!result.secure_url || !result.public_id) {
    throw new AppError("Image upload failed. Check Cloudinary keys", 502);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadImageFromUrl(
  imageUrl: string,
  folder = "wholesale-chocolate/categories",
) {
  const client = configureCloudinary();
  const result = await client.uploader.upload(imageUrl, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  if (!result.secure_url || !result.public_id) {
    throw new AppError("Image upload failed. Check Cloudinary keys", 502);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string) {
  if (!publicId) {
    return;
  }

  try {
    const client = configureCloudinary();
    await client.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
}
