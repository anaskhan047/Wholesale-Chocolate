"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { rememberScrollTarget } from "@/components/store/scroll-target";
import { scrollToId } from "@/lib/catalog";

type CategoryNavLinkProps = {
  className: string;
  children: ReactNode;
};

function markCategoriesInUrl() {
  const next = `${window.location.pathname}${window.location.search}#categories`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current !== next) {
    history.pushState(null, "", next);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

export function CategoryNavLink({ className, children }: CategoryNavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") {
      event.preventDefault();
      rememberScrollTarget("categories");
      router.push("/#categories");
      return;
    }

    event.preventDefault();
    markCategoriesInUrl();
    window.setTimeout(() => scrollToId("categories"), 0);
  }

  return (
    <Link href="/#categories" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
