"use client";

import { CollectionFeaturedHero } from "@/components/catalog/collection-featured-hero";
import type { FeaturedProduct, FeaturedProductCopy } from "@/lib/featured-product";
import { LIGHTING_FEATURED_COPY } from "@/lib/lighting-featured-copy";
import { LIGHTING_FEATURED } from "@/lib/lighting-data";

interface Props {
  products?: readonly FeaturedProduct[];
  copy?: FeaturedProductCopy;
}

export function LightingHero({ products, copy }: Props) {
  return (
    <CollectionFeaturedHero
      products={products && products.length > 0 ? products : LIGHTING_FEATURED}
      copy={copy && Object.keys(copy).length > 0 ? copy : LIGHTING_FEATURED_COPY}
      href="/lighting"
      headingId="lighting-featured-heading"
      namespace="lighting"
    />
  );
}

