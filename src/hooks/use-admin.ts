"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteJson, getData, patchForm, postForm } from "@/lib/client/api";
import { queryKeys } from "@/lib/query-keys";
import type { AdminStats } from "@/types/admin";
import type { CategoryItem } from "@/types/category";
import type { ProductItem } from "@/types/product";

function useInvalidateCatalog() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
    ]);
}

export function useAdminCategories(initialData?: CategoryItem[]) {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: () => getData<CategoryItem[]>("/api/admin/categories"),
    initialData,
    staleTime: 30_000,
  });
}

export function useAdminProducts(initialData?: ProductItem[]) {
  return useQuery({
    queryKey: queryKeys.admin.products,
    queryFn: () => getData<ProductItem[]>("/api/admin/products"),
    initialData,
    staleTime: 30_000,
  });
}

export function useAdminStats(initialData?: AdminStats) {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => getData<AdminStats>("/api/admin/stats"),
    initialData,
    staleTime: 30_000,
  });
}

export function useSaveCategory() {
  const invalidate = useInvalidateCatalog();

  return useMutation({
    mutationFn: async (input: { id?: string; form: FormData }) => {
      const payload = input.id
        ? await patchForm<CategoryItem>(
            `/api/admin/categories/${input.id}`,
            input.form,
          )
        : await postForm<CategoryItem>("/api/admin/categories", input.form);
      return payload.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCatalog();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteJson(`/api/admin/categories/${id}`);
      return id;
    },
    onSuccess: invalidate,
  });
}

export function useSaveProduct() {
  const invalidate = useInvalidateCatalog();

  return useMutation({
    mutationFn: async (input: { id?: string; form: FormData }) => {
      const payload = input.id
        ? await patchForm<ProductItem>(
            `/api/admin/products/${input.id}`,
            input.form,
          )
        : await postForm<ProductItem>("/api/admin/products", input.form);
      return payload.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateCatalog();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteJson(`/api/admin/products/${id}`);
      return id;
    },
    onSuccess: invalidate,
  });
}
