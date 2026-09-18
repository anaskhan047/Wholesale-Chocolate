"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/cn";
import { isOutOfStock } from "@/lib/product-display";
import type { ProductItem } from "@/types/product";

type AddToCartControlProps = {
  product: ProductItem;
  size?: "sm" | "md";
  className?: string;
};

export function AddToCartControl({
  product,
  size = "sm",
  className,
}: AddToCartControlProps) {
  const { ready, getQty, addProduct, setQty } = useCart();
  const out = isOutOfStock(product.quantity);
  const qty = getQty(product.id);
  const compact = size === "sm";
  const maxStock = Math.max(0, product.quantity);
  const [draft, setDraft] = useState(String(qty || ""));

  useEffect(() => {
    setDraft(qty > 0 ? String(qty) : "");
  }, [qty]);

  const shell = cn(
    compact ? "mt-2 h-10" : "mt-1 h-11",
    "w-full",
    className,
  );

  function commitDraft(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setQty(product.id, 0, maxStock);
      setDraft("");
      return;
    }
    const next = Math.min(maxStock, Math.max(0, Number(digits)));
    if (next <= 0) {
      setQty(product.id, 0, maxStock);
      setDraft("");
      return;
    }
    setQty(product.id, next, maxStock);
    setDraft(String(next));
  }

  if (!ready) {
    return (
      <div className={cn(shell, "animate-pulse rounded-2xl bg-muted/80")} />
    );
  }

  if (out) {
    return (
      <div
        className={cn(
          shell,
          "inline-flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 px-2 text-[11px] font-semibold text-muted-foreground",
        )}
      >
        Out of stock
      </div>
    );
  }

  if (qty <= 0) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          addProduct(product, 1);
        }}
        className={cn(
          shell,
          "group/cart relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-2xl",
          "bg-linear-to-r from-chocolate to-[#7a4228] px-3 text-[11px] font-semibold text-cream shadow-[0_6px_16px_rgba(90,46,27,0.22)]",
          "transition hover:brightness-110 active:scale-[0.98] sm:text-xs",
          "ring-1 ring-gold/30",
        )}
      >
        <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-gold/20 to-transparent opacity-0 transition group-hover/cart:opacity-100" />
        <ShoppingBag className={cn("relative", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
        <span className="relative">Add to cart</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        shell,
        "inline-flex items-center justify-between gap-1 rounded-2xl border border-gold/50 bg-muted/40 p-1 shadow-inner",
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setQty(product.id, qty - 1, maxStock);
        }}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card text-chocolate shadow-sm ring-1 ring-border transition hover:border-gold hover:ring-gold/60 active:scale-95"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Cart quantity"
        value={draft}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "");
          if (!digits) {
            setDraft("");
            return;
          }
          const num = Number(digits);
          if (num > maxStock) {
            setDraft(String(maxStock));
            return;
          }
          setDraft(digits);
        }}
        onBlur={() => commitDraft(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="h-8 min-w-8 max-w-12 flex-1 bg-transparent px-1 text-center text-sm font-bold tabular-nums text-chocolate outline-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={maxStock > 0 && qty >= maxStock}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setQty(product.id, qty + 1, maxStock);
        }}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-caramel text-cream shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
