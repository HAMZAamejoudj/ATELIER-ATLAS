import { cartProductId } from "@/lib/cart";

export function productSlugFromName(name: string): string {
  return cartProductId(name);
}

export function productDetailPath(slug: string): string {
  return `/products/${slug}`;
}
