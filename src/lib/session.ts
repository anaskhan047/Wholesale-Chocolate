import { getAuthCookie } from "@/lib/cookies";
import { AppError } from "@/lib/errors";
import { verifyToken } from "@/lib/jwt";
import type { AuthUser } from "@/types/auth";

export async function getSession(): Promise<AuthUser | null> {
  const token = await getAuthCookie();
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);
    return {
      id: payload.sub,
      role: payload.role,
      phone: payload.phone,
      adminId: payload.adminId,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new AppError("Please login as admin", 401);
  }
  return session;
}
