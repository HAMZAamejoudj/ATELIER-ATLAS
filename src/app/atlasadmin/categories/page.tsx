import { getCollectionById, getCollections } from "@/actions/collection.actions";
import { CategoriesAdminClient } from "@/components/admin/CategoriesAdminClient";
import type { CollectionDetailDB } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let detailedCollections: CollectionDetailDB[] = [];

  try {
    const list = await getCollections("en");
    const details = await Promise.all(
      list.map((c) => getCollectionById(c.id)),
    );
    detailedCollections = details.filter(
      (c): c is CollectionDetailDB => c !== null,
    );
  } catch (e) {
    console.error("AdminCategoriesPage load error:", e);
  }

  return <CategoriesAdminClient collections={detailedCollections} />;
}
