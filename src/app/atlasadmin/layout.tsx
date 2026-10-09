import { AdminDevBanner } from "@/components/admin/AdminDevBanner";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default function AtlasAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutClient>
      <AdminDevBanner />
      {children}
    </AdminLayoutClient>
  );
}