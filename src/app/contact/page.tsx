import { ContactView } from "@/components/contact/contact-view";
import { StoreShell } from "@/components/store/store-shell";
import { getSession } from "@/lib/session";

export default async function ContactPage() {
  const session = await getSession();

  return (
    <StoreShell session={session}>
      <ContactView />
    </StoreShell>
  );
}
