"use client";



import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";

import { CatalogProvider } from "@/components/catalog/catalog-provider";

import { LightingProductGrid } from "@/components/lighting/lighting-product-grid";

import { getLightingFilterValues } from "@/lib/catalog-infer-filters";

import type {

  CatalogFilterDefinition,

  CatalogSortOption,

} from "@/lib/catalog-filters";

import type { Locale } from "@/lib/locale";

import { LIGHTING_PRODUCTS } from "@/lib/lighting-data";



type LightingCatalogProps = {

  filterDefinitions: CatalogFilterDefinition[];

  sortOptions: CatalogSortOption[];

  locale: Locale;

};



export function LightingCatalog({

  filterDefinitions,

  sortOptions,

  locale,

}: LightingCatalogProps) {

  return (

    <CatalogProvider

      products={LIGHTING_PRODUCTS}

      filterDefinitions={filterDefinitions}

      getFilterValues={getLightingFilterValues}

      locale={locale}

      sortOptions={sortOptions}

    >

      <CatalogFiltersBar />

      <LightingProductGrid />

    </CatalogProvider>

  );

}


