import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/session";
import { deleteCategory, updateCategory } from "@/services/category.service";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/categories/[id]">,
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const form = await request.formData();
    const image = form.get("image");
    const file = image instanceof File && image.size > 0 ? image : null;
    const category = await updateCategory(id, form.get("name"), file);
    return jsonOk(category, "Category updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/categories/[id]">,
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const result = await deleteCategory(id);
    return jsonOk(result, "Category deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
