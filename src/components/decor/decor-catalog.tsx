"use client";

import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";
import { CatalogProvider } from "@/components/catalog/catalog-provider";
import { DecorProductGrid } from "@/components/decor/decor-product-grid";
import { getDecorFilterValues } from "@/lib/catalog-infer-filters";
import type { CatalogCardProduct } from "@/lib/catalog-products";
import type {
  CatalogFilterDefinition,
  CatalogSortOption,
} from "@/lib/catalog-filters";
import type { Locale } from "@/lib/locale";

type DecorCatalogProps = {
  products: CatalogCardProduct[];
  filterDefinitions: CatalogFilterDefinition[];
  sortOptions: CatalogSortOption[];
  locale: Locale;
};

export function DecorCatalog({
  products,
  filterDefinitions,
  sortOptions,
  locale,
}: DecorCatalogProps) {
  return (
    <CatalogProvider
      products={products}
      filterDefinitions={filterDefinitions}
      getFilterValues={getDecorFilterValues}
      locale={locale}
      sortOptions={sortOptions}
    >
      <CatalogFiltersBar />
      <DecorProductGrid />
    </CatalogProvider>
  );
}
