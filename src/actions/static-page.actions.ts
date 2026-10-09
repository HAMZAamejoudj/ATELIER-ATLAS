"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { LanguageCode } from "@/types/product";

const DEFAULT_SITE_PAGES: {
  systemName: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
}[] = [
  {
    systemName: "home",
    slug: "home",
    nameEn: "Home",
    nameAr: "الرئيسية",
    metaTitleEn: "ATELIER ATLAS — Handmade Moroccan Furniture",
    metaTitleAr: "أتيليه أطلس — أثاث مغربي فاخر مصنوع يدوياً",
    metaDescEn:
      "Sculptural handmade Moroccan furniture in travertine, solid wood, and hammered metal — made to order in a Marrakech workshop.",
    metaDescAr:
      "أثاث مغربي منحوت يدويًا من الترافرتين والخشب الصلب والمعادن المطرقة — يُصنع حسب الطلب في ورشة مراكش.",
  },
  {
    systemName: "seating",
    slug: "seating",
    nameEn: "Seating",
    nameAr: "المقاعد",
    metaTitleEn: "Handmade Moroccan Seating | ATELIER ATLAS",
    metaTitleAr: "مقاعد مغربية مصنوعة يدويًا | أتيليه أطلس",
    metaDescEn:
      "Sculptural stools, benches, and chairs hand-shaped in travertine and solid timber.",
    metaDescAr:
      "كراسي ومقاعد وأرائك منحوتة يدويًا من الترافرتين والأخشاب الصلبة العريقة.",
  },
  {
    systemName: "tables-consoles",
    slug: "tables-consoles",
    nameEn: "Tables & Consoles",
    nameAr: "طاولات وكونسولات",
    metaTitleEn: "Handmade Moroccan Tables & Consoles | ATELIER ATLAS",
    metaTitleAr: "طاولات وكونسولات مغربية يدوية الصنع | أتيليه أطلس",
    metaDescEn:
      "Dining tables, side tables, and console tables combining travertine, solid oak, and walnut.",
    metaDescAr:
      "طاولات طعام وطاولات جانبية وكونسولات تجمع بين الترافرتين والبلوط والجوز الصلب.",
  },
  {
    systemName: "lighting",
    slug: "lighting",
    nameEn: "Lighting",
    nameAr: "الإضاءة",
    metaTitleEn: "Lighting After Sunset | ATELIER ATLAS",
    metaTitleAr: "إضاءة راقية للمساحات الهادئة | أتيليه أطلس",
    metaDescEn:
      "Indoor pendants, table lamps, sconces, floor lamps, and outdoor lanterns.",
    metaDescAr:
      "معلقات داخلية، مصابيح طاولة، إضاءات جدارية، مصابيح أرضية وفوانيس خارجية.",
  },
  {
    systemName: "mirrors",
    slug: "mirrors",
    nameEn: "Mirrors",
    nameAr: "المرايا",
    metaTitleEn: "Reflective Calm Mirrors | ATELIER ATLAS",
    metaTitleAr: "مرايا عاكسة بتصاميم هادئة | أتيليه أطلس",
    metaDescEn:
      "Arched, floor, wall, and vanity mirrors in brass, bronze, stone, and walnut.",
    metaDescAr:
      "مرايا مقوسة وأرضية وجدارية بنحاس وبرونز وأحجار طبيعية وخشب الجوز.",
  },
  {
    systemName: "decor",
    slug: "decor",
    nameEn: "Decor & Objects",
    nameAr: "الديكور والتحف",
    metaTitleEn: "Mirrors & Objects Decor | ATELIER ATLAS",
    metaTitleAr: "قطع ديكورية وتحف فنية | أتيليه أطلس",
    metaDescEn:
      "Mirrors, vases, trays, and sculptural objects for considered living spaces.",
    metaDescAr: "مزهريات، صوانٍ رخامية، وقطع منحوتة تضفي توازناً وهدوءاً على منزلك.",
  },
  {
    systemName: "about",
    slug: "about",
    nameEn: "About Us",
    nameAr: "من نحن",
    metaTitleEn: "Our Story | ATELIER ATLAS",
    metaTitleAr: "قصتنا وحرفتنا | أتيليه أطلس",
    metaDescEn:
      "Marrakech furniture workshop and design studio — handmade travertine, solid wood, and metal pieces.",
    metaDescAr:
      "ورشة تصميم وأثاث بمراكش — قطع مصنوعة يدوياً من الترافرتين والخشب والمعادن العريقة.",
  },
  {
    systemName: "blog",
    slug: "blog",
    nameEn: "The Journal / Blog",
    nameAr: "المجلة / المقالات",
    metaTitleEn: "The Atlas Journal | ATELIER ATLAS",
    metaTitleAr: "مجلة أطلس — حكايات الحرفة والتصميم | أتيليه أطلس",
    metaDescEn:
      "Stories on craft, materials, places, and people — inspiration for a more considered way of living.",
    metaDescAr:
      "قصص عن الحرفة والمواد والأماكن — إلهام لأسلوب حياة أكثر عمقاً وهدوءاً.",
  },
  {
    systemName: "contact",
    slug: "contact",
    nameEn: "Contact",
    nameAr: "اتصل بنا",
    metaTitleEn: "Contact the Workshop | ATELIER ATLAS",
    metaTitleAr: "تواصل مع الورشة | أتيليه أطلس",
    metaDescEn:
      "Get in touch for bespoke inquiries, workshop visits, and trade partnerships.",
    metaDescAr:
      "تواصل معنا للطلبات الخاصة، زيارات الورشة بمراكش، وبرنامج المهنيين.",
  },
  {
    systemName: "sur-mesure",
    slug: "sur-mesure",
    nameEn: "Sur-Mesure",
    nameAr: "حسب الطلب",
    metaTitleEn: "Sur-Mesure Bespoke Furniture | ATELIER ATLAS",
    metaTitleAr: "أثاث حسب الطلب والتخصيص | أتيليه أطلس",
    metaDescEn:
      "Custom dimensions, finishes, and stone selections shaped for your project.",
    metaDescAr:
      "أبعاد وتشطيبات وخيارات أحجار مخصصة تناسب مشروعك المعماري ومساحتك.",
  },
];

