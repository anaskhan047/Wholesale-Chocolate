import { deleteImage, uploadImage, validateImageFile } from "@/lib/cloudinary";
import { connectDb } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { isObjectId, requireObjectId } from "@/lib/mongo-id";
import { toSlug } from "@/lib/slug";
import {
  normalizeText,
  parseOptionalNumber,
  parseRequiredNumber,
} from "@/lib/validate";
import { Category } from "@/models/category.model";
import { Product } from "@/models/product.model";
import { PRODUCT_PAGE_SIZE } from "@/lib/catalog";
import {
  ADMIN_CACHE_TTL,
  CATALOG_CACHE_TTL,
  catalogProductsCacheKey,
  invalidateCache,
  withCache,
} from "@/lib/server-cache";
import type { ProductItem, ProductPage } from "@/types/product";

const PRODUCT_LIST_FIELDS =
  "name slug category buyPrice sellPrice piecePrice packetPieceQty quantity imageUrl createdAt";

type ProductInput = {
  name: unknown;
  categoryId: unknown;
  buyPrice: unknown;
  sellPrice: unknown;
  piecePrice?: unknown;
  packetPieceQty?: unknown;
  quantity: unknown;
};

function toProduct(product: {
  _id: { toString(): string };
  name: string;
  slug: string;
  category:
    | { _id: { toString(): string }; name?: string }
    | { toString(): string };
  buyPrice: number;
  sellPrice: number;
  piecePrice?: number;
  packetPieceQty?: number;
  quantity: number;
  imageUrl: string;
  createdAt?: Date;
}): ProductItem {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    categoryId:
      typeof product.category === "object" &&
      product.category &&
      "_id" in product.category
        ? product.category._id.toString()
        : String(product.category),
    categoryName:
      typeof product.category === "object" &&
      product.category &&
      "name" in product.category
        ? (product.category.name ?? "Category")
        : "Category",
    buyPrice: product.buyPrice,
    sellPrice: product.sellPrice,
    piecePrice: product.piecePrice ?? undefined,
    packetPieceQty: product.packetPieceQty ?? undefined,
    quantity: product.quantity,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt?.toISOString() ?? "",
  };
}

async function parseProduct(input: ProductInput) {
  const name = normalizeText(input.name);
  if (name.length < 2) {
    throw new AppError("Product name must be at least 2 characters");
  }

  const slug = toSlug(name);
  if (!slug) {
    throw new AppError("Enter a valid product name");
  }

  const categoryId = requireObjectId(
    normalizeText(input.categoryId),
    "Category",
  );
  const category = await Category.exists({ _id: categoryId });
  if (!category) {
    throw new AppError("Select a valid category", 404);
  }

  return {
    name,
    slug,
    categoryId,
    buyPrice: parseRequiredNumber(input.buyPrice, "Buy price"),
    sellPrice: parseRequiredNumber(input.sellPrice, "Sell price"),
    piecePrice: parseOptionalNumber(input.piecePrice, "Per piece price"),
    packetPieceQty: parseOptionalNumber(
      input.packetPieceQty,
      "Per packet piece quantity",
      true,
    ),
    quantity: parseRequiredNumber(input.quantity, "Quantity", true),
  };
}

async function querySearchProducts(input: {
  q?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}): Promise<ProductPage> {
  const page = Math.max(1, Number(input.page) || 1);
  const limit = Math.min(
    PRODUCT_PAGE_SIZE,
    Math.max(1, Number(input.limit) || PRODUCT_PAGE_SIZE),
  );

  await connectDb();

  const filter: Record<string, unknown> = {};
  if (input.categoryId) {
    if (!isObjectId(input.categoryId)) {
      return { items: [], page, limit, total: 0, hasMore: false };
    }
    filter.category = input.categoryId;
  }

  const q = normalizeText(input.q);
  if (q) {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    filter.$or = [{ name: rx }, { slug: rx }];
  }

  const [rows, total] = await Promise.all([
    Product.find(filter)
      .select(PRODUCT_LIST_FIELDS)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items: rows.map(toProduct),
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

export async function searchProducts(input: {
  q?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  return withCache(
    catalogProductsCacheKey(input),
    CATALOG_CACHE_TTL,
    () => querySearchProducts(input),
  );
}

export async function listProducts() {
  return withCache("admin:products", ADMIN_CACHE_TTL, async () => {
    await connectDb();
    const products = await Product.find()
      .select(PRODUCT_LIST_FIELDS)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();
    return products.map(toProduct);
  });
}

export async function countProducts() {
  return withCache("admin:count:products", ADMIN_CACHE_TTL, async () => {
    await connectDb();
    return Product.countDocuments();
  });
}

export async function createProduct(input: ProductInput, image: File) {
  const file = validateImageFile(image);
  await connectDb();
  const data = await parseProduct(input);
  const uploaded = await uploadImage(file, "wholesale-chocolate/products");

  const product = await Product.create({
    name: data.name,
    slug: data.slug,
    category: data.categoryId,
    buyPrice: data.buyPrice,
    sellPrice: data.sellPrice,
    piecePrice: data.piecePrice,
    packetPieceQty: data.packetPieceQty,
    quantity: data.quantity,
    imageUrl: uploaded.url,
    imagePublicId: uploaded.publicId,
  });

  await product.populate("category", "name");
  invalidateCache();
  return toProduct(product);
}

export async function updateProduct(
  idValue: string,
  input: ProductInput,
  image?: File | null,
) {
  const id = requireObjectId(idValue, "Product");
  await connectDb();
  const data = await parseProduct(input);

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const oldPublicId = product.imagePublicId as string;
  product.name = data.name;
  product.slug = data.slug;
  product.category = data.categoryId;
  product.buyPrice = data.buyPrice;
  product.sellPrice = data.sellPrice;
  product.set("piecePrice", data.piecePrice);
  product.set("packetPieceQty", data.packetPieceQty);
  product.quantity = data.quantity;

  if (image && image.size > 0) {
    const uploaded = await uploadImage(
      validateImageFile(image),
      "wholesale-chocolate/products",
    );
    product.imageUrl = uploaded.url;
    product.imagePublicId = uploaded.publicId;
    await product.save();
    if (oldPublicId && oldPublicId !== uploaded.publicId) {
      await deleteImage(oldPublicId);
    }
  } else {
    await product.save();
  }

  await product.populate("category", "name");
  invalidateCache();
  return toProduct(product);
}

export async function deleteProduct(idValue: string) {
  const id = requireObjectId(idValue, "Product");
  await connectDb();

  const product = await Product.findById(id).select("imagePublicId");
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const publicId = product.imagePublicId as string;
  await product.deleteOne();
  await deleteImage(publicId);
  invalidateCache();

  return { id };
}
