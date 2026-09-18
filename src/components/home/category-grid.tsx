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
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caramel">
          Categories
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
          Select the category
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap a category to filter products
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="category-scroll -mx-2 flex gap-3 overflow-x-auto px-2 pb-2 sm:-mx-0 sm:gap-4 sm:px-0 lg:flex-wrap lg:overflow-visible"
      >
        {categories.map((category) => {
          const active = activeId === category.id;
          return (
            <motion.button
              key={category.id}
              type="button"
              variants={fadeUpItem}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(active ? "" : category.id)}
              className={cn(
                "group flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-24",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
              aria-pressed={active}
            >
              <span
                className={cn(
                  "relative block size-[4.75rem] overflow-hidden rounded-full bg-muted ring-2 transition duration-300 sm:size-24",
                  active
                    ? "ring-gold shadow-[0_0_0_3px_color-mix(in_srgb,var(--gold)_35%,transparent)]"
                    : "ring-border group-hover:ring-gold/70",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </span>
              <span
                className={cn(
                  "line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight sm:text-sm",
                  active ? "text-caramel" : "text-foreground",
                )}
              >
                {category.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
