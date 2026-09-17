import { CategoryBoard } from "@/components/admin/category-board";
import { listCategories } from "@/services/category.service";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();
  return <CategoryBoard initialCategories={categories} />;
}
