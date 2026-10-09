import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LightingCatalog } from "@/components/lighting/lighting-catalog";
import { LightingHero } from "@/components/lighting/lighting-hero";
import { LightingInspire } from "@/components/lighting/lighting-inspire";
import { LightingMaterials } from "@/components/lighting/lighting-materials";
import { LightingSubcategories } from "@/components/lighting/lighting-subcategories";
import { SiteHeader } from "@/components/layout/site-header";
import { getLightingCatalogPageProps } from "@/lib/catalog-server-props";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import { getSectionsConfig } from "@/actions/sections.actions";
import { formatHeroSlides } from "@/lib/sections-helpers";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("lighting", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");

  return {
    title: t("lighting.title"),
    description: t("lighting.description"),
  };
}

export default async function LightingPage() {
  const locale = await getLocale();
  const [catalogProps, sectionsConfig] = await Promise.all([
    getLightingCatalogPageProps(locale),
    getSectionsConfig(),
  ]);

  const { products: heroProducts, copy: heroCopy } = formatHeroSlides(
    sectionsConfig.lighting.heroSlides
  );

  return (
    <>
      <SiteHeader />
      <main>
        <LightingHero products={heroProducts} copy={heroCopy} />
        <LightingSubcategories items={sectionsConfig.lighting.subcategories} />
        <LightingCatalog {...catalogProps} />
        <LightingMaterials />
        <LightingInspire />
      </main>
    </>
  );
}

