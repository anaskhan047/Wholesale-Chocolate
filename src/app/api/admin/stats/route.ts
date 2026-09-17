import { jsonOk, handleApiError } from "@/lib/api-response";
import { ADMIN_CACHE_TTL, withCache } from "@/lib/server-cache";
import { requireAdmin } from "@/lib/session";
import { countUsers } from "@/services/auth.service";
import { countCategories } from "@/services/category.service";
import { countProducts } from "@/services/product.service";
import type { AdminStats } from "@/types/admin";

export async function GET() {
  try {
    await requireAdmin();
    const data = await withCache<AdminStats>("admin:stats", ADMIN_CACHE_TTL, async () => ({
      users: await countUsers(),
      categories: await countCategories(),
      products: await countProducts(),
    }));
    return jsonOk(data, "Stats loaded");
  } catch (error) {
    return handleApiError(error);
  }
}
