"use client";



import { CatalogFiltersBar } from "@/components/catalog/catalog-filters-bar";

import { CatalogProvider } from "@/components/catalog/catalog-provider";

import { MirrorsProductGrid } from "@/components/mirrors/mirrors-product-grid";

import { getMirrorsFilterValues } from "@/lib/catalog-infer-filters";

import type {

  CatalogFilterDefinition,

  CatalogSortOption,

} from "@/lib/catalog-filters";

import type { Locale } from "@/lib/locale";

import { MIRRORS_PRODUCTS } from "@/lib/mirrors-data";



type MirrorsCatalogProps = {

  filterDefinitions: CatalogFilterDefinition[];

  sortOptions: CatalogSortOption[];

  locale: Locale;

};



export function MirrorsCatalog({

  filterDefinitions,

  sortOptions,

  locale,

}: MirrorsCatalogProps) {

  return (

    <CatalogProvider

      products={MIRRORS_PRODUCTS}

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


