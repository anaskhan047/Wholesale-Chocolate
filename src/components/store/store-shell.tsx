import type { ReactNode } from "react";
import { AppIntro } from "@/components/home/app-intro";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/components/cart/cart-provider";
import { BackLink } from "@/components/store/back-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { AuthUser } from "@/types/auth";

type StoreShellProps = {
  session: AuthUser | null;
  children: ReactNode;
  intro?: boolean;
  backHref?: string;
  backLabel?: string;
};

export function StoreShell({
  session,
  children,
  intro = false,
  backHref,
  backLabel,
}: StoreShellProps) {
  return (
    <CartProvider session={session}>
      <div className="flex min-h-dvh flex-col bg-background">
        {intro ? <AppIntro /> : null}
        <SiteHeader session={session} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-2 pb-24 pt-4 sm:px-4 sm:pt-6 lg:pb-10">
          <BackLink href={backHref} label={backLabel} />
          {children}
        </main>
        <SiteFooter />
        <BottomNav session={session} />
      </div>
    </CartProvider>
  );
}
