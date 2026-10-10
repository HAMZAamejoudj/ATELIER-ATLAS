"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { useCatalog } from "@/components/catalog/catalog-provider";
import { isRemoteCatalogImage } from "@/lib/catalog-products";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/wishlist/add-to-wishlist-button";
import { useLocalizedProduct } from "@/hooks/use-localized-product";
import type { DecorProduct } from "@/lib/decor-data";

function DecorProductCard({ product }: { product: DecorProduct }) {
  const t = useTranslations("common");
  const { displayName, displayPrice, cartProduct } = useLocalizedProduct(product);

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-[#f0ebe3]">
        <div className="absolute top-3 left-3 z-10">
          <AddToCartButton product={cartProduct} />
        </div>
        <AddToWishlistButton product={cartProduct} />
        <Link href={product.href} className="block size-full">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            unoptimized={isRemoteCatalogImage(product.image)}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
          />
        </Link>
      </div>
      <div className="mt-3 sm:mt-4">
        <Link
          href={product.href}
          className="block font-serif text-[15px] font-bold leading-snug text-atlas-charcoal transition-opacity hover:opacity-75 sm:text-base"
        >
          {displayName}
        </Link>
        <p className="mt-1 font-sans text-sm font-bold tabular-nums text-atlas-charcoal sm:text-[15px]">
          {displayPrice}
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <ul className="flex items-center gap-1" aria-label={t("availableColors")}>
            {product.swatches.map((color) => (
              <li key={color}>
                <span
                  className="block size-3 rounded-full border border-atlas-charcoal/15 sm:size-3.5"
                  style={{ backgroundColor: color }}
                />
              </li>
            ))}
          </ul>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-atlas-charcoal/80">
            {product.material}
          </span>
        </div>
      </div>
    </article>
  );
}

export function DecorProductGrid() {
  const { filteredProducts, paginatedProducts } = useCatalog<DecorProduct>();

  return (
    <section
      id="decor-products"
      className="bg-atlas-cream py-10 sm:py-12 lg:py-14"
      aria-labelledby="decor-products-heading"
    >
      <h2 id="decor-products-heading" className="sr-only">
        Decor collection
      </h2>
      {filteredProducts.length === 0 ? (
        <CatalogEmptyState />
      ) : (
        <>
          <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-4 gap-y-10 px-4 sm:gap-x-5 sm:gap-y-12 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-x-4 lg:px-10">
            {paginatedProducts.map((product) => (
              <li key={`${product.name}-${product.image}`}>
                <DecorProductCard product={product} />
              </li>
            ))}
          </ul>
          <CatalogPagination />
        </>
      )}
    </section>
  );
}
