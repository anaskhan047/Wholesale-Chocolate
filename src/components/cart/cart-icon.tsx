"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/cn";

export function CartIconButton() {
  const { totals, ready } = useCart();
  const count = ready ? totals.itemCount : 0;

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition",
        "hover:border-gold hover:shadow-[0_0_18px_rgba(228,184,92,0.35)]",
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel px-1 text-[10px] font-bold text-cream">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
