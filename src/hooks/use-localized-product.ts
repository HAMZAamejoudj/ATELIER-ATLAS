"use client";

import { useLocale } from "next-intl";

import { toCartProduct } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { translateProductName } from "@/lib/product-names-ar";
import { isLocale, type Locale } from "@/lib/locale";

export type ProductWithPrice = {
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  href: string;
};

export function useLocalizedProduct(product: ProductWithPrice) {
  const rawLocale = useLocale();
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const displayName = translateProductName(product.name, locale);
  const displayPrice = formatMoney(product.priceUsd, locale);
  const cartProduct = toCartProduct({ ...product, name: product.name });

  return {
    locale,
    displayName,
    displayPrice,
    cartProduct,
  };
}
