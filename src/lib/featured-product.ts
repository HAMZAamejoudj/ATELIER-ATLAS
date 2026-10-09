import type { LocalizedString } from "@/lib/i18n-content";

export type FeaturedProduct = {
  name: string;
  priceUsd: number;
  description: string;
  image: string;
  heroImage: string;
  alt: string;
  heroClassName?: string;
};

export type FeaturedProductCopy = Record<
  string,
  { description: LocalizedString; alt: LocalizedString }
>;
