import { jsonOk, handleApiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { requireAdmin } from "@/lib/session";
import { getFormFile } from "@/lib/validate";
import { createProduct, listProducts } from "@/services/product.service";

export async function GET() {
  try {
    await requireAdmin();
    const products = await listProducts();
    return jsonOk(products, "Products loaded");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const file = getFormFile(form);
    if (!file) {
      throw new AppError("Please choose an image");
    }

    const product = await createProduct(
      {
        name: form.get("name"),
        categoryId: form.get("categoryId"),
        buyPrice: form.get("buyPrice"),
        sellPrice: form.get("sellPrice"),
        piecePrice: form.get("piecePrice"),
        packetPieceQty: form.get("packetPieceQty"),
        quantity: form.get("quantity"),
      },
      file,
    );

    return jsonOk(product, "Product created", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
