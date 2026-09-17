import type { CatalogQuery } from "@/lib/catalog";

export const queryKeys = {
  catalog: {
    all: ["catalog"] as const,
    categories: ["catalog", "categories"] as const,
    products: (query: CatalogQuery) =>
      ["catalog", "products", query.q, query.category] as const,
  },
  admin: {
    all: ["admin"] as const,
    categories: ["admin", "categories"] as const,
    products: ["admin", "products"] as const,
    stats: ["admin", "stats"] as const,
  },
};
