import { OutOfStockBadge, ProductFacts } from "@/components/product-facts";
import { Button } from "@/components/ui/button";
import { isOutOfStock } from "@/lib/product-display";
import { joinClass, motionClass, staggerDelay } from "@/lib/motion";
import type { ProductItem } from "@/types/product";

type ProductCardProps = {
  product: ProductItem;
  index: number;
  busy: boolean;
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
};

export function ProductCard({
  product,
  index,
  busy,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const out = isOutOfStock(product.quantity);

  return (
    <article
      style={staggerDelay(index)}
      className={joinClass(
        motionClass("fadeUp"),
        "group min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl",
        out && "border-danger/40",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {out ? <OutOfStockBadge /> : null}
      </div>
      <div className="space-y-2 p-2 sm:space-y-3 sm:p-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-medium uppercase tracking-wide text-caramel sm:text-xs">
            {product.categoryName}
          </p>
          <h2 className="truncate text-[11px] font-semibold sm:text-lg">
            {product.name}
          </h2>
        </div>
        <ProductFacts product={product} variant="admin" />
        <div className="grid grid-cols-2 gap-1 sm:flex sm:gap-2">
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={busy}
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
