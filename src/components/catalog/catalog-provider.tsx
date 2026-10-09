"use client";



import {

  createContext,

  useCallback,

  useContext,

  useMemo,

  useState,

  type ReactNode,

} from "react";



import {

  productMatchesFilters,

  sortCatalogProducts,

  type ActiveCatalogFilters,

  type CatalogFilterDefinition,

  type CatalogProductLike,

  type CatalogSort,

  type CatalogSortOption,

} from "@/lib/catalog-filters";

import type { Locale } from "@/lib/locale";



type CatalogContextValue<T extends CatalogProductLike> = {

  allProducts: T[];

  filteredProducts: T[];

  filterDefinitions: CatalogFilterDefinition[];

  activeFilters: ActiveCatalogFilters;

  setFilter: (key: string, value: string | null) => void;

  clearFilters: () => void;

  activeFilterCount: number;

  sort: CatalogSort;

  setSort: (sort: CatalogSort) => void;

  sortOptions: CatalogSortOption[];

};



const CatalogContext = createContext<CatalogContextValue<CatalogProductLike> | null>(

  null,

);



type CatalogProviderProps<T extends CatalogProductLike> = {

  products: T[];

  filterDefinitions: CatalogFilterDefinition[];

  getFilterValues: (product: T) => Record<string, string>;

  locale: Locale;

  sortOptions: CatalogSortOption[];

  children: ReactNode;

};



export function CatalogProvider<T extends CatalogProductLike>({

  products,

  filterDefinitions,

  getFilterValues,

  locale,

  sortOptions,

  children,

}: CatalogProviderProps<T>) {

  const [activeFilters, setActiveFilters] = useState<ActiveCatalogFilters>(() =>

    Object.fromEntries(filterDefinitions.map((def) => [def.key, null])),

  );

  const [sort, setSort] = useState<CatalogSort>("featured");



  const originalOrder = useMemo(

    () => new Map(products.map((product, index) => [product.name, index])),

    [products],

  );



  const setFilter = useCallback((key: string, value: string | null) => {

    setActiveFilters((prev) => ({ ...prev, [key]: value }));

  }, []);



  const clearFilters = useCallback(() => {

    setActiveFilters(

      Object.fromEntries(filterDefinitions.map((def) => [def.key, null])),

    );

  }, [filterDefinitions]);



  const filteredProducts = useMemo(() => {

    const matched = products.filter((product) =>

      productMatchesFilters(getFilterValues(product), activeFilters),

    );

    return sortCatalogProducts(matched, sort, originalOrder, locale);

  }, [products, getFilterValues, activeFilters, sort, originalOrder, locale]);



  const activeFilterCount = useMemo(

    () => Object.values(activeFilters).filter(Boolean).length,

    [activeFilters],

  );



  const value = useMemo<CatalogContextValue<T>>(

    () => ({

      allProducts: products,

      filteredProducts,

      filterDefinitions,

      activeFilters,

      setFilter,

      clearFilters,

      activeFilterCount,

      sort,

      setSort,

      sortOptions,

    }),

    [

      products,

      filteredProducts,

      filterDefinitions,

      activeFilters,

      setFilter,

      clearFilters,

      activeFilterCount,

      sort,

      sortOptions,

    ],

  );



  return (

    <CatalogContext.Provider

      value={value as CatalogContextValue<CatalogProductLike>}

    >

      {children}

    </CatalogContext.Provider>

  );

}



export function useCatalog<T extends CatalogProductLike = CatalogProductLike>() {

  const ctx = useContext(CatalogContext);

  if (!ctx) {

    throw new Error("useCatalog must be used within CatalogProvider");

  }

  return ctx as CatalogContextValue<T>;

}


