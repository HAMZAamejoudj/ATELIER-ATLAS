"use client";



import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";

import { CatalogProvider } from "@/components/catalog/catalog-provider";

import { SeatingProductGrid } from "@/components/seating/seating-product-grid";

import { getSeatingFilterValues } from "@/lib/catalog-infer-filters";

import type {

  CatalogFilterDefinition,

  CatalogSortOption,

} from "@/lib/catalog-filters";

import type { Locale } from "@/lib/locale";

import { SEATING_PRODUCTS } from "@/lib/seating-data";



type SeatingCatalogProps = {

  filterDefinitions: CatalogFilterDefinition[];

  sortOptions: CatalogSortOption[];

  locale: Locale;

};



export function SeatingCatalog({

  filterDefinitions,

  sortOptions,

  locale,

}: SeatingCatalogProps) {

  return (

    <CatalogProvider

      products={SEATING_PRODUCTS}

      filterDefinitions={filterDefinitions}

      getFilterValues={getSeatingFilterValues}

      locale={locale}

      sortOptions={sortOptions}

    >

      <CatalogFiltersBar />

      <SeatingProductGrid />

    </CatalogProvider>

  );

}


