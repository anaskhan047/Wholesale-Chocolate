import { AdminOverview } from "@/components/admin/admin-overview";
import { countCategories } from "@/services/category.service";
import { countProducts } from "@/services/product.service";
import { countUsers } from "@/services/auth.service";

export default async function AdminDashboardPage() {
  const [users, categories, products] = await Promise.all([
    countUsers(),
    countCategories(),
    countProducts(),
  ]);

  return (
    <AdminOverview initialStats={{ users, categories, products }} />
  );
}
