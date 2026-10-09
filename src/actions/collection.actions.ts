"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type {
  CollectionDB,
  CollectionDetailDB,
  LanguageCode,
  UpdateCollectionInput,
} from "@/types/product";

const collectionSelect = `
  *,
  translations:CollectionTranslation(*)
`;

export async function getCollections(
  lang: LanguageCode = "en",
): Promise<CollectionDB[]> {
  const { data, error } = await supabase
    .from("Collection")
    .select(collectionSelect)
    .order("sortOrder");

  if (error || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => {
    const translations = row.translations || [];
    const t =
      translations.find((x: { language: string }) => x.language === lang) ||
      translations.find((x: { language: string }) => x.language === "en") ||
      translations[0];
    return {
      id: row.id,
      systemSlug: row.systemSlug,
      name: t?.name || row.systemSlug,
      slug: t?.slug || row.systemSlug,
      sortOrder: row.sortOrder,
      h1: t?.h1 || null,
      description: t?.description || null,
      metaTitle: t?.metaTitle || null,
      metaDesc: t?.metaDesc || null,
      keywords: t?.keywords || null,
      ogImage: t?.ogImage || null,
    };
  });
}

export async function getCollectionById(
  id: string,
): Promise<CollectionDetailDB | null> {
  const { data, error } = await supabase
    .from("Collection")
    .select(collectionSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as any;
  return {
    id: row.id,
    systemSlug: row.systemSlug,
    sortOrder: row.sortOrder,
    translations: (row.translations || []).map((t: any) => ({
      id: t.id,
      language: t.language as LanguageCode,
      name: t.name,
      slug: t.slug,
      h1: t.h1 || null,
      description: t.description || null,
      metaTitle: t.metaTitle || null,
      metaDesc: t.metaDesc || null,
      keywords: t.keywords || null,
      ogImage: t.ogImage || null,
      canonical: t.canonical || null,
    })),
  };
}

export async function getCollectionBySlug(
  systemSlug: string,
  lang: LanguageCode = "en",
): Promise<CollectionDB | null> {
  const { data, error } = await supabase
    .from("Collection")
    .select(collectionSelect)
    .eq("systemSlug", systemSlug)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as any;
  const translations = row.translations || [];
  const t =
    translations.find((x: { language: string }) => x.language === lang) ||
    translations.find((x: { language: string }) => x.language === "en") ||
    translations[0];

  return {
    id: row.id,
    systemSlug: row.systemSlug,
    name: t?.name || row.systemSlug,
    slug: t?.slug || row.systemSlug,
    sortOrder: row.sortOrder,
    h1: t?.h1 || null,
    description: t?.description || null,
    metaTitle: t?.metaTitle || null,
    metaDesc: t?.metaDesc || null,
    keywords: t?.keywords || null,
    ogImage: t?.ogImage || null,
  };
}

export async function updateCollection(
  id: string,
  input: UpdateCollectionInput,
) {
  try {
    await checkAdmin();

    if (input.sortOrder !== undefined || input.systemSlug !== undefined) {
      const updateData: Record<string, any> = {};
      if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
      if (input.systemSlug !== undefined)
        updateData.systemSlug = input.systemSlug;

      await (supabaseAdmin.from("Collection") as any)
        .update(updateData)
        .eq("id", id);
    }

    if (input.translations && input.translations.length > 0) {
      await supabaseAdmin
        .from("CollectionTranslation")
        .delete()
        .eq("collectionId", id);

      const { error: trError } = await supabaseAdmin
        .from("CollectionTranslation")
        .insert(
          input.translations.map((t) => ({
            collectionId: id,
            language: t.language,
            name: t.name,
            slug: t.slug || input.systemSlug || id,
            h1: t.h1 || null,
            description: t.description || null,
            metaTitle: t.metaTitle || null,
            metaDesc: t.metaDesc || null,
            keywords: t.keywords || null,
            ogImage: t.ogImage || null,
            canonical: t.canonical || null,
          })),
        );

      if (trError) throw trError;
    }

    revalidateTag(CACHE_TAGS.COLLECTIONS, "default");
    revalidatePath("/atlasadmin/categories");
    revalidatePath("/atlasadmin/products");

    return { success: true as const };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to update category";
    return { success: false as const, error: message };
  }
}
