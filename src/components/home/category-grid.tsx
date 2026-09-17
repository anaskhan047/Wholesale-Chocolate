"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import type { CategoryItem } from "@/types/category";

type CategoryGridProps = {
  categories: CategoryItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function CategoryGrid({
  categories,
  activeId,
  onSelect,
}: CategoryGridProps) {
  return (
    <section id="categories" className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caramel">
            Categories
          </p>
          <h2 className="text-base font-semibold sm:text-xl">Shop by cocoa</h2>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-5"
      >
        {categories.map((category) => {
          const active = activeId === category.id;
          return (
            <motion.button
              key={category.id}
              type="button"
              variants={fadeUpItem}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(active ? "" : category.id)}
              className={cn(
                "shine-card group min-w-0 overflow-hidden rounded-xl border bg-card text-left shadow-sm transition sm:rounded-2xl",
                active
                  ? "border-gold shadow-[0_0_18px_rgba(228,184,92,0.28)]"
                  : "border-border hover:border-gold/70",
              )}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-dark-chocolate/55 to-transparent" />
              </div>
              <p className="line-clamp-2 min-h-8 px-1 py-1.5 text-center text-[12px] font-semibold leading-tight sm:min-h-0 sm:px-2 sm:py-2.5 sm:text-sm">
                {category.name}
              </p>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
