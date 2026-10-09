import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SeatingApproach } from "@/components/seating/seating-approach";
import { SeatingFeaturedHero } from "@/components/seating/seating-featured-hero";
import { SeatingCatalog } from "@/components/seating/seating-catalog";
import { SeatingSubcategories } from "@/components/seating/seating-subcategories";
import { SiteHeader } from "@/components/layout/site-header";
import { getSeatingCatalogPageProps } from "@/lib/catalog-server-props";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import { getSectionsConfig } from "@/actions/sections.actions";
import { formatHeroSlides } from "@/lib/sections-helpers";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("seating", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");
  return {
    title: t("seating.title"),
    description: t("seating.description"),
  };
}

export default async function SeatingPage() {
  const locale = await getLocale();
  const [catalogProps, sectionsConfig] = await Promise.all([
    getSeatingCatalogPageProps(locale),
    getSectionsConfig(),
  ]);

  const { products: heroProducts, copy: heroCopy } = formatHeroSlides(
    sectionsConfig.seating.heroSlides
  );

  return (
    <>
      <SiteHeader />
      <main>
        <SeatingFeaturedHero products={heroProducts} copy={heroCopy} />
        <SeatingSubcategories items={sectionsConfig.seating.subcategories} />
        <SeatingCatalog {...catalogProps} />
        <SeatingApproach />
      </main>
    </>
  );
}


