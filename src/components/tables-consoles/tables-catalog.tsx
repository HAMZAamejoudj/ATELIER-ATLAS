"use client";

import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";
import { CatalogProvider } from "@/components/catalog/catalog-provider";
import { TablesProductGrid } from "@/components/tables-consoles/tables-product-grid";
import { getTablesFilterValues } from "@/lib/catalog-infer-filters";
import type { CatalogCardProduct } from "@/lib/catalog-products";
import type {
  CatalogFilterDefinition,
  CatalogSortOption,
} from "@/lib/catalog-filters";
import type { Locale } from "@/lib/locale";

type TablesCatalogProps = {
  products: CatalogCardProduct[];
  filterDefinitions: CatalogFilterDefinition[];
  sortOptions: CatalogSortOption[];
  locale: Locale;
};

export function TablesCatalog({
  products,
  filterDefinitions,
  sortOptions,
  locale,
}: TablesCatalogProps) {
  return (
    <CatalogProvider
      products={products}
      filterDefinitions={filterDefinitions}
      getFilterValues={getTablesFilterValues}
      locale={locale}
      sortOptions={sortOptions}
    >
      <CatalogFiltersBar />
      <TablesProductGrid />
    </CatalogProvider>
  );
}
