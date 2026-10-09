import { getSectionsConfig } from "@/actions/sections.actions";
import { SectionsAdminClient } from "@/components/admin/SectionsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const config = await getSectionsConfig();
  return <SectionsAdminClient initialConfig={config} />;
}
