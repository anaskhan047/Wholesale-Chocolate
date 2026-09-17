"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";

type LogoutButtonProps = {
  redirectTo?: string;
};

export function LogoutButton({ redirectTo = "/" }: LogoutButtonProps) {
  const router = useRouter();
  const logout = useLogout();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() =>
        logout.mutate(undefined, {
          onSuccess: () => {
            router.push(redirectTo);
            router.refresh();
          },
        })
      }
      disabled={logout.isPending}
    >
      {logout.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
