"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  WISHLIST_STORAGE_KEY,
  wishlistItemCount,
  type WishlistItem,
} from "@/lib/wishlist";

type WishlistContextValue = {
  items: WishlistItem[];
  itemCount: number;
  isInWishlist: (id: string) => boolean;
  toggleItem: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const isInWishlist = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const toggleItem = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      itemCount: wishlistItemCount(items),
      isInWishlist,
      toggleItem,
      removeItem,
      clearWishlist,
    }),
    [items, isInWishlist, toggleItem, removeItem, clearWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
