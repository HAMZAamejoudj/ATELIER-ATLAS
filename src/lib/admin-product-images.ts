import type { ShopProductDB } from "@/types/product";

export const MAX_PRODUCT_IMAGES = 10;

export function emptyProductImageSlots(): string[] {
  return Array.from({ length: MAX_PRODUCT_IMAGES }, () => "");
}

export function productToImageSlots(
  product?: ShopProductDB | null,
): string[] {
  const slots = emptyProductImageSlots();
  if (!product) return slots;

  const ordered: string[] = [];
  for (const url of [
    product.image,
    product.detailImage1,
    product.detailImage2,
    product.detailImage3,
    ...(product.gallery ?? []),
  ]) {
    if (!url || ordered.includes(url)) continue;
    ordered.push(url);
  }

  for (let i = 0; i < Math.min(ordered.length, MAX_PRODUCT_IMAGES); i++) {
    slots[i] = ordered[i];
  }
  return slots;
}
