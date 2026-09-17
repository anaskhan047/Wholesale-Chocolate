import { DEFAULT_ADMIN } from "@/lib/constants";
import { hashPassword } from "@/lib/hash";
import { Admin } from "@/models/admin.model";

const globalSeed = globalThis as typeof globalThis & { wcAdminSeeded?: boolean };

export async function ensureAdmin() {
  if (globalSeed.wcAdminSeeded) {
    return;
  }

  const existing = await Admin.findOne({ adminId: DEFAULT_ADMIN.adminId })
    .select("_id")
    .lean();

  if (!existing) {
    await Admin.create({
      adminId: DEFAULT_ADMIN.adminId,
      password: await hashPassword(DEFAULT_ADMIN.password),
      role: "admin",
    });
  }

  globalSeed.wcAdminSeeded = true;
}
