import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DecorBalanceBanner } from "@/components/decor/decor-balance-banner";
import { DecorCatalog } from "@/components/decor/decor-catalog";
import { DecorCategories } from "@/components/decor/decor-categories";
import { DecorHero } from "@/components/decor/decor-hero";
import { DecorMaterialsFocus } from "@/components/decor/decor-materials-focus";
import { DecorReflectiveSpaces } from "@/components/decor/decor-reflective-spaces";
import { SiteHeader } from "@/components/layout/site-header";
import { getDecorCatalogPageProps } from "@/lib/catalog-server-props";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import { getSectionsConfig } from "@/actions/sections.actions";
import { formatHeroSlides } from "@/lib/sections-helpers";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("decor", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");

  return {
    title: t("decor.title"),
    description: t("decor.description"),
  };
}

export default async function DecorPage() {
  const locale = await getLocale();
  const [catalogProps, sectionsConfig] = await Promise.all([
    getDecorCatalogPageProps(locale),
    getSectionsConfig(),
  ]);

  const { products: heroProducts, copy: heroCopy } = formatHeroSlides(
    sectionsConfig.decor.heroSlides
  );

  return (
    <>
      <SiteHeader />
      <main>
        <DecorHero products={heroProducts} copy={heroCopy} />
        <DecorCategories items={sectionsConfig.decor.subcategories} />
        <DecorCatalog {...catalogProps} />
        <DecorReflectiveSpaces />
        <DecorMaterialsFocus />
        <DecorBalanceBanner />
      </main>
    </>
  );
}

