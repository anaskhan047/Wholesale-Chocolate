import { jsonOk, handleApiError } from "@/lib/api-response";
import { listCategories } from "@/services/category.service";

export async function GET() {
  try {
    const categories = await listCategories();
    return jsonOk(categories, "Categories loaded");
  } catch (error) {
    return handleApiError(error);
  }
}
