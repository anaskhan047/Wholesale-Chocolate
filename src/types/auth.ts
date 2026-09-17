export type Role = "user" | "admin";

export type TokenPayload = {
  sub: string;
  role: Role;
  phone?: string;
  adminId?: string;
};

export type AuthUser = {
  id: string;
  role: Role;
  phone?: string;
  adminId?: string;
};

export type PhoneAuthBody = {
  phone?: unknown;
  password?: unknown;
};

export type AdminAuthBody = {
  adminId?: unknown;
  password?: unknown;
};

export type LoginBody = {
  id?: unknown;
  phone?: unknown;
  adminId?: unknown;
  password?: unknown;
};
