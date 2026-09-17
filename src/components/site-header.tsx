"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CategoryNavLink } from "@/components/store/category-nav-link";
import { HeaderSearch } from "@/components/store/header-search";
import { useHash } from "@/components/store/use-hash";
import {
  STORE_NAV,
  accountHref,
  isStoreNavActive,
  storeNavHref,
} from "@/components/store/store-nav";
import { cn } from "@/lib/cn";
import type { AuthUser } from "@/types/auth";

type SiteHeaderProps = {
  session?: AuthUser | null;
};

function SearchFallback() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm">
      <Search className="h-4 w-4" />
    </span>
  );
}

export function SiteHeader({ session }: SiteHeaderProps) {
  const pathname = usePathname();
  const hash = useHash();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl"
    >
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-gold/50">
            <Image
              src="/logo.png"
              alt="Wholesale Chocolate"
              fill
              className="object-cover"
            />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
            Cocoa House
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {STORE_NAV.map((item) => {
            const target =
              item.id === "account"
                ? accountHref(session?.role)
                : storeNavHref(item);
            const active = isStoreNavActive(item.id, pathname, hash);
            const className = cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition hover:bg-muted hover:text-caramel",
              active && "bg-muted text-caramel",
            );
            const label =
              item.id === "account" && session
                ? session.role === "admin"
                  ? "Admin"
                  : "Account"
                : item.label;

            if (item.id === "categories") {
              return (
                <CategoryNavLink key={item.id} className={className}>
                  {label}
                </CategoryNavLink>
              );
            }

            return (
              <Link key={item.id} href={target} className={className}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Suspense fallback={<SearchFallback />}>
            <HeaderSearch />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