export async function ensureDefaultPagesExist() {
  try {
    for (const p of DEFAULT_SITE_PAGES) {
      const { data: existing } = await supabaseAdmin
        .from("StaticPage")
        .select("id")
        .eq("systemName", p.systemName)
        .maybeSingle();

      if (!existing) {
        const { data: created, error } = await supabaseAdmin
          .from("StaticPage")
          .insert({
            id: `sp_${p.systemName}`,
            systemName: p.systemName,
          })
          .select("id")
          .single();

        if (!error && created) {
          await supabaseAdmin.from("StaticPageTranslation").insert([
            {
              staticPageId: created.id,
              language: "en",
              slug: p.slug,
              h1: p.nameEn,
              description: p.metaDescEn,
              metaTitle: p.metaTitleEn,
              metaDesc: p.metaDescEn,
            },
            {
              staticPageId: created.id,
              language: "ar",
              slug: p.slug,
              h1: p.nameAr,
              description: p.metaDescAr,
              metaTitle: p.metaTitleAr,
              metaDesc: p.metaDescAr,
            },
          ]);
        }
      }
    }
  } catch (e) {
    console.error("ensureDefaultPagesExist:", e);
  }
}

export async function getStaticPages() {
  await ensureDefaultPagesExist();
  const { data } = await supabase
    .from("StaticPage")
    .select("*, translations:StaticPageTranslation(*)")
    .order("systemName");
  return ((data as any[]) || []).filter((p: any) => p.systemName !== "sections_config");
}

export async function getPageSeo(
  systemName: string,
  lang: LanguageCode = "en",
) {
  try {
    const { data } = await supabase
      .from("StaticPage")
      .select("*, translations:StaticPageTranslation(*)")
      .eq("systemName", systemName)
      .maybeSingle();

    if (!data) {
      const fallback = DEFAULT_SITE_PAGES.find(
        (p) => p.systemName === systemName,
      );
      if (!fallback) return null;
      return {
        title: lang === "ar" ? fallback.metaTitleAr : fallback.metaTitleEn,
        description:
          lang === "ar" ? fallback.metaDescAr : fallback.metaDescEn,
        h1: lang === "ar" ? fallback.nameAr : fallback.nameEn,
      };
    }

    const row = data as any;
    const translations = row.translations || [];
    const t =
      translations.find((x: any) => x.language === lang) ||
      translations.find((x: any) => x.language === "en") ||
      translations[0];

    return {
      title: t?.metaTitle || t?.h1 || null,
      description: t?.metaDesc || t?.description || null,
      h1: t?.h1 || null,
      keywords: t?.keywords || null,
      ogImage: t?.ogImage || null,
    };
  } catch (e) {
    console.error("getPageSeo error:", e);
    return null;
  }
}

export async function updateStaticPageTranslation(input: {
  staticPageId: string;
  language: LanguageCode;
  h1?: string;
  description?: string;
  slug: string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}) {
  await checkAdmin();

  const { data: existing } = await supabaseAdmin
    .from("StaticPageTranslation")
    .select("id")
    .eq("staticPageId", input.staticPageId)
    .eq("language", input.language)
    .maybeSingle();

  const payload = {
    staticPageId: input.staticPageId,
    language: input.language,
    h1: input.h1 || null,
    description: input.description || null,
    slug: input.slug,
    metaTitle: input.metaTitle || null,
    metaDesc: input.metaDesc || null,
    keywords: input.keywords || null,
    ogImage: input.ogImage || null,
    canonical: input.canonical || null,
  };

  if (existing) {
    await supabaseAdmin
      .from("StaticPageTranslation")
      .update(payload)
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("StaticPageTranslation").insert(payload);
  }

  revalidateTag(CACHE_TAGS.STATIC_PAGES, "default");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/seating");
  revalidatePath("/tables-consoles");
  revalidatePath("/lighting");
  revalidatePath("/mirrors");
  revalidatePath("/decor");
  revalidatePath("/atlasadmin/static-pages");

  return { success: true as const };
}

