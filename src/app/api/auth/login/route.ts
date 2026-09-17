import { jsonOk, handleApiError } from "@/lib/api-response";
import { setAuthCookie } from "@/lib/cookies";
import { loginAccount } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = await loginAccount(body);
    await setAuthCookie(token);
    return jsonOk(user, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
