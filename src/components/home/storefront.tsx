"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductGrid } from "@/components/home/product-grid";
import { HashScroll } from "@/components/store/hash-scroll";
import { StoreShell } from "@/components/store/store-shell";
import { useCatalogCategories, useCatalogProducts } from "@/hooks/use-catalog";
import { catalogHref, EMPTY_PRODUCT_PAGE, scrollToId, type CatalogQuery } from "@/lib/catalog";
import type { AuthUser } from "@/types/auth";
import type { CategoryItem } from "@/types/category";
import type { ProductPage } from "@/types/product";

type StorefrontProps = {
  categories: CategoryItem[];
  initialPage: ProductPage;
  query: CatalogQuery;
  session: AuthUser | null;
};

export function Storefront({
  categories: initialCategories,
  initialPage,
  query,
  session,
}: StorefrontProps) {
  const router = useRouter();
  const { data: categories = [] } = useCatalogCategories(initialCategories ?? []);
  const categoryId = query?.category ?? "";
  const search = query?.q ?? "";
  const activeCategory = categories.find((item) => item.id === categoryId);
  const subtitle = [
    search ? `Search “${search}”` : null,
    activeCategory
      ? activeCategory.name
      : categoryId
        ? "Selected category"
        : null,
  ]
    .filter(Boolean)
    .join(" · ");

  function selectCategory(id: string) {
    router.push(catalogHref({ q: search, category: id }), { scroll: false });
    window.setTimeout(() => scrollToId("products"), 80);
  }

  return (
    <StoreShell session={session} intro>
      <HashScroll />
      <CategoryGrid
        categories={categories}
        activeId={categoryId}
        onSelect={selectCategory}
      />
      <ProductFeed
        query={query ?? { q: "", category: "" }}
        initialPage={initialPage ?? EMPTY_PRODUCT_PAGE}
        heading={subtitle || "Ready to wholesale"}
      />
    </StoreShell>
  );
}

function ProductFeed({
  query,
  initialPage,
  heading,
}: {
  query: CatalogQuery;
  initialPage: ProductPage;
  heading: string;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useCatalogProducts(query, initialPage);

  const products = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? initialPage.total ?? 0;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <ProductGrid
      products={products}
      total={total}
      heading={heading}
      hasMore={Boolean(hasNextPage)}
      loadingMore={isFetchingNextPage}
      error={isError ? (error instanceof Error ? error.message : "Could not load products") : ""}
      sentinelRef={sentinelRef}
    />
  );
}
