"use client";

import { useState, type RefObject } from "react";
import { motion } from "motion/react";
import { AddToCartControl } from "@/components/cart/add-to-cart-control";
import { ProductDetailModal } from "@/components/home/product-detail-modal";
import { OutOfStockBadge, ProductFacts } from "@/components/product-facts";
import { isOutOfStock } from "@/lib/product-display";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import type { ProductItem } from "@/types/product";

type ProductGridProps = {
  products: ProductItem[];
  total: number;
  heading: string;
  hasMore: boolean;
  loadingMore: boolean;
  error: string;
  sentinelRef: RefObject<HTMLDivElement | null>;
};

export function ProductGrid({
  products,
  total,
  heading,
  hasMore,
  loadingMore,
  error,
  sentinelRef,
}: ProductGridProps) {
  const [selected, setSelected] = useState<ProductItem | null>(null);

  return (
    <section id="products" className="mt-8 scroll-mt-24 sm:mt-12">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caramel">
            Products
          </p>
          <h2 className="text-lg font-semibold sm:text-xl">{heading}</h2>
        </div>
        {total > 0 ? (
          <p className="shrink-0 text-xs text-muted-foreground sm:text-sm">
            {products.length} of {total}
          </p>
        ) : null}
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          No products match this search or category.
        </p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <motion.article
              key={product.id}
              variants={fadeUpItem}
              whileHover={{ y: -3 }}
              className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-gold/80 hover:shadow-[0_10px_28px_rgba(90,46,27,0.14)]"
            >
              <button
                type="button"
                onClick={() => setSelected(product)}
                className="flex min-h-0 min-w-0 flex-1 flex-col text-left"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {isOutOfStock(product.quantity) ? <OutOfStockBadge /> : null}
                </div>
                <div className="flex flex-1 flex-col px-2.5 pt-2 sm:px-3.5 sm:pt-3">
                  <p className="truncate text-[10px] font-medium uppercase tracking-wide text-caramel sm:text-[11px]">
                    {product.categoryName}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 min-h-[2.4rem] text-[13px] font-semibold leading-snug text-foreground sm:min-h-[2.6rem] sm:text-sm">
                    {product.name}
                  </h3>
                  <ProductFacts product={product} variant="card" />
                </div>
              </button>
              <div className="mt-auto px-2.5 pb-2.5 pt-1 sm:px-3.5 sm:pb-3.5">
                <AddToCartControl product={product} size="sm" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {error ? (
        <p className="mt-3 text-center text-sm text-danger">{error}</p>
      ) : null}

      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-6">
          <p className="text-sm text-muted-foreground">
            {loadingMore ? "Loading more products…" : "Scroll for more"}
          </p>
        </div>
      ) : products.length > 0 ? (
        <p className="mt-5 text-center text-xs text-muted-foreground">
          All products loaded
        </p>
      ) : null}

      {selected ? (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </section>
  );
}
