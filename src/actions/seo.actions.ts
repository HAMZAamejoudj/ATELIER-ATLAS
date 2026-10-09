"use server";

import { revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { LanguageCode } from "@/types/product";

export async function getSEOSettings(lang: LanguageCode = "en") {
  const { data: setting } = await supabase
    .from("GlobalSeoSetting")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (!setting) return null;

  const { data: translations } = await supabase
    .from("GlobalSeoTranslation")
    .select("*")
    .eq("globalSeoSettingId", setting.id);

  const translation =
    translations?.find((t) => t.language === lang) ||
    translations?.find((t) => t.language === "en");

  return { setting, translations: translations || [], translation };
}

export async function updateSEOSettings(input: {
  ogImage?: string;
  facebookPage?: string;
  twitterHandle?: string;
  translations: {
    language: LanguageCode;
    siteName?: string;
    titleSuffix?: string;
    defaultMetaDesc?: string;
    defaultKeywords?: string;
  }[];
}) {
  await checkAdmin();

  let { data: setting } = await supabaseAdmin
    .from("GlobalSeoSetting")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!setting) {
    const { data: created } = await supabaseAdmin
      .from("GlobalSeoSetting")
      .insert({
        id: "seo_default",
        ogImage: input.ogImage,
        facebookPage: input.facebookPage,
        twitterHandle: input.twitterHandle,
      })
      .select()
      .single();
    setting = created;
  } else {
    await supabaseAdmin
      .from("GlobalSeoSetting")
      .update({
        ogImage: input.ogImage,
        facebookPage: input.facebookPage,
        twitterHandle: input.twitterHandle,
      })
      .eq("id", setting.id);
  }

  if (!setting) return { success: false as const, error: "SEO setting missing" };

  for (const t of input.translations) {
    const { data: existing } = await supabaseAdmin
      .from("GlobalSeoTranslation")
      .select("id")
      .eq("globalSeoSettingId", setting.id)
      .eq("language", t.language)
      .maybeSingle();

    const payload = {
      globalSeoSettingId: setting.id,
      language: t.language,
      siteName: t.siteName,
      titleSuffix: t.titleSuffix,
      defaultMetaDesc: t.defaultMetaDesc,
      defaultKeywords: t.defaultKeywords,
    };

    if (existing) {
      await supabaseAdmin
        .from("GlobalSeoTranslation")
        .update(payload)
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("GlobalSeoTranslation").insert(payload);
    }
  }

  revalidateTag(CACHE_TAGS.SEO, "default");
  return { success: true as const };
}
