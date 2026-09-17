import { normalizeText } from "@/lib/validate";
import type { ProductPage } from "@/types/product";

export const PRODUCT_PAGE_SIZE = 20;

export const EMPTY_PRODUCT_PAGE: ProductPage = {
  items: [],
  page: 1,
  limit: PRODUCT_PAGE_SIZE,
  total: 0,
  hasMore: false,
};

export type CatalogQuery = {
  q: string;
  category: string;
};

export function parseCatalogQuery(params: {
  q?: string | string[];
  category?: string | string[];
}): CatalogQuery {
  return {
    q: normalizeText(Array.isArray(params.q) ? params.q[0] : params.q),
    category: normalizeText(
      Array.isArray(params.category) ? params.category[0] : params.category,
    ),
  };
}

export function catalogHref(query: Partial<CatalogQuery>, hash = "") {
  const params = new URLSearchParams();
  const q = normalizeText(query.q);
  const category = normalizeText(query.category);

  if (q) {
    params.set("q", q);
  }
  if (category) {
    params.set("category", category);
  }

  const search = params.toString();
  const path = search ? `/?${search}` : "/";
  return hash ? `${path}#${hash}` : path;
}

export function catalogApiUrl(query: CatalogQuery, page: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(PRODUCT_PAGE_SIZE));
  if (query.q) {
    params.set("q", query.q);
  }
  if (query.category) {
    params.set("category", query.category);
  }
  return `/api/catalog/products?${params.toString()}`;
}

export function scrollToId(id: string) {
  const node = document.getElementById(id);
  if (!node) {
    return;
  }
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}
