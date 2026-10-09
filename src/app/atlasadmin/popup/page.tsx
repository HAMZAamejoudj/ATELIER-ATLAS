import { getPopupConfig } from "@/actions/popup.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PopupAdminClient } from "@/components/admin/PopupAdminClient";

export default async function PopupAdminPage() {
  const popupConfig = await getPopupConfig();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Promotional & Announcement Popup"
        description="Configure the storefront modal, discount codes, display delay, and bilingual announcements."
      />
      <div className="p-8">
        <PopupAdminClient initialConfig={popupConfig} />
      </div>
    </div>
  );
}
