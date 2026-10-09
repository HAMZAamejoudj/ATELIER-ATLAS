import { getTranslations } from "next-intl/server";

import {
  getDecorFilterDefinitions,
  getLightingFilterDefinitions,
  getMirrorsFilterDefinitions,
  getSeatingFilterDefinitions,
  getTablesFilterDefinitions,
  type CatalogTranslator,
} from "@/lib/catalog-filter-configs";
import {
  getCatalogSortOptions,
  type CatalogFilterDefinition,
  type CatalogSortOption,
} from "@/lib/catalog-filters";
import type { Locale } from "@/lib/locale";

export type CatalogPageProps = {
  locale: Locale;
  filterDefinitions: CatalogFilterDefinition[];
  sortOptions: CatalogSortOption[];
};

async function catalogTranslator(): Promise<CatalogTranslator> {
  const t = await getTranslations("catalog");
  return (key, values) => t(key, values);
}

async function localizedSortOptions(): Promise<CatalogSortOption[]> {
  const t = await getTranslations("catalog");
  return getCatalogSortOptions({
    featured: t("sort.featured"),
    priceAsc: t("sort.priceAsc"),
    priceDesc: t("sort.priceDesc"),
    nameAsc: t("sort.nameAsc"),
  });
}

export async function getSeatingCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return {
    locale,
    filterDefinitions: getSeatingFilterDefinitions(tr, locale),
    sortOptions: await localizedSortOptions(),
  };
}

export async function getLightingCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return {
    locale,
    filterDefinitions: getLightingFilterDefinitions(tr, locale),
    sortOptions: await localizedSortOptions(),
  };
}

export async function getDecorCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return {
    locale,
    filterDefinitions: getDecorFilterDefinitions(tr, locale),
    sortOptions: await localizedSortOptions(),
  };
}

export async function getMirrorsCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return {
    locale,
    filterDefinitions: getMirrorsFilterDefinitions(tr, locale),
    sortOptions: await localizedSortOptions(),
  };
}

export async function getTablesCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return {
    locale,
    filterDefinitions: getTablesFilterDefinitions(tr, locale),
    sortOptions: await localizedSortOptions(),
  };
}
