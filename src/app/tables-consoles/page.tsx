import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteHeader } from "@/components/layout/site-header";
import { TablesApproach } from "@/components/tables-consoles/tables-approach";
import { TablesCatalog } from "@/components/tables-consoles/tables-catalog";
import { TablesFeaturedHero } from "@/components/tables-consoles/tables-featured-hero";
import { TablesSubcategories } from "@/components/tables-consoles/tables-subcategories";
import { getTablesCatalogPageProps } from "@/lib/catalog-server-props";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import { getSectionsConfig } from "@/actions/sections.actions";
import { formatHeroSlides } from "@/lib/sections-helpers";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("tables-consoles", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");
  return {
    title: t("tablesConsoles.title"),
    description: t("tablesConsoles.description"),
  };
}

export default async function TablesConsolesPage() {
  const locale = await getLocale();
  const [catalogProps, sectionsConfig] = await Promise.all([
    getTablesCatalogPageProps(locale),
    getSectionsConfig(),
  ]);

  const { products: heroProducts, copy: heroCopy } = formatHeroSlides(
    sectionsConfig.tables.heroSlides
  );

  return (
    <>
      <SiteHeader />
      <main>
        <TablesFeaturedHero products={heroProducts} copy={heroCopy} />
        <TablesSubcategories items={sectionsConfig.tables.subcategories} />
        <TablesCatalog {...catalogProps} />
        <TablesApproach />
      </main>
    </>
  );
}

