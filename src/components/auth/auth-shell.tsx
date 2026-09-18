import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/components/cart/cart-provider";
import { BackLink } from "@/components/store/back-link";
import { SiteHeader } from "@/components/site-header";
import { getSession } from "@/lib/session";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export async function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const session = await getSession();

  return (
    <CartProvider session={session}>
      <div className="flex min-h-dvh flex-col bg-background">
        <SiteHeader session={session} />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8 pb-24 lg:pb-8">
          <BackLink href="/" label="Back to home" />
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
              Cocoa House
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
            <p className="mt-5 text-center text-sm text-muted-foreground">{footer}</p>
          </div>
        </main>
        <BottomNav session={session} />
      </div>
    </CartProvider>
  );
}
