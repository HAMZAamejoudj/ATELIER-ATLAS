"use server";

import { revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { deleteLocalProjectFile } from "@/lib/delete-local-file";
import { resolveMediaLibraryUrl } from "@/lib/media-library-url";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { LibraryImage } from "@/types/library";

const LIBRARY_BUCKET = "atlas-site";

function withResolvedUrl(image: LibraryImage): LibraryImage {
  return { ...image, url: resolveMediaLibraryUrl(image) };
}

export async function getLibraryImages(filters?: {
  duplicatesOnly?: boolean;
  excludeDuplicates?: boolean;
  search?: string;
  limit?: number;
}): Promise<LibraryImage[]> {
  await checkAdmin();
  const limit = filters?.limit ?? 120;
  let query = supabaseAdmin
    .from("MediaLibrary")
    .select("*")
    .order("createdAt", { ascending: false });

  if (filters?.duplicatesOnly) query = query.eq("isDuplicate", true);
  if (filters?.excludeDuplicates) query = query.eq("isDuplicate", false);
  if (filters?.search) {
    query = query.or(
      `filename.ilike.%${filters.search}%,localPath.ilike.%${filters.search}%`,
    );
  }
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data || []) as LibraryImage[]).map(withResolvedUrl);
}

export async function deleteLibraryImage(id: string, deleteLocalFile = true) {
  await checkAdmin();

  const { data: item, error: fetchError } = await supabaseAdmin
    .from("MediaLibrary")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !item) {
    return { success: false as const, error: "Image not found" };
  }

  await supabaseAdmin.storage.from(LIBRARY_BUCKET).remove([item.storagePath]);
  await supabaseAdmin.from("MediaLibrary").delete().eq("id", id);

  if (deleteLocalFile && item.localPath) {
    await deleteLocalProjectFile(item.localPath);
  }

  revalidateTag(CACHE_TAGS.LIBRARY, "default");
  return { success: true as const };
}

export async function deleteLibraryImages(
  ids: string[],
  deleteLocalFiles = true,
) {
  await checkAdmin();
  const results = await Promise.all(
    ids.map((id) => deleteLibraryImage(id, deleteLocalFiles)),
  );
  const failed = results.filter((r) => !r.success);
  if (failed.length) {
    return {
      success: false as const,
      error: `${failed.length} image(s) could not be deleted`,
    };
  }
  return { success: true as const, deleted: ids.length };
}

export async function getLibraryStats() {
  await checkAdmin();
  const [totalRes, duplicatesRes, sizeRes] = await Promise.all([
    supabaseAdmin.from("MediaLibrary").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("MediaLibrary")
      .select("id", { count: "exact", head: true })
      .eq("isDuplicate", true),
    supabaseAdmin.from("MediaLibrary").select("compressedSize"),
  ]);

  const items = sizeRes.data || [];
  return {
    total: totalRes.count || 0,
    duplicates: duplicatesRes.count || 0,
    totalSizeKb: Math.round(
      items.reduce((sum, item) => sum + (item.compressedSize || 0), 0) / 1024,
    ),
  };
}
