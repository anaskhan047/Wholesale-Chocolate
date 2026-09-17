"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJson } from "@/lib/client/api";
import type { AuthUser } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (body: { id: string; password: string }) => {
      const payload = await postJson<AuthUser>("/api/auth/login", body);
      return payload.data;
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { phone: string; password: string }) => {
      const payload = await postJson<AuthUser>("/api/auth/signup", body);
      return payload.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await postJson("/api/auth/logout");
    },
    onSuccess: () => queryClient.clear(),
  });
}
