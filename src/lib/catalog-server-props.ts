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
import {
  getStorefrontCatalogProducts,
  type CatalogCardProduct,
} from "@/lib/catalog-products";
import { DECOR_PRODUCTS } from "@/lib/decor-data";
import { LIGHTING_PRODUCTS } from "@/lib/lighting-data";
import type { Locale } from "@/lib/locale";
import { MIRRORS_PRODUCTS } from "@/lib/mirrors-data";
import { SEATING_PRODUCTS } from "@/lib/seating-data";
import { TABLES_PRODUCTS } from "@/lib/tables-data";

export type CatalogPageProps = {
  locale: Locale;
  filterDefinitions: CatalogFilterDefinition[];
  sortOptions: CatalogSortOption[];
  products: CatalogCardProduct[];
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

async function buildCatalogPageProps(
  locale: Locale,
  collectionSlug: string,
  fallback: CatalogCardProduct[],
  filterDefinitions: CatalogFilterDefinition[],
): Promise<CatalogPageProps> {
  const [sortOptions, products] = await Promise.all([
    localizedSortOptions(),
    getStorefrontCatalogProducts(collectionSlug, fallback, locale),
  ]);

  return {
    locale,
    filterDefinitions,
    sortOptions,
    products,
  };
}

export async function getSeatingCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return buildCatalogPageProps(
    locale,
    "seating",
    SEATING_PRODUCTS,
    getSeatingFilterDefinitions(tr, locale),
  );
}

export async function getLightingCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return buildCatalogPageProps(
    locale,
    "lighting",
    LIGHTING_PRODUCTS,
    getLightingFilterDefinitions(tr, locale),
  );
}

export async function getDecorCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return buildCatalogPageProps(
    locale,
    "decor",
    DECOR_PRODUCTS,
    getDecorFilterDefinitions(tr, locale),
  );
}

export async function getMirrorsCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return buildCatalogPageProps(
    locale,
    "mirrors",
    MIRRORS_PRODUCTS,
    getMirrorsFilterDefinitions(tr, locale),
  );
}

export async function getTablesCatalogPageProps(
  locale: Locale,
): Promise<CatalogPageProps> {
  const tr = await catalogTranslator();
  return buildCatalogPageProps(
    locale,
    "tables-consoles",
    TABLES_PRODUCTS,
    getTablesFilterDefinitions(tr, locale),
  );
}
