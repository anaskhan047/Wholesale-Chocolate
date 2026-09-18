import { jsonOk, handleApiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { getSession } from "@/lib/session";
import { getUserCart, mergeUserCart, saveUserCart } from "@/services/cart.service";

async function requireUser() {
  const session = await getSession();
  if (!session || session.role !== "user") {
    throw new AppError("Please login to sync cart", 401);
  }
  return session;
}

export async function GET() {
  try {
    const session = await requireUser();
    const items = await getUserCart(session.id);
    return jsonOk(items, "Cart loaded");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireUser();
    const body = (await request.json()) as { items?: unknown };
    const items = await saveUserCart(session.id, body.items ?? []);
    return jsonOk(items, "Cart saved");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireUser();
    const body = (await request.json()) as { items?: unknown };
    const items = await mergeUserCart(session.id, body.items ?? []);
    return jsonOk(items, "Cart merged");
  } catch (error) {
    return handleApiError(error);
  }
}
