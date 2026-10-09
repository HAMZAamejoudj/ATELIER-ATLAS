import { getContactSettings, getContactInquiries } from "@/actions/contact.actions";
import { ContactAdminClient } from "@/components/admin/ContactAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const settings = await getContactSettings();
  const inquiries = await getContactInquiries();

  return (
    <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
      <ContactAdminClient
        initialSettings={settings}
        initialInquiries={inquiries}
      />
    </div>
  );
}
