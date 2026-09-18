import type { CartLine, CartTotals } from "@/types/cart";

export const CART_STORAGE_KEY = "wc-guest-cart";
export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_MIN = 999;

export function cartLineFromProduct(
  product: {
    id: string;
    name: string;
    imageUrl: string;
    categoryName: string;
    sellPrice: number;
    piecePrice?: number;
    packetPieceQty?: number;
    quantity: number;
  },
  qty = 1,
): CartLine {
  return {
    productId: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    categoryName: product.categoryName,
    sellPrice: product.sellPrice,
    piecePrice: product.piecePrice,
    packetPieceQty: product.packetPieceQty,
    stock: product.quantity,
    qty: Math.max(1, Math.min(qty, Math.max(1, product.quantity || 1))),
  };
}

export function mergeCartLines(base: CartLine[], incoming: CartLine[]) {
  const map = new Map<string, CartLine>();

  for (const line of [...base, ...incoming]) {
    const prev = map.get(line.productId);
    if (!prev) {
      map.set(line.productId, { ...line, qty: Math.max(1, line.qty) });
      continue;
    }

    const stockCap = Math.max(prev.stock, line.stock);
    const combined = prev.qty + line.qty;
    const qty =
      stockCap > 0 ? Math.min(combined, stockCap) : Math.max(1, combined);
    map.set(line.productId, {
      ...prev,
      ...line,
      stock: stockCap,
      qty: Math.max(1, qty),
    });
  }

  return Array.from(map.values());
}

export function setLineQty(lines: CartLine[], productId: string, qty: number) {
  return lines
    .map((line) => {
      if (line.productId !== productId) {
        return line;
      }
      const next = Math.floor(qty);
      if (next <= 0) {
        return null;
      }
      const max = line.stock > 0 ? line.stock : next;
      return { ...line, qty: Math.min(next, max) };
    })
    .filter((line): line is CartLine => Boolean(line));
}

export function calcCartTotals(lines: CartLine[]): CartTotals {
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + line.sellPrice * line.qty,
    0,
  );
  const delivery =
    lines.length === 0 || subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;

  return {
    itemCount,
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}

export function readGuestCart(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(lines: CartLine[]) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function clearGuestCart() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(CART_STORAGE_KEY);
}
