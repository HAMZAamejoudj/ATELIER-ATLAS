import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/layout/site-header";
import { MirrorsCatalog } from "@/components/mirrors/mirrors-catalog";
import { MirrorsHero } from "@/components/mirrors/mirrors-hero";
import { MirrorsJournal } from "@/components/mirrors/mirrors-journal";
import { MirrorsMaterialLibrary } from "@/components/mirrors/mirrors-material-library";
import { MirrorsReflectiveSpaces } from "@/components/mirrors/mirrors-reflective-spaces";
import { MirrorsTypes } from "@/components/mirrors/mirrors-types";
import { getMirrorsCatalogPageProps } from "@/lib/catalog-server-props";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import { getSectionsConfig } from "@/actions/sections.actions";
import { formatHeroSlides } from "@/lib/sections-helpers";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("mirrors", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");

  return {
    title: t("mirrors.title"),
    description: t("mirrors.description"),
  };
}

export default async function MirrorsPage() {
  const locale = await getLocale();
  const [catalogProps, sectionsConfig] = await Promise.all([
    getMirrorsCatalogPageProps(locale),
    getSectionsConfig(),
  ]);

  const { products: heroProducts, copy: heroCopy } = formatHeroSlides(
    sectionsConfig.mirrors.heroSlides
  );

  return (
    <>
      <SiteHeader />
      <main>
        <MirrorsHero products={heroProducts} copy={heroCopy} />
        <MirrorsTypes items={sectionsConfig.mirrors.subcategories} />
        <MirrorsCatalog {...catalogProps} />
        <MirrorsReflectiveSpaces />
        <MirrorsMaterialLibrary />
        <MirrorsJournal />
      </main>
    </>
  );
}

