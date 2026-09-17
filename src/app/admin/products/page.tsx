import { ProductBoard } from "@/components/admin/product-board";
import { listCategories } from "@/services/category.service";
import { listProducts } from "@/services/product.service";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return <ProductBoard initialProducts={products} categories={categories} />;
}
