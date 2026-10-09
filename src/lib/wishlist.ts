import { type CartProduct, toCartProduct } from "@/lib/cart";

export type WishlistItem = CartProduct;

export const WISHLIST_STORAGE_KEY = "atelier-atlas-wishlist";

export { toCartProduct as toWishlistItem };

export function wishlistItemCount(items: WishlistItem[]): number {
  return items.length;
}
