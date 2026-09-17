import { Button } from "@/components/ui/button";
import { joinClass, motionClass, staggerDelay } from "@/lib/motion";
import type { CategoryItem } from "@/types/category";

type CategoryCardProps = {
  category: CategoryItem;
  index: number;
  busy: boolean;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
};

export function CategoryCard({
  category,
  index,
  busy,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <article
      style={staggerDelay(index)}
      className={joinClass(
        motionClass("fadeUp"),
        "group min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-dark-chocolate/45 to-transparent opacity-70" />
      </div>
      <div className="space-y-2 p-2 sm:space-y-3 sm:p-4">
        <div className="min-w-0">
          <h2 className="truncate text-[11px] font-semibold sm:text-lg">
            {category.name}
          </h2>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {category.slug}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 sm:flex sm:gap-2">
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={() => onEdit(category)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={busy}
            onClick={() => onDelete(category)}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
