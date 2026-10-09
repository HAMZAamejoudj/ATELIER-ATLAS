"use client";

import { CollectionFeaturedHero } from "@/components/catalog/collection-featured-hero";
import type { FeaturedProduct, FeaturedProductCopy } from "@/lib/featured-product";
import { MIRRORS_FEATURED_COPY } from "@/lib/mirrors-featured-copy";
import { MIRRORS_FEATURED } from "@/lib/mirrors-data";

interface Props {
  products?: readonly FeaturedProduct[];
  copy?: FeaturedProductCopy;
}

export function MirrorsHero({ products, copy }: Props) {
  return (
    <CollectionFeaturedHero
      products={products && products.length > 0 ? products : MIRRORS_FEATURED}
      copy={copy && Object.keys(copy).length > 0 ? copy : MIRRORS_FEATURED_COPY}
      href="/mirrors"
      headingId="mirrors-featured-heading"
      namespace="mirrors"
    />
  );
}

