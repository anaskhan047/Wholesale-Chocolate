"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getData, postJson, putJson } from "@/lib/client/api";
import {
  calcCartTotals,
  cartLineFromProduct,
  clearGuestCart,
  readGuestCart,
  setLineQty,
  writeGuestCart,
} from "@/lib/cart";
import type { AuthUser } from "@/types/auth";
import type { CartLine, CartTotals } from "@/types/cart";
import type { ProductItem } from "@/types/product";

type CartContextValue = {
  items: CartLine[];
  totals: CartTotals;
  ready: boolean;
  getQty: (productId: string) => number;
  addProduct: (product: ProductItem, qty?: number) => void;
  setQty: (productId: string, qty: number, stockCap?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  mergeGuestIntoAccount: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function putCart(items: CartLine[]) {
  await putJson<CartLine[]>("/api/cart", { items });
}

export function CartProvider({
  session,
  children,
}: {
  session?: AuthUser | null;
  children: ReactNode;
}) {
  // Always start empty on server + first client paint to avoid hydration mismatch.
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const isUser = session?.role === "user";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isUser && session?.id) {
        try {
          // Never merge on reload — that doubles qty (local mirror + server).
          // Guest → account merge happens only in login/signup.
          const remote = await getData<CartLine[]>("/api/cart");
          if (!cancelled) {
            setItems(remote);
            writeGuestCart(remote);
          }
        } catch {
          if (!cancelled) {
            setItems(readGuestCart());
          }
        }
      } else if (!cancelled) {
        setItems(readGuestCart());
      }
      if (!cancelled) {
        setReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isUser, session?.id]);

  const persist = useCallback(
    (next: CartLine[]) => {
      setItems(next);
      writeGuestCart(next);
      if (isUser) {
        void putCart(next).catch(() => {
          // Local copy already saved.
        });
      }
    },
    [isUser],
  );

  const getQty = useCallback(
    (productId: string) =>
      items.find((line) => line.productId === productId)?.qty ?? 0,
    [items],
  );

  const addProduct = useCallback(
    (product: ProductItem, qty = 1) => {
      if (product.quantity <= 0) {
        return;
      }
      const existing = items.find((line) => line.productId === product.id);
      if (existing) {
        const nextQty = Math.min(
          product.quantity,
          existing.qty + qty,
        );
        persist(
          setLineQty(items, product.id, nextQty).map((line) =>
            line.productId === product.id
              ? { ...line, stock: product.quantity }
              : line,
          ),
        );
        return;
      }
      const line = cartLineFromProduct(product, qty);
      persist([...items, line]);
    },
    [items, persist],
  );

  const setQty = useCallback(
    (productId: string, qty: number, stockCap?: number) => {
      if (qty <= 0) {
        persist(items.filter((line) => line.productId !== productId));
        return;
      }

      const next = items.map((line) => {
        if (line.productId !== productId) {
          return line;
        }
        const stock = stockCap !== undefined ? Math.max(0, stockCap) : line.stock;
        const max = stock > 0 ? stock : Math.floor(qty);
        return {
          ...line,
          stock,
          qty: Math.min(Math.max(1, Math.floor(qty)), max),
        };
      });

      persist(next);
    },
    [items, persist],
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist(items.filter((line) => line.productId !== productId));
    },
    [items, persist],
  );

  const clear = useCallback(() => {
    persist([]);
    clearGuestCart();
  }, [persist]);

  const mergeGuestIntoAccount = useCallback(async () => {
    const guest = readGuestCart();
    if (guest.length === 0) {
      const remote = await getData<CartLine[]>("/api/cart");
      setItems(remote);
      writeGuestCart(remote);
      return;
    }
    const merged = await postJson<CartLine[]>("/api/cart", { items: guest });
    clearGuestCart();
    setItems(merged.data);
    writeGuestCart(merged.data);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals: calcCartTotals(items),
      ready,
      getQty,
      addProduct,
      setQty,
      removeItem,
      clear,
      mergeGuestIntoAccount,
    }),
    [
      addProduct,
      clear,
      getQty,
      items,
      mergeGuestIntoAccount,
      ready,
      removeItem,
      setQty,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
