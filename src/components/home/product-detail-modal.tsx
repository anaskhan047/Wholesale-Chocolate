"use client";

import { OutOfStockBadge, ProductFacts } from "@/components/product-facts";
import { AddToCartControl } from "@/components/cart/add-to-cart-control";
import { Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/money";
import { isOutOfStock } from "@/lib/product-display";
import type { ProductItem } from "@/types/product";

type ProductDetailModalProps = {
  product: ProductItem;
  onClose: () => void;
};

export function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const out = isOutOfStock(product.quantity);

  return (
    <Modal maxWidth="max-w-lg" onClose={onClose} className="pt-4">
      <div className="space-y-4 pr-8">
        <div className="relative overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
          {out ? <OutOfStockBadge /> : null}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-caramel">
            {product.categoryName}
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-snug text-foreground">
            {product.name}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-3 sm:p-4">
          <ProductFacts product={product} />
          {!out ? (
            <p className="mt-2 text-xs text-muted-foreground">
              In stock: {product.quantity}
            </p>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl border border-border bg-card px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Sell price
            </dt>
            <dd className="font-semibold text-chocolate">
              {formatPrice(product.sellPrice)}
            </dd>
          </div>
          {product.piecePrice ? (
            <div className="rounded-xl border border-border bg-card px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Per piece
              </dt>
              <dd className="font-semibold">
                {formatPrice(product.piecePrice)}
              </dd>
            </div>
          ) : null}
          {product.packetPieceQty ? (
            <div className="rounded-xl border border-border bg-card px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Pieces / packet
              </dt>
              <dd className="font-semibold">{product.packetPieceQty}</dd>
            </div>
          ) : null}
          <div className="rounded-xl border border-border bg-card px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Availability
            </dt>
            <dd className={`font-semibold ${out ? "text-danger" : ""}`}>
              {out ? "Out of stock" : `${product.quantity} available`}
            </dd>
          </div>
        </dl>

        <AddToCartControl product={product} size="md" />
      </div>
    </Modal>
  );
}
