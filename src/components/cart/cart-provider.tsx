"use client";



import { useLocale } from "next-intl";

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

  CART_STORAGE_KEY,

  cartItemCount,

  localizeCartItems,

  migrateCartItem,

  type CartLineItem,

  type CartProduct,

  type LegacyCartLineItem,

} from "@/lib/cart";

import { isLocale, type Locale } from "@/lib/locale";



type CartContextValue = {

  items: CartLineItem[];

  itemCount: number;

  isOpen: boolean;

  openCart: () => void;

  closeCart: () => void;

  setOpen: (open: boolean) => void;

  addItem: (product: CartProduct, options?: { openDrawer?: boolean }) => void;

  removeItem: (id: string) => void;

  setQuantity: (id: string, quantity: number) => void;

  clearCart: () => void;

};



const CartContext = createContext<CartContextValue | null>(null);



export function CartProvider({ children }: { children: ReactNode }) {

  const rawLocale = useLocale();

  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  const [items, setItems] = useState<CartLineItem[]>([]);

  const [isOpen, setOpen] = useState(false);

  const [hydrated, setHydrated] = useState(false);



  useEffect(() => {

    try {

      const raw = localStorage.getItem(CART_STORAGE_KEY);

      if (raw) {

        const parsed = JSON.parse(raw) as LegacyCartLineItem[];

        if (Array.isArray(parsed)) {

          setItems(parsed.map((item) => migrateCartItem(item, locale)));

        }

      }

    } catch {

      /* ignore corrupt storage */

    }

    setHydrated(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps -- migrate once on mount

  }, []);



  useEffect(() => {

    if (!hydrated) return;

    setItems((prev) => localizeCartItems(prev, locale));

  }, [locale, hydrated]);



  useEffect(() => {

    if (!hydrated) return;

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

  }, [items, hydrated]);



  const addItem = useCallback(

    (product: CartProduct, options?: { openDrawer?: boolean }) => {

      setItems((prev) => {

        const existing = prev.find((line) => line.id === product.id);

        if (existing) {

          return prev.map((line) =>

            line.id === product.id

              ? { ...line, quantity: line.quantity + 1 }

              : line,

          );

        }

        const localizedProduct: CartProduct = {

          ...product,

          name: product.name,

          nameEn: product.nameEn,

        };

        return [...prev, { ...localizedProduct, quantity: 1 }];

      });

      if (options?.openDrawer !== false) {

        setOpen(true);

      }

    },

    [],

  );



  const removeItem = useCallback((id: string) => {

    setItems((prev) => prev.filter((line) => line.id !== id));

  }, []);



  const setQuantity = useCallback((id: string, quantity: number) => {

    if (quantity < 1) {

      setItems((prev) => prev.filter((line) => line.id !== id));

      return;

    }

    setItems((prev) =>

      prev.map((line) => (line.id === id ? { ...line, quantity } : line)),

    );

  }, []);



  const clearCart = useCallback(() => setItems([]), []);



  const value = useMemo<CartContextValue>(

    () => ({

      items,

      itemCount: cartItemCount(items),

      isOpen,

      openCart: () => setOpen(true),

      closeCart: () => setOpen(false),

      setOpen,

      addItem,

      removeItem,

      setQuantity,

      clearCart,

    }),

    [items, isOpen, addItem, removeItem, setQuantity, clearCart],

  );



  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;

}



export function useCart(): CartContextValue {

  const ctx = useContext(CartContext);

  if (!ctx) {

    throw new Error("useCart must be used within CartProvider");

  }

  return ctx;

}


