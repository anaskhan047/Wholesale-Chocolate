import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/session";
import { createCategory, listCategories } from "@/services/category.service";

export async function GET() {
  try {
    await requireAdmin();
    const categories = await listCategories();
    return jsonOk(categories, "Categories loaded");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const category = await createCategory(form.get("name"), form.get("image") as File);
    return jsonOk(category, "Category created", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
