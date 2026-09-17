import mongoose from "mongoose";
import { deleteImage, uploadImage, validateImageFile } from "@/lib/cloudinary";
import { connectDb } from "@/lib/db";
import { AppError } from "@/lib/errors";
import {
  ADMIN_CACHE_TTL,
  CATALOG_CACHE_TTL,
  invalidateCache,
  withCache,
} from "@/lib/server-cache";
import { toSlug } from "@/lib/slug";
import { normalizeText } from "@/lib/validate";
import { Category } from "@/models/category.model";
import type { CategoryItem } from "@/types/category";

function toCategory(category: {
  _id: { toString(): string };
  name: string;
  slug: string;
  imageUrl: string;
  createdAt?: Date;
}): CategoryItem {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    imageUrl: category.imageUrl,
    createdAt: category.createdAt?.toISOString() ?? "",
  };
}

function getCategoryId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Category not found", 404);
  }
  return id;
}

function parseName(nameValue: unknown) {
  const name = normalizeText(nameValue);
  if (name.length < 2) {
    throw new AppError("Category name must be at least 2 characters");
  }

  const slug = toSlug(name);
  if (!slug) {
    throw new AppError("Enter a valid category name");
  }

  return { name, slug };
}

export async function listCategories() {
  return withCache("catalog:categories", CATALOG_CACHE_TTL, async () => {
    await connectDb();
    const categories = await Category.find()
      .select("name slug imageUrl createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return categories.map(toCategory);
  });
}

export async function countCategories() {
  return withCache("admin:count:categories", ADMIN_CACHE_TTL, async () => {
    await connectDb();
    return Category.countDocuments();
  });
}

export async function createCategory(nameValue: unknown, image: File) {
  const { name, slug } = parseName(nameValue);
  const file = validateImageFile(image);
  await connectDb();

  const exists = await Category.exists({ $or: [{ name }, { slug }] });
  if (exists) {
    throw new AppError("This category already exists", 409);
  }

  const uploaded = await uploadImage(file);
  const category = await Category.create({
    name,
    slug,
    imageUrl: uploaded.url,
    imagePublicId: uploaded.publicId,
  });

  invalidateCache();
  return toCategory(category);
}

export async function updateCategory(
  idValue: string,
  nameValue: unknown,
  image?: File | null,
) {
  const id = getCategoryId(idValue);
  const { name, slug } = parseName(nameValue);
  await connectDb();

  const category = await Category.findById(id).select(
    "name slug imageUrl imagePublicId createdAt",
  );
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const exists = await Category.exists({
    _id: { $ne: category._id },
    $or: [{ name }, { slug }],
  });
  if (exists) {
    throw new AppError("This category already exists", 409);
  }

  const oldPublicId = category.imagePublicId as string;
  category.name = name;
  category.slug = slug;

  if (image && image.size > 0) {
    const uploaded = await uploadImage(validateImageFile(image));
    category.imageUrl = uploaded.url;
    category.imagePublicId = uploaded.publicId;
    await category.save();
    if (oldPublicId && oldPublicId !== uploaded.publicId) {
      await deleteImage(oldPublicId);
    }
  } else {
    await category.save();
  }

  invalidateCache();
  return toCategory(category);
}

export async function deleteCategory(idValue: string) {
  const id = getCategoryId(idValue);
  await connectDb();

  const category = await Category.findById(id).select("imagePublicId");
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const publicId = category.imagePublicId as string;
  await category.deleteOne();
  await deleteImage(publicId);
  invalidateCache();

  return { id };
}
