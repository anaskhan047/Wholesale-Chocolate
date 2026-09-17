import { jwtVerify, SignJWT } from "jose";
import { getSecretKey } from "@/lib/env";
import { AppError } from "@/lib/errors";
import type { TokenPayload } from "@/types/auth";

function getSecret() {
  return new TextEncoder().encode(getSecretKey());
}

export function signToken(payload: TokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role;

    if (
      typeof payload.sub !== "string" ||
      (role !== "user" && role !== "admin")
    ) {
      throw new Error("Invalid token payload");
    }

    return {
      sub: payload.sub,
      role,
      phone: typeof payload.phone === "string" ? payload.phone : undefined,
      adminId:
        typeof payload.adminId === "string" ? payload.adminId : undefined,
    };
  } catch {
    throw new AppError("Session expired. Please login again", 401);
  }
}
