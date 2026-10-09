"use client";

import { CollectionFeaturedHero } from "@/components/catalog/collection-featured-hero";
import type { FeaturedProduct, FeaturedProductCopy } from "@/lib/featured-product";
import { TABLES_FEATURED_COPY } from "@/lib/tables-featured-copy";
import { TABLES_FEATURED } from "@/lib/tables-data";

interface Props {
  products?: readonly FeaturedProduct[];
  copy?: FeaturedProductCopy;
}

export function TablesFeaturedHero({ products, copy }: Props) {
  return (
    <CollectionFeaturedHero
      products={products && products.length > 0 ? products : TABLES_FEATURED}
      copy={copy && Object.keys(copy).length > 0 ? copy : TABLES_FEATURED_COPY}
      href="/tables-consoles"
      headingId="tables-featured-heading"
      namespace="tablesConsoles"
    />
  );
}

