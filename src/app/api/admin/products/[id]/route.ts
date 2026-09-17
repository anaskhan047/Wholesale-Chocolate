import { jsonOk, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/session";
import { getFormFile } from "@/lib/validate";
import { deleteProduct, updateProduct } from "@/services/product.service";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/products/[id]">,
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const form = await request.formData();
    const product = await updateProduct(
      id,
      {
        name: form.get("name"),
        categoryId: form.get("categoryId"),
        buyPrice: form.get("buyPrice"),
        sellPrice: form.get("sellPrice"),
        piecePrice: form.get("piecePrice"),
        packetPieceQty: form.get("packetPieceQty"),
        quantity: form.get("quantity"),
      },
      getFormFile(form),
    );
    return jsonOk(product, "Product updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/products/[id]">,
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const result = await deleteProduct(id);
    return jsonOk(result, "Product deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
