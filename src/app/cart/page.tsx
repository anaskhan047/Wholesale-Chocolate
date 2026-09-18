import { Suspense } from "react";
import { CartView } from "@/components/cart/cart-view";
import { StoreShell } from "@/components/store/store-shell";
import { getSession } from "@/lib/session";

export default async function CartPage() {
  const session = await getSession();

  return (
    <StoreShell session={session}>
      <Suspense
        fallback={
          <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            Loading cart…
          </p>
        }
      >
        <CartView session={session} />
      </Suspense>
    </StoreShell>
  );
}
