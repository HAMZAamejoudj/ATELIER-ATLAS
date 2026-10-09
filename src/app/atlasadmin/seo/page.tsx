import { getSEOSettings } from "@/actions/seo.actions";
import { SEOAdminClient } from "@/components/admin/SEOAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  let initial = null;
  try {
    const data = await getSEOSettings("en");
    if (data) {
      initial = {
        setting: data.setting,
        translations: data.translations,
      };
    }
  } catch {
    /* env */
  }

  return <SEOAdminClient initial={initial} />;
}
