"use client";

import { CollectionFeaturedHero } from "@/components/catalog/collection-featured-hero";
import type { FeaturedProduct, FeaturedProductCopy } from "@/lib/featured-product";
import { SEATING_FEATURED_COPY } from "@/lib/seating-featured-copy";
import { SEATING_FEATURED } from "@/lib/seating-data";

interface Props {
  products?: readonly FeaturedProduct[];
  copy?: FeaturedProductCopy;
}

export function SeatingFeaturedHero({ products, copy }: Props) {
  return (
    <CollectionFeaturedHero
      products={products && products.length > 0 ? products : SEATING_FEATURED}
      copy={copy && Object.keys(copy).length > 0 ? copy : SEATING_FEATURED_COPY}
      href="/seating"
      headingId="seating-featured-heading"
      namespace="seating"
      heroImageClassName="object-cover object-[58%_42%] sm:object-[62%_45%] lg:object-[68%_50%]"
    />
  );
}

