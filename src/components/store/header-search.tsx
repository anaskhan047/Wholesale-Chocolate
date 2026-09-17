"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { catalogHref } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQ = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const [open, setOpen] = useState(Boolean(urlQ));
  const [draft, setDraft] = useState(urlQ);

  const commit = useCallback(
    (nextQ: string) => {
      const href = catalogHref({ q: nextQ, category });
      if (pathname === "/") {
        router.replace(href, { scroll: false });
        return;
      }
      router.push(href);
    },
    [category, pathname, router],
  );

  useEffect(() => {
    setDraft(urlQ);
    if (urlQ) {
      setOpen(true);
    }
  }, [urlQ]);

  useEffect(() => {
    if (!open) {
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || draft === urlQ) {
      return;
    }
    const timer = window.setTimeout(() => commit(draft), 400);
    return () => window.clearTimeout(timer);
  }, [commit, draft, open, urlQ]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    commit(draft);
  }

  function clear() {
    setDraft("");
    commit("");
    inputRef.current?.focus();
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex items-center justify-end",
        open &&
          "absolute inset-y-0 left-3 right-14 z-20 sm:static sm:inset-auto",
      )}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-full border border-border bg-card shadow-sm transition-all",
          open
            ? "h-10 w-full gap-1 pl-3 pr-1 sm:w-56 lg:w-64"
            : "h-10 w-10 justify-center hover:border-gold hover:shadow-[0_0_18px_rgba(228,184,92,0.35)]",
        )}
      >
        {open ? (
          <>
            <Search className="h-4 w-4 shrink-0 text-caramel" />
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {draft ? (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search products"
            className="inline-flex h-10 w-10 items-center justify-center text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
