"use client";

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { catalogApiUrl, type CatalogQuery } from "@/lib/catalog";
import { getData } from "@/lib/client/api";
import { queryKeys } from "@/lib/query-keys";
import type { CategoryItem } from "@/types/category";
import type { ProductPage } from "@/types/product";

export function useCatalogCategories(initialData?: CategoryItem[]) {
  return useQuery({
    queryKey: queryKeys.catalog.categories,
    queryFn: () => getData<CategoryItem[]>("/api/catalog/categories"),
    initialData,
    staleTime: 60_000,
  });
}

export function useCatalogProducts(
  query: CatalogQuery,
  initialPage?: ProductPage,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.catalog.products(query),
    queryFn: ({ pageParam }) =>
      getData<ProductPage>(catalogApiUrl(query, pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [1] }
      : undefined,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
