import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { PhoneAuthForm } from "@/components/auth/phone-auth-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Signup with your phone number and a password."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Login
          </Link>
        </>
      }
    >
      <PhoneAuthForm />
    </AuthShell>
  );
}
