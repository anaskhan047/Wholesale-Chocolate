import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/login");
  }

  return <AdminShell adminId={admin.adminId ?? "admin"}>{children}</AdminShell>;
}
