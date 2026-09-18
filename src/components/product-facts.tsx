import { formatPrice } from "@/lib/money";
import { hasOptionalAmount, isOutOfStock } from "@/lib/product-display";
import { cn } from "@/lib/cn";
import type { ProductItem } from "@/types/product";

type ProductFactsProps = {
  product: ProductItem;
  variant?: "store" | "admin" | "card";
};

export function OutOfStockBadge() {
  return (
    <span className="absolute left-2 top-2 z-10 rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream shadow-sm">
      Out of stock
    </span>
  );
}

export function ProductFacts({
  product,
  variant = "store",
}: ProductFactsProps) {
  const out = isOutOfStock(product.quantity);
  const showPiece = hasOptionalAmount(product.piecePrice);
  const showPack = hasOptionalAmount(product.packetPieceQty);

  if (variant === "card") {
    return (
      <div className="mt-auto min-h-[3.4rem]">
        <p className="text-sm font-bold leading-tight text-chocolate sm:text-base">
          {formatPrice(product.sellPrice)}
        </p>
        <p className="mt-0.5 min-h-[1rem] text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
          {showPiece ? `Per piece ${formatPrice(product.piecePrice)}` : "\u00A0"}
        </p>
        <p className="min-h-[1rem] text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
          {out
            ? "Out of stock"
            : showPack
              ? `${product.packetPieceQty} pcs / packet`
              : "\u00A0"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <p
        className={cn(
          "font-bold text-chocolate",
          variant === "store" ? "text-base sm:text-lg" : "text-sm sm:text-base",
        )}
      >
        {formatPrice(product.sellPrice)}
      </p>
      {showPiece ? (
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          Per piece {formatPrice(product.piecePrice)}
        </p>
      ) : null}
      {showPack ? (
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          {product.packetPieceQty} pieces / packet
        </p>
      ) : null}
      {out ? (
        <p className="text-[11px] font-semibold text-danger sm:text-xs">
          Out of stock
        </p>
      ) : variant === "admin" ? (
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          Qty {product.quantity}
        </p>
      ) : null}
      {variant === "admin" ? (
        <p className="text-[11px] text-muted-foreground sm:text-xs">
          Buy {formatPrice(product.buyPrice)}
        </p>
      ) : null}
    </div>
  );
}
