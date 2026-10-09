"use client";

import { CollectionFeaturedHero } from "@/components/catalog/collection-featured-hero";
import type { FeaturedProduct, FeaturedProductCopy } from "@/lib/featured-product";
import { DECOR_FEATURED_COPY } from "@/lib/decor-featured-copy";
import { DECOR_FEATURED } from "@/lib/decor-featured";

interface Props {
  products?: readonly FeaturedProduct[];
  copy?: FeaturedProductCopy;
}

export function DecorHero({ products, copy }: Props) {
  return (
    <CollectionFeaturedHero
      products={products && products.length > 0 ? products : DECOR_FEATURED}
      copy={copy && Object.keys(copy).length > 0 ? copy : DECOR_FEATURED_COPY}
      href="/decor"
      headingId="decor-featured-heading"
      namespace="decor"
    />
  );
}

