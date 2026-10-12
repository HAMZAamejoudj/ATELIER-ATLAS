"use client";

import { useTranslations } from "next-intl";

import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { useCatalog } from "@/components/catalog/catalog-provider";
import type { CatalogCardProduct } from "@/lib/catalog-products";

export function SeatingProductGrid() {
  const t = useTranslations("seating.collection");
  const { filteredProducts, paginatedProducts } =
    useCatalog<CatalogCardProduct>();

  return (
    <section
      id="seating-products"
      className="bg-atlas-cream py-10 sm:py-12 lg:py-14"
      aria-labelledby="seating-products-heading"
    >
      <h2 id="seating-products-heading" className="sr-only">
        {t("heading")}
      </h2>
      {filteredProducts.length === 0 ? (
        <CatalogEmptyState />
      ) : (
        <>
          <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-4 gap-y-10 px-4 sm:gap-x-5 sm:gap-y-12 sm:px-6 lg:grid-cols-4 lg:gap-x-5 lg:px-10">
            {paginatedProducts.map((product) => (
              <li key={`${product.name}-${product.href}`}>
                <CatalogProductCard product={product} />
              </li>
            ))}
          </ul>
          <CatalogPagination />
        </>
      )}
    </section>
  );
}
