import { connectDb } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { ADMIN_CACHE_TTL, invalidateCache, withCache } from "@/lib/server-cache";
import { validateLogin, validatePhoneAuth } from "@/lib/validate";
import { Admin } from "@/models/admin.model";
import { User } from "@/models/user.model";
import type { AdminAuthBody, AuthUser, LoginBody, PhoneAuthBody } from "@/types/auth";

function toUser(user: { _id: { toString(): string }; phone: string }): AuthUser {
  return {
    id: user._id.toString(),
    role: "user",
    phone: user.phone,
  };
}

function toAdmin(admin: {
  _id: { toString(): string };
  adminId: string;
}): AuthUser {
  return {
    id: admin._id.toString(),
    role: "admin",
    adminId: admin.adminId,
  };
}

export async function signupUser(body: PhoneAuthBody) {
  const { phone, password } = validatePhoneAuth(body);
  await connectDb();

  const exists = await User.exists({ phone });
  if (exists) {
    throw new AppError("This phone number is already registered", 409);
  }

  const user = await User.create({
    phone,
    password: await hashPassword(password),
    role: "user",
  });

  const authUser = toUser(user);
  const token = await signToken({
    sub: authUser.id,
    role: "user",
    phone: authUser.phone,
  });

  invalidateCache("admin:count:users");
  invalidateCache("admin:stats");
  return { token, user: authUser };
}

async function signInUser(phone: string, password: string) {
  const user = await User.findOne({ phone }).select("phone password").lean();
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new AppError("Invalid id or password", 401);
  }

  const authUser = toUser(user);
  const token = await signToken({
    sub: authUser.id,
    role: "user",
    phone: authUser.phone,
  });

  return { token, user: authUser };
}

async function signInAdmin(adminId: string, password: string) {
  const admin = await Admin.findOne({ adminId })
    .select("adminId password")
    .lean();

  if (!admin || !(await verifyPassword(password, admin.password))) {
    throw new AppError("Invalid id or password", 401);
  }

  const authAdmin = toAdmin(admin);
  const token = await signToken({
    sub: authAdmin.id,
    role: "admin",
    adminId: authAdmin.adminId,
  });

  return { token, user: authAdmin };
}

export async function loginAccount(body: LoginBody) {
  const parsed = validateLogin(body);
  await connectDb();

  if (parsed.kind === "user") {
    return signInUser(parsed.phone, parsed.password);
  }

  return signInAdmin(parsed.adminId, parsed.password);
}

export async function loginUser(body: PhoneAuthBody) {
  return loginAccount(body);
}

export async function loginAdmin(body: AdminAuthBody) {
  return loginAccount(body);
}

export async function countUsers() {
  return withCache("admin:count:users", ADMIN_CACHE_TTL, async () => {
    await connectDb();
    return User.countDocuments();
  });
}
