"use client";

import type { RefObject } from "react";
import { motion } from "motion/react";
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
          className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <motion.article
              key={product.id}
              variants={fadeUpItem}
              whileHover={{ y: -4 }}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-gold/80 hover:shadow-[0_10px_28px_rgba(90,46,27,0.14)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {isOutOfStock(product.quantity) ? <OutOfStockBadge /> : null}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3.5">
                <p className="truncate text-[11px] font-medium uppercase tracking-wide text-caramel sm:text-xs">
                  {product.categoryName}
                </p>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
                  {product.name}
                </h3>
                <div className="mt-auto pt-1">
                  <ProductFacts product={product} />
                </div>
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
    </section>
  );
}
