"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_POPUP_CONFIG, type PopupConfig } from "@/lib/popup-types";

const POPUP_PAGE_ID = "sp_popup_config";

export async function getPopupConfig(): Promise<PopupConfig> {
  try {
    const { data } = await supabase
      .from("StaticPage")
      .select("*, translations:StaticPageTranslation(*)")
      .eq("systemName", "popup_config")
      .maybeSingle();

    if (!data) return DEFAULT_POPUP_CONFIG;

    const row = data as any;
    const en = row.translations?.find((t: any) => t.language === "en");
    if (!en || !en.description) return DEFAULT_POPUP_CONFIG;

    const parsed = JSON.parse(en.description);
    return { ...DEFAULT_POPUP_CONFIG, ...parsed };
  } catch (e) {
    console.error("Failed to fetch popup config:", e);
    return DEFAULT_POPUP_CONFIG;
  }
}

export async function savePopupConfig(config: PopupConfig) {
  try {
    await checkAdmin();

    const { data: page } = await supabaseAdmin
      .from("StaticPage")
      .select("id")
      .eq("systemName", "popup_config")
      .maybeSingle();

    let pageId = page?.id;

    if (!pageId) {
      const { data: created, error } = await supabaseAdmin
        .from("StaticPage")
        .insert({
          id: POPUP_PAGE_ID,
          systemName: "popup_config",
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
        slug: "popup-config",
        h1: "Promotional Popup Config",
        description: payload,
        metaTitle: "Promotional Popup Config",
        metaDesc: "Promotional Popup Config",
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
    revalidatePath("/atlasadmin/popup");

    return { success: true as const };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to save popup config";
    return { success: false as const, error: message };
  }
}
