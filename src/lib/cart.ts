import type { Locale } from "@/lib/locale";
import { formatMoney } from "@/lib/money";
import { translateProductName } from "@/lib/product-names-ar";

export type CartProduct = {
  id: string;
  name: string;
  nameEn: string;
  priceUsd: number;
  image: string;
  alt: string;
  href: string;
};

export type CartLineItem = CartProduct & {
  quantity: number;
};

/** @deprecated legacy line items in localStorage */
export type LegacyCartLineItem = {
  id: string;
  name: string;
  nameEn?: string;
  price?: string;
  priceUsd?: number;
  quantity: number;
  image: string;
  alt: string;
  href: string;
};

export const CART_STORAGE_KEY = "atelier-atlas-cart";

export function cartProductId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toCartProduct(product: {
  name: string;
  priceUsd: number;
  image: string;
  alt: string;
  href: string;
}): CartProduct {
  return {
    id: cartProductId(product.name),
    nameEn: product.name,
    name: product.name,
    priceUsd: product.priceUsd,
    image: product.image,
    alt: product.alt,
    href: product.href,
  };
}

export function parsePriceDisplay(price: string): number {
  const digits = price.replace(/[^0-9.]/g, "");
  const value = Number.parseFloat(digits);
  return Number.isFinite(value) ? value : 0;
}

export function migrateCartItem(
  item: LegacyCartLineItem,
  locale: Locale,
): CartLineItem {
  const nameEn = item.nameEn ?? item.name;
  const priceUsd =
    item.priceUsd ??
    (item.price ? parsePriceDisplay(item.price) : 0);
  const base: CartProduct = {
    id: item.id,
    nameEn,
    name: translateProductName(nameEn, locale),
    priceUsd,
    image: item.image,
    alt: item.alt,
    href: item.href,
  };
  return { ...base, quantity: item.quantity };
}

export function localizeCartItems(
  items: CartLineItem[],
  locale: Locale,
): CartLineItem[] {
  return items.map((item) => ({
    ...item,
    name: translateProductName(item.nameEn, locale),
  }));
}

export function formatCartSubtotal(
  items: CartLineItem[],
  locale: Locale,
): string {
  const total = items.reduce(
    (sum, item) => sum + item.priceUsd * item.quantity,
    0,
  );
  return formatMoney(total, locale);
}

export function formatLinePrice(priceUsd: number, locale: Locale): string {
  return formatMoney(priceUsd, locale);
}

export function cartItemCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
