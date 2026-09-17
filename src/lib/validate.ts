import { AppError } from "@/lib/errors";
import type { AdminAuthBody, LoginBody, PhoneAuthBody } from "@/types/auth";

const PHONE_RE = /^[6-9]\d{9}$/;

export function isPhoneNumber(value: string) {
  return PHONE_RE.test(value);
}

export function normalizePhone(value: unknown) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits;
}

export function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

export function validatePhone(phone: string) {
  if (!PHONE_RE.test(phone)) {
    throw new AppError("Enter a valid 10-digit phone number");
  }
  return phone;
}

export function validatePassword(password: string) {
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters");
  }
  return password;
}

export function validatePhoneAuth(body: PhoneAuthBody) {
  return {
    phone: validatePhone(normalizePhone(body.phone)),
    password: validatePassword(normalizeText(body.password)),
  };
}

export function validateAdminAuth(body: AdminAuthBody) {
  const adminId = normalizeText(body.adminId).toLowerCase();
  const password = normalizeText(body.password);

  if (!adminId) {
    throw new AppError("Enter admin id");
  }

  return {
    adminId,
    password: validatePassword(password),
  };
}

export function parseRequiredNumber(
  value: unknown,
  label: string,
  integer = false,
) {
  const text = normalizeText(value);
  if (!text) {
    throw new AppError(`${label} is required`);
  }

  const num = Number(text);
  if (!Number.isFinite(num) || num < 0) {
    throw new AppError(`Enter a valid ${label.toLowerCase()}`);
  }

  if (integer && !Number.isInteger(num)) {
    throw new AppError(`${label} must be a whole number`);
  }

  return num;
}

export function parseOptionalNumber(
  value: unknown,
  label: string,
  integer = false,
) {
  if (normalizeText(value) === "") {
    return undefined;
  }

  const num = parseRequiredNumber(value, label, integer);
  if (integer && num < 1) {
    throw new AppError(`${label} must be at least 1`);
  }

  return num;
}

export function getFormFile(form: FormData, key = "image") {
  const value = form.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

export function validateLogin(body: LoginBody) {
  const rawId = normalizeText(body.id ?? body.phone ?? body.adminId);
  const password = validatePassword(normalizeText(body.password));

  if (!rawId) {
    throw new AppError("Enter id or phone number");
  }

  const phone = normalizePhone(rawId);
  if (isPhoneNumber(phone)) {
    return { kind: "user" as const, phone, password };
  }

  return { kind: "admin" as const, adminId: rawId.toLowerCase(), password };
}
