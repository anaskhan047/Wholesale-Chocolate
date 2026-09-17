import { jsonOk, handleApiError } from "@/lib/api-response";
import { parseCatalogQuery, PRODUCT_PAGE_SIZE } from "@/lib/catalog";
import { searchProducts } from "@/services/product.service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = parseCatalogQuery({
      q: url.searchParams.get("q") ?? "",
      category: url.searchParams.get("category") ?? "",
    });
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || PRODUCT_PAGE_SIZE);
    const data = await searchProducts({
      q: query.q,
      categoryId: query.category,
      page,
      limit,
    });
    return jsonOk(data, "Products loaded");
  } catch (error) {
    return handleApiError(error);
  }
}
