"use client";



import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";

import { CatalogProvider } from "@/components/catalog/catalog-provider";

import { DecorProductGrid } from "@/components/decor/decor-product-grid";

import { getDecorFilterValues } from "@/lib/catalog-infer-filters";

import type {

  CatalogFilterDefinition,

  CatalogSortOption,

} from "@/lib/catalog-filters";

import type { Locale } from "@/lib/locale";

import { DECOR_PRODUCTS } from "@/lib/decor-data";



type DecorCatalogProps = {

  filterDefinitions: CatalogFilterDefinition[];

  sortOptions: CatalogSortOption[];

  locale: Locale;

};



export function DecorCatalog({

  filterDefinitions,

  sortOptions,

  locale,

}: DecorCatalogProps) {

  return (

    <CatalogProvider

      products={DECOR_PRODUCTS}

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


