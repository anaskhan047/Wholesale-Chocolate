import { connectDb } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { mergeCartLines } from "@/lib/cart";
import { requireObjectId } from "@/lib/mongo-id";
import { Cart } from "@/models/cart.model";
import { Product } from "@/models/product.model";
import type { CartLine } from "@/types/cart";

function toLine(item: CartLine): CartLine {
  return {
    productId: String(item.productId),
    name: String(item.name),
    imageUrl: String(item.imageUrl),
    categoryName: String(item.categoryName || "Category"),
    sellPrice: Number(item.sellPrice) || 0,
    piecePrice:
      item.piecePrice === undefined || item.piecePrice === null
        ? undefined
        : Number(item.piecePrice),
    packetPieceQty:
      item.packetPieceQty === undefined || item.packetPieceQty === null
        ? undefined
        : Number(item.packetPieceQty),
    stock: Math.max(0, Number(item.stock) || 0),
    qty: Math.max(1, Number(item.qty) || 1),
  };
}

async function refreshStock(lines: CartLine[]) {
  if (lines.length === 0) {
    return [];
  }

  const ids = lines
    .map((line) => line.productId)
    .filter((id) => {
      try {
        requireObjectId(id, "Product");
        return true;
      } catch {
        return false;
      }
    });

  const products = await Product.find({ _id: { $in: ids } })
    .select("quantity")
    .lean();
  const stockMap = new Map(
    products.map((product) => [
      product._id.toString(),
      Number(product.quantity) || 0,
    ]),
  );

  return lines
    .map((line) => {
      const stock = stockMap.get(line.productId);
      if (stock === undefined) {
        return null;
      }
      if (stock <= 0) {
        return { ...line, stock, qty: line.qty };
      }
      return { ...line, stock, qty: Math.min(line.qty, stock) };
    })
    .filter((line): line is CartLine => Boolean(line));
}

function normalizeIncoming(items: unknown): CartLine[] {
  if (!Array.isArray(items)) {
    throw new AppError("Invalid cart items");
  }
  return items.map((item) => toLine(item as CartLine));
}

export async function getUserCart(userId: string) {
  await connectDb();
  const id = requireObjectId(userId, "User");
  const cart = await Cart.findOne({ userId: id }).lean();
  const items = ((cart?.items as CartLine[] | undefined) ?? []).map(toLine);
  return refreshStock(items);
}

export async function saveUserCart(userId: string, items: unknown) {
  await connectDb();
  const id = requireObjectId(userId, "User");
  const normalized = await refreshStock(normalizeIncoming(items));

  await Cart.findOneAndUpdate(
    { userId: id },
    { $set: { items: normalized } },
    { upsert: true, new: true },
  );

  return normalized;
}

export async function mergeUserCart(userId: string, guestItems: unknown) {
  await connectDb();
  const id = requireObjectId(userId, "User");
  const existing = await getUserCart(userId);
  const incoming = await refreshStock(normalizeIncoming(guestItems));
  const merged = await refreshStock(mergeCartLines(existing, incoming));

  await Cart.findOneAndUpdate(
    { userId: id },
    { $set: { items: merged } },
    { upsert: true, new: true },
  );

  return merged;
}
