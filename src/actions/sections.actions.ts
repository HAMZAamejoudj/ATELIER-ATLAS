"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getDefaultSectionsConfig,
  type AllSectionsConfig,
} from "@/lib/sections-helpers";

const SECTIONS_PAGE_ID = "sp_sections_config";

export async function getSectionsConfig(): Promise<AllSectionsConfig> {
  const defaults = getDefaultSectionsConfig();

  try {
    const { data } = await supabase
      .from("StaticPage")
      .select("*, translations:StaticPageTranslation(*)")
      .eq("systemName", "sections_config")
      .maybeSingle();

    if (!data) return defaults;

    const row = data as any;
    const en = row.translations?.find((t: any) => t.language === "en");
    if (!en || !en.description) return defaults;

    const parsed = JSON.parse(en.description);
    return {
      homeHero: { ...defaults.homeHero, ...(parsed.homeHero || {}) },
      seating: { ...defaults.seating, ...(parsed.seating || {}) },
      tables: { ...defaults.tables, ...(parsed.tables || {}) },
      lighting: { ...defaults.lighting, ...(parsed.lighting || {}) },
      mirrors: { ...defaults.mirrors, ...(parsed.mirrors || {}) },
      decor: { ...defaults.decor, ...(parsed.decor || {}) },
    };
  } catch (e) {
    console.error("Failed to load sections config:", e);
    return defaults;
  }
}

export async function saveSectionsConfig(config: AllSectionsConfig) {
  try {
    await checkAdmin();

    const { data: page } = await supabaseAdmin
      .from("StaticPage")
      .select("id")
      .eq("systemName", "sections_config")
      .maybeSingle();

    let pageId = page?.id;

    if (!pageId) {
      const { data: created, error } = await supabaseAdmin
        .from("StaticPage")
        .insert({
          id: SECTIONS_PAGE_ID,
          systemName: "sections_config",
        })
        .select("id")
        .single();

      if (error) throw error;
      pageId = created.id;
    }

    const payload = JSON.stringify(config);

    const languages = ["en", "ar"] as const;
    for (const lang of languages) {
      const { data: existingTr } = await supabaseAdmin
        .from("StaticPageTranslation")
        .select("id")
        .eq("staticPageId", pageId)
        .eq("language", lang)
        .maybeSingle();

      const trData = {
        staticPageId: pageId,
        language: lang,
        slug: "sections-config",
        h1: "Sections Config",
        description: payload,
        metaTitle: "Sections Config",
        metaDesc: "Sections Config",
      };

      if (existingTr) {
        await supabaseAdmin
          .from("StaticPageTranslation")
          .update(trData)
          .eq("id", existingTr.id);
      } else {
        await supabaseAdmin.from("StaticPageTranslation").insert(trData);
      }
    }

    revalidateTag(CACHE_TAGS.STATIC_PAGES, "default");
    revalidatePath("/");
    revalidatePath("/seating");
    revalidatePath("/tables-consoles");
    revalidatePath("/lighting");
    revalidatePath("/mirrors");
    revalidatePath("/decor");
    revalidatePath("/atlasadmin/sections");

    return { success: true as const };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to save sections config";
    return { success: false as const, error: message };
  }
}
