const LIBRARY_BUCKET = "atlas-site";

export function resolveMediaLibraryUrl(item: {
  url: string;
  storagePath: string;
  localPath?: string | null;
}): string {
  const url = (item.url || "").trim();

  if (url.startsWith("pending-upload:")) {
    const parts = url.split(":");
    const mimeType = parts[2];
    const base64 = parts.slice(3).join(":");
    return `data:${mimeType};base64,${base64}`;
  }

  if (url.startsWith("/") || item.localPath?.startsWith("/")) {
    return url.startsWith("/") ? url : item.localPath!;
  }

  if (url.includes("supabase.co/storage/v1/object/public/")) {
    return url;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const objectPath = item.storagePath?.replace(/^\//, "");

  if (supabaseUrl && objectPath) {
    return `${supabaseUrl}/storage/v1/object/public/${LIBRARY_BUCKET}/${objectPath}`;
  }

  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
}
