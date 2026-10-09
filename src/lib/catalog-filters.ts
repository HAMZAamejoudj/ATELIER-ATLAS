import type { Locale } from "@/lib/locale";

export type CatalogSort = "featured" | "price-asc" | "price-desc" | "name-asc";

export type CatalogFilterOption = {
  value: string;
  label: string;
};

export type CatalogFilterDefinition = {
  key: string;
  label: string;
  options: readonly CatalogFilterOption[];
};

export type CatalogProductLike = {
  name: string;
  priceUsd: number;
  swatches: string[];
  material: string;
};

export const PRICE_BUCKET_IDS = [
  "under_500",
  "500_999",
  "1000_1499",
  "1500_plus",
] as const;

export type PriceBucketId = (typeof PRICE_BUCKET_IDS)[number];

export function priceBucketFromUsd(usd: number): PriceBucketId {
  if (usd < 500) return "under_500";
  if (usd < 1000) return "500_999";
  if (usd < 1500) return "1000_1499";
  return "1500_plus";
}

/** @deprecated Use priceBucketFromUsd */
export function priceBucket(price: string): PriceBucketId {
  const digits = price.replace(/[^0-9.]/g, "");
  const value = Number.parseFloat(digits);
  return priceBucketFromUsd(Number.isFinite(value) ? value : 0);
}

function hexToLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return 0.5;
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function swatchColorFamily(swatches: string[]): string {
  if (swatches.length === 0) return "Neutral";
  const avg =
    swatches.reduce((sum, hex) => sum + hexToLuminance(hex), 0) /
    swatches.length;
  if (avg < 0.35) return "Dark";
  if (avg > 0.72) return "Neutral";
  return "Warm";
}

export function primaryMaterial(material: string): string {
  const base = material.split("+")[0]?.trim() ?? material;
  return base;
}

export type ActiveCatalogFilters = Record<string, string | null>;

export function productMatchesFilters(
  values: Record<string, string>,
  active: ActiveCatalogFilters,
): boolean {
  for (const [key, selected] of Object.entries(active)) {
    if (!selected) continue;
    if (values[key] !== selected) return false;
  }
  return true;
}

export function sortCatalogProducts<T extends CatalogProductLike>(
  products: T[],
  sort: CatalogSort,
  originalOrder: Map<string, number>,
  locale: Locale = "en",
): T[] {
  const copy = [...products];
  if (sort === "featured") {
    copy.sort(
      (a, b) =>
        (originalOrder.get(a.name) ?? 0) - (originalOrder.get(b.name) ?? 0),
    );
    return copy;
  }
  if (sort === "price-asc") {
    return copy.sort((a, b) => a.priceUsd - b.priceUsd);
  }
  if (sort === "price-desc") {
    return copy.sort((a, b) => b.priceUsd - a.priceUsd);
  }
  return copy.sort((a, b) =>
    a.name.localeCompare(b.name, locale === "ar" ? "ar" : "en"),
  );
}

export type CatalogSortOption = { value: CatalogSort; label: string };

export type CatalogSortLabels = {
  featured: string;
  priceAsc: string;
  priceDesc: string;
  nameAsc: string;
};

export function getCatalogSortOptions(
  labels: CatalogSortLabels,
): CatalogSortOption[] {
  return [
    { value: "featured", label: labels.featured },
    { value: "price-asc", label: labels.priceAsc },
    { value: "price-desc", label: labels.priceDesc },
    { value: "name-asc", label: labels.nameAsc },
  ];
}
