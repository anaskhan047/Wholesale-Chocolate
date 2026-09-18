"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { DELIVERY_FEE, FREE_DELIVERY_MIN } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import type { AuthUser } from "@/types/auth";

type CartViewProps = {
  session: AuthUser | null;
};

export function CartView({ session }: CartViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, totals, setQty, removeItem, ready } = useCart();
  const loggedIn = session?.role === "user";
  const payReady = searchParams.get("pay") === "1" && loggedIn;

  function onProceed() {
    if (!loggedIn) {
      router.push("/login?next=/cart");
      return;
    }
    router.push("/cart?pay=1");
  }

  if (!ready) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        Loading cart…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center">
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add wholesale products to continue.
        </p>
        <Link
          href="/#products"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6 lg:space-y-0">
      <section className="min-w-0 space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caramel">
            Cart
          </p>
          <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
            Your items ({totals.itemCount})
          </h1>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-2.5 rounded-2xl border border-border bg-card p-2 sm:gap-3 sm:p-3"
            >
              <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium uppercase tracking-wide text-caramel">
                  {item.categoryName}
                </p>
                <h2 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
                  {item.name}
                </h2>
                <p className="mt-0.5 text-sm font-bold text-chocolate">
                  {formatPrice(item.sellPrice)}
                </p>
                {item.piecePrice ? (
                  <p className="text-[11px] text-muted-foreground">
                    Per piece {formatPrice(item.piecePrice)}
                    {item.packetPieceQty
                      ? ` · ${item.packetPieceQty} pcs/pack`
                      : ""}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() =>
                        setQty(item.productId, item.qty - 1, item.stock)
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      aria-label={`${item.name} quantity`}
                      defaultValue={item.qty}
                      key={`${item.productId}-${item.qty}`}
                      onBlur={(event) => {
                        const digits = event.target.value.replace(/\D/g, "");
                        const next = digits ? Number(digits) : 0;
                        const capped =
                          item.stock > 0
                            ? Math.min(next, item.stock)
                            : next;
                        setQty(item.productId, capped, item.stock);
                      }}
                      onChange={(event) => {
                        event.target.value = event.target.value.replace(
                          /\D/g,
                          "",
                        );
                      }}
                      className="h-8 w-10 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() =>
                        setQty(item.productId, item.qty + 1, item.stock)
                      }
                      disabled={item.stock > 0 && item.qty >= item.stock}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs font-medium text-danger hover:bg-muted"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              <p className="shrink-0 self-start text-xs font-semibold sm:text-sm">
                {formatPrice(item.sellPrice * item.qty)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4 lg:sticky lg:top-24">
        <h2 className="text-base font-semibold">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-semibold">{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="font-semibold">
              {totals.delivery === 0 ? "Free" : formatPrice(totals.delivery)}
            </dd>
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Free delivery on orders ≥ {formatPrice(FREE_DELIVERY_MIN)}. Otherwise{" "}
            {formatPrice(DELIVERY_FEE)}.
          </p>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-bold text-chocolate">
              {formatPrice(totals.total)}
            </dd>
          </div>
        </dl>

        <Button type="button" className="mt-4" onClick={onProceed}>
          {loggedIn ? "Proceed to pay" : "Login to proceed"}
        </Button>

        {payReady ? (
          <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-center text-xs text-foreground">
            Payment gateway coming next. Your cart total is{" "}
            <strong>{formatPrice(totals.total)}</strong>.
          </p>
        ) : null}

        {!loggedIn ? (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Guest cart is saved on this device. After login it moves to your
            account.
          </p>
        ) : null}
      </aside>
    </div>
  );
}
