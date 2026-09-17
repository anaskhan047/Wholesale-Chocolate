import { jsonOk, handleApiError } from "@/lib/api-response";
import { setAuthCookie } from "@/lib/cookies";
import { signupUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = await signupUser(body);
    await setAuthCookie(token);
    return jsonOk(user, "Account created", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
