import "server-only";

/** No local file mirror in ATELIER ATLAS — library uses Supabase only. */
export async function deleteLocalProjectFile(_localPath: string): Promise<boolean> {
  return false;
}
