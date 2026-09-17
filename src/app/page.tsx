import { Storefront } from "@/components/home/storefront";
import { EMPTY_PRODUCT_PAGE, parseCatalogQuery } from "@/lib/catalog";
import { getSession } from "@/lib/session";
import { listCategories } from "@/services/category.service";
import { searchProducts } from "@/services/product.service";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const query = parseCatalogQuery(await searchParams);
  const [categories, products, session] = await Promise.all([
    listCategories().catch(() => []),
    searchProducts({
      q: query.q,
      categoryId: query.category,
      page: 1,
    }).catch(() => EMPTY_PRODUCT_PAGE),
    getSession(),
  ]);

  return (
    <Storefront
      categories={categories}
      initialPage={products}
      query={query}
      session={session}
    />
  );
}
