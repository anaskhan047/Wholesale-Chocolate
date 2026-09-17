import { AppError } from "@/lib/errors";

export function jsonOk<T>(data: T, message: string, status = 200) {
  return Response.json({ ok: true, message, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof SyntaxError) {
    return jsonError("Invalid JSON body", 400);
  }

  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    error.code === 11000
  ) {
    return jsonError("This record already exists", 409);
  }

  console.error(error);
  return jsonError("Something went wrong", 500);
}
