import { getLibraryImages, getLibraryStats } from "@/actions/library.actions";
import { LibraryAdminClient } from "@/components/admin/LibraryAdminClient";

export const dynamic = "force-dynamic";

const INITIAL_LIMIT = 120;

export default async function AdminLibraryPage() {
  try {
    const [images, stats] = await Promise.all([
      getLibraryImages({ limit: INITIAL_LIMIT }),
      getLibraryStats(),
    ]);

    return (
      <LibraryAdminClient
        images={images}
        stats={stats}
        initialLimit={INITIAL_LIMIT}
      />
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load media library";
    return (
      <LibraryAdminClient
        images={[]}
        stats={{ total: 0, duplicates: 0, totalSizeKb: 0 }}
        initialLimit={INITIAL_LIMIT}
        loadError={message}
      />
    );
  }
}
