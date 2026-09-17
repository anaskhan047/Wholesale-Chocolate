import { jsonOk, handleApiError } from "@/lib/api-response";
import { clearAuthCookie } from "@/lib/cookies";

export async function POST() {
  try {
    await clearAuthCookie();
    return jsonOk(null, "Logged out");
  } catch (error) {
    return handleApiError(error);
  }
}
