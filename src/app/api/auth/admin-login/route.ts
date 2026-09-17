import { jsonOk, handleApiError } from "@/lib/api-response";
import { setAuthCookie } from "@/lib/cookies";
import { loginAdmin } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = await loginAdmin(body);
    await setAuthCookie(token);
    return jsonOk(user, "Admin login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
