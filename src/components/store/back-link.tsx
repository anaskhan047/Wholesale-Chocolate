"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

type BackLinkProps = {
  href?: string;
  label?: string;
  className?: string;
};

export function BackLink({
  href,
  label = "Back",
  className,
}: BackLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/" || pathname === "/admin") {
    return null;
  }

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-caramel",
          className,
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push("/");
      }}
      className={cn(
        "mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-caramel",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
