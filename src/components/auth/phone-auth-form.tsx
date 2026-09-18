"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/hooks/use-auth";
import { clearGuestCart, readGuestCart } from "@/lib/cart";
import { postJson } from "@/lib/client/api";
import type { CartLine } from "@/types/cart";

export function PhoneAuthForm() {
  const router = useRouter();
  const signup = useSignup();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        signup.mutate(
          { phone, password },
          {
            onSuccess: async () => {
              const guest = readGuestCart();
              if (guest.length > 0) {
                try {
                  await postJson<CartLine[]>("/api/cart", { items: guest });
                  clearGuestCart();
                } catch {
                  // CartProvider will retry merge later.
                }
              }
              router.push("/");
              router.refresh();
            },
          },
        );
      }}
      className="space-y-4"
    >
      <Input
        id="phone"
        label="Phone number"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        placeholder="9876543210"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
        }
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        minLength={6}
        placeholder="At least 6 characters"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {signup.isError ? (
        <p className="text-sm text-danger">
          {signup.error instanceof Error ? signup.error.message : "Request failed"}
        </p>
      ) : null}
      <Button type="submit" disabled={signup.isPending}>
        {signup.isPending ? "Please wait..." : "Create account"}
      </Button>
    </form>
  );
}
