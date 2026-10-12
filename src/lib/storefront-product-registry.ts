import { DECOR_PRODUCTS } from "@/lib/decor-data";
import { DECOR_FEATURED } from "@/lib/decor-featured";
import { LIGHTING_FEATURED, LIGHTING_PRODUCTS } from "@/lib/lighting-data";
import { MIRRORS_FEATURED, MIRRORS_PRODUCTS } from "@/lib/mirrors-data";
import { SEATING_FEATURED, SEATING_PRODUCTS } from "@/lib/seating-data";
import { TABLES_FEATURED, TABLES_PRODUCTS } from "@/lib/tables-data";
import { productDetailPath, productSlugFromName } from "@/lib/product-slug";
import {
  swatchesToColorVariants,
  type ProductColorVariant,
} from "@/lib/product-color-variants";
import type { ProductBadge } from "@/types/product";

export type StorefrontProductDetail = {
  id: string;
  slug: string;
  name: string;
  priceUsd: number;
  compareAtUsd: number | null;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  alt: string;
  material: string;
  swatches: string[];
  colorVariants: ProductColorVariant[];
  badge: ProductBadge | null;
  collectionSlug: string;
  collectionLabel: string;
  sku: string;
  inStock: boolean;
  href: string;
};

type CatalogRow = {
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  badge?: "BEST SELLER" | "NEW";
  swatches: string[];
  material: string;
};

type FeaturedRow = { name: string; description: string; heroImage?: string };

const COLLECTIONS = [
  {
    slug: "seating",
    label: "Seating",
    products: SEATING_PRODUCTS as CatalogRow[],
    featured: SEATING_FEATURED as readonly FeaturedRow[],
  },
  {
    slug: "lighting",
    label: "Lighting",
    products: LIGHTING_PRODUCTS as CatalogRow[],
    featured: LIGHTING_FEATURED as readonly FeaturedRow[],
  },
  {
    slug: "decor",
    label: "Decor",
    products: DECOR_PRODUCTS as CatalogRow[],
    featured: DECOR_FEATURED as readonly FeaturedRow[],
  },
  {
    slug: "mirrors",
    label: "Mirrors",
    products: MIRRORS_PRODUCTS as CatalogRow[],
    featured: MIRRORS_FEATURED as readonly FeaturedRow[],
  },
  {
    slug: "tables-consoles",
    label: "Tables & Consoles",
    products: TABLES_PRODUCTS as CatalogRow[],
    featured: TABLES_FEATURED as readonly FeaturedRow[],
  },
];

function mapBadge(badge?: "BEST SELLER" | "NEW"): ProductBadge | null {
  if (badge === "BEST SELLER") return "BEST_SELLER";
  if (badge === "NEW") return "NEW";
  return null;
}

function defaultDescription(name: string, material: string): string {
  const baseMaterial = material.split("+")[0]?.trim() || material;
  return `${name} is handcrafted to order in our Marrakech workshop, shaped in ${baseMaterial} with the calm proportions and tactile finishes that define Moroccan Travertine. Each piece is made for daily use — dining, gathering, and quiet ritual — with bespoke dimensions and finish samples available on request.`;
}

function buildRegistry(): Map<string, StorefrontProductDetail> {
  const descriptionByName = new Map<string, string>();
  for (const group of COLLECTIONS) {
    for (const item of group.featured) {
      descriptionByName.set(item.name.trim().toLowerCase(), item.description);
    }
  }

  const map = new Map<string, StorefrontProductDetail>();

  for (const group of COLLECTIONS) {
    for (const product of group.products) {
      const slug = productSlugFromName(product.name);
      const description =
        descriptionByName.get(product.name.trim().toLowerCase()) ??
        defaultDescription(product.name, product.material);

      map.set(slug, {
        id: slug,
        slug,
        name: product.name,
        priceUsd: product.priceUsd,
        compareAtUsd: null,
        description,
        shortDescription: description.split(". ")[0] + ".",
        image: product.image,
        gallery: [product.image],
        alt: product.alt,
        material: product.material,
        swatches: product.swatches,
        colorVariants: swatchesToColorVariants(product.swatches, product.image),
        badge: mapBadge(product.badge),
        collectionSlug: group.slug,
        collectionLabel: group.label,
        sku: slug.toUpperCase().replace(/-/g, ""),
        inStock: true,
        href: productDetailPath(slug),
      });
    }
  }

  return map;
}

const REGISTRY = buildRegistry();

export function getStaticProductBySlug(
  slug: string,
): StorefrontProductDetail | null {
  return REGISTRY.get(slug) ?? null;
}

export function getAllStaticProductSlugs(): string[] {
  return [...REGISTRY.keys()];
}

export function getStaticProductsInCollection(
  collectionSlug: string,
  excludeSlug?: string,
  limit = 4,
): StorefrontProductDetail[] {
  const items = [...REGISTRY.values()].filter(
    (p) =>
      p.collectionSlug === collectionSlug &&
      (!excludeSlug || p.slug !== excludeSlug),
  );
  return items.slice(0, limit);
}
