"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Phone, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { CategoryNavLink } from "@/components/store/category-nav-link";
import { useHash } from "@/components/store/use-hash";
import {
  STORE_NAV,
  accountHref,
  isStoreNavActive,
  storeNavHref,
} from "@/components/store/store-nav";
import { cn } from "@/lib/cn";
import { springSoft } from "@/lib/motion";
import type { AuthUser } from "@/types/auth";

const ICONS = {
  home: Home,
  categories: LayoutGrid,
  contact: Phone,
  account: UserRound,
};

type BottomNavProps = {
  session?: AuthUser | null;
};

export function BottomNav({ session }: BottomNavProps) {
  const pathname = usePathname();
  const hash = useHash();

  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springSoft}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {STORE_NAV.map((item) => {
          const Icon = ICONS[item.id];
          const href =
            item.id === "account"
              ? accountHref(session?.role)
              : storeNavHref(item);
          const active = isStoreNavActive(item.id, pathname, hash);
          const className = cn(
            "relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-medium text-muted-foreground transition",
            active && "text-caramel",
          );
          const label =
            item.id === "account" && session
              ? session.role === "admin"
                ? "Admin"
                : "You"
              : item.label;
          const inner = (
            <>
              {active ? (
                <motion.span
                  layoutId="bottom-nav-glow"
                  className="absolute inset-x-3 inset-y-0 rounded-2xl bg-gold/15"
                  transition={springSoft}
                />
              ) : null}
              <Icon className="relative h-5 w-5" />
              <span className="relative">{label}</span>
            </>
          );

          if (item.id === "categories") {
            return (
              <CategoryNavLink key={item.id} className={className}>
                {inner}
              </CategoryNavLink>
            );
          }

          return (
            <Link key={item.id} href={href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
