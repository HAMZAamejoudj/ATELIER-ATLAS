"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { useCatalog } from "@/components/catalog/catalog-provider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/wishlist/add-to-wishlist-button";
import { useLocalizedProduct } from "@/hooks/use-localized-product";
import type { MirrorProduct } from "@/lib/mirrors-data";

function MirrorProductCard({ product }: { product: MirrorProduct }) {
  const t = useTranslations("common");
  const { displayName, displayPrice, cartProduct } = useLocalizedProduct(product);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3]">
        <div className="absolute top-3 left-3 z-10">
          <AddToCartButton product={cartProduct} />
        </div>
        <AddToWishlistButton product={cartProduct} />
        <Link href={product.href} className="block size-full">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
      </div>
      <div className="mt-3 sm:mt-4">
        <Link
          href={product.href}
          className="block font-serif text-sm font-bold leading-snug text-atlas-charcoal transition-opacity hover:opacity-75 sm:text-[15px]"
        >
          {displayName}
        </Link>
        <p className="mt-1 font-sans text-sm font-semibold tabular-nums text-atlas-charcoal sm:text-[15px]">
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
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-atlas-charcoal/65">
            {product.material}
          </span>
        </div>
      </div>
    </article>
  );
}

export function MirrorsProductGrid() {
  const { filteredProducts } = useCatalog<MirrorProduct>();

  return (
    <section
      id="mirrors-products"
      className="bg-atlas-cream py-10 sm:py-12 lg:py-14"
      aria-labelledby="mirrors-products-heading"
    >
      <h2 id="mirrors-products-heading" className="sr-only">
        Mirror collection
      </h2>
      {filteredProducts.length === 0 ? (
        <CatalogEmptyState />
      ) : (
      <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-4 gap-y-10 px-4 sm:gap-x-5 sm:gap-y-12 sm:px-6 lg:grid-cols-4 lg:gap-x-5 lg:px-10">
        {filteredProducts.map((product) => (
          <li key={product.name}>
            <MirrorProductCard product={product} />
          </li>
        ))}
      </ul>
      )}
    </section>
  );
}
