"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        login.mutate(
          { id, password },
          {
            onSuccess: (user) => {
              router.push(user.role === "admin" ? "/admin" : "/");
              router.refresh();
            },
          },
        );
      }}
      className="space-y-4"
    >
      <Input
        id="login-id"
        label="ID / Number"
        type="text"
        autoComplete="username"
        placeholder="Phone number or admin id"
        value={id}
        onChange={(event) => setId(event.target.value)}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        minLength={6}
        placeholder="Enter password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {login.isError ? (
        <p className="text-sm text-danger">
          {login.error instanceof Error ? login.error.message : "Request failed"}
        </p>
      ) : null}
      <Button type="submit" disabled={login.isPending}>
        {login.isPending ? "Please wait..." : "Login"}
      </Button>
    </form>
  );
}
