import { getStaticPages } from "@/actions/static-page.actions";
import { StaticPagesClient } from "@/components/admin/StaticPagesClient";

export const dynamic = "force-dynamic";

export default async function AdminStaticPagesPage() {
  let pages: Awaited<ReturnType<typeof getStaticPages>> = [];
  try {
    pages = await getStaticPages();
  } catch {
    /* env */
  }
  return <StaticPagesClient pages={pages} />;
}
