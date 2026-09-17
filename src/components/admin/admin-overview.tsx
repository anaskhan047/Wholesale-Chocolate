"use client";

import { useAdminStats } from "@/hooks/use-admin";
import type { AdminStats } from "@/types/admin";

type AdminOverviewProps = {
  initialStats: AdminStats;
};

export function AdminOverview({ initialStats }: AdminOverviewProps) {
  const { data } = useAdminStats(initialStats);
  const stats = data ?? initialStats;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
        Dashboard
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        Overview
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Wholesale chocolate admin snapshot.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Users</p>
          <p className="mt-2 text-3xl font-semibold">{stats.users}</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="mt-2 text-3xl font-semibold">{stats.categories}</p>
        </article>
        <article className="col-span-2 rounded-2xl border border-border bg-card p-4 sm:col-span-1 sm:p-5">
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="mt-2 text-3xl font-semibold">{stats.products}</p>
        </article>
      </section>
    </div>
  );
}
