"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, isActiveAdminPath } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

type AdminShellProps = {
  adminId: string;
  children: ReactNode;
};

export function AdminShell({ adminId, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-dark-chocolate/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(16rem,calc(100vw-2rem))] flex-col border-r border-border bg-card px-3 py-4 transition-transform md:static md:w-60 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
          Admin
        </p>
        <p className="mt-1 truncate px-2 text-sm font-semibold">Wholesale Chocolate</p>

        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {ADMIN_NAV.map((item) => {
            const active = isActiveAdminPath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="truncate px-2 text-xs text-muted-foreground">{adminId}</p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-3 text-sm font-medium md:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <p className="hidden min-w-0 text-sm font-semibold md:block">
            Admin panel
          </p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="w-24 sm:w-28">
              <LogoutButton redirectTo="/login" />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
