"use client";

import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";
import { CatalogProvider } from "@/components/catalog/catalog-provider";
import { MirrorsProductGrid } from "@/components/mirrors/mirrors-product-grid";
import { getMirrorsFilterValues } from "@/lib/catalog-infer-filters";
import type { CatalogCardProduct } from "@/lib/catalog-products";
import type {
  CatalogFilterDefinition,
  CatalogSortOption,
} from "@/lib/catalog-filters";
import type { Locale } from "@/lib/locale";

type MirrorsCatalogProps = {
  products: CatalogCardProduct[];
  filterDefinitions: CatalogFilterDefinition[];
  sortOptions: CatalogSortOption[];
  locale: Locale;
};

export function MirrorsCatalog({
  products,
  filterDefinitions,
  sortOptions,
  locale,
}: MirrorsCatalogProps) {
  return (
    <CatalogProvider
      products={products}
      filterDefinitions={filterDefinitions}
      getFilterValues={getMirrorsFilterValues}
      locale={locale}
      sortOptions={sortOptions}
    >
      <CatalogFiltersBar />
      <MirrorsProductGrid />
    </CatalogProvider>
  );
}
