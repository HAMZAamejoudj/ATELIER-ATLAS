"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  headerActionButtonClass,
  headerActionIconClass,
} from "@/components/layout/header-action-styles";
import { useCart } from "@/components/cart/cart-provider";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { cn } from "@/lib/utils";
import { useLocalizedProduct } from "@/hooks/use-localized-product";

const wishlistPrimaryButtonClass = cn(
  "inline-flex h-11 w-full items-center justify-center gap-2",
  "bg-atlas-charcoal px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white",
  "transition-[background-color,transform,box-shadow] duration-200",
  "hover:bg-atlas-charcoal/92 hover:shadow-[0_4px_14px_rgba(26,22,20,0.15)]",
  "active:scale-[0.98] motion-reduce:transform-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-burgundy/35 focus-visible:ring-offset-2",
);

const wishlistSecondaryButtonClass = cn(
  "inline-flex h-11 w-full items-center justify-center",
  "border border-atlas-charcoal/20 bg-atlas-cream px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal",
  "transition-[background-color,border-color] duration-200",
  "hover:border-atlas-charcoal/35 hover:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-burgundy/35 focus-visible:ring-offset-2",
);

function WishlistProductCard({
  product,
  onRemove,
  onAddToCart,
}: {
  product: {
    id: string;
    name: string;
    nameEn: string;
    priceUsd: number;
    image: string;
    alt: string;
    href: string;
  };
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  const t = useTranslations("wishlist");
  const { displayName, displayPrice } = useLocalizedProduct({
    name: product.nameEn,
    priceUsd: product.priceUsd,
    image: product.image,
    alt: product.alt,
    href: product.href,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-atlas-charcoal/12 bg-white shadow-[0_2px_14px_rgba(26,22,20,0.05)] transition-[box-shadow,border-color] duration-300 hover:border-atlas-charcoal/20 hover:shadow-[0_10px_32px_rgba(26,22,20,0.08)]">
      <div className="relative aspect-square overflow-hidden bg-[#f0ebe3]">
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            headerActionButtonClass,
            "absolute top-3 right-3 z-10 size-9 bg-white/90 hover:bg-white",
          )}
          aria-label={t("removeAria", { product: displayName })}
        >
          <Trash2 className="size-[18px] stroke-[1.5]" aria-hidden />
        </button>
        <Link href={product.href} className="block size-full">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 25vw"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link
          href={product.href}
          className="font-serif text-base font-bold leading-snug text-atlas-charcoal transition-opacity hover:opacity-75 sm:text-[17px]"
        >
          {displayName}
        </Link>
        <p className="mt-1.5 font-sans text-sm font-semibold tabular-nums text-atlas-charcoal">
          {displayPrice}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-5">
          <button type="button" onClick={onAddToCart} className={wishlistPrimaryButtonClass}>
            <ShoppingBag className="size-4 stroke-[1.75]" aria-hidden />
            {t("addToBag")}
          </button>
          <Link href={product.href} className={wishlistSecondaryButtonClass}>
            {t("viewProduct")}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function WishlistPageContent() {
  const t = useTranslations("wishlist");
  const { items, removeItem, itemCount } = useWishlist();
  const { addItem } = useCart();

  return (
    <section className="bg-atlas-cream py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <header className="border-b border-atlas-charcoal/10 pb-8 sm:pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/55">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-atlas-charcoal sm:text-4xl lg:text-[2.75rem]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-atlas-charcoal/65">
            {itemCount === 0
              ? t("descriptionEmpty")
              : t("descriptionCount", { count: itemCount })}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center rounded-sm border border-dashed border-atlas-charcoal/15 bg-white/50 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center border border-atlas-charcoal/15 bg-atlas-cream">
              <Heart
                className="size-6 stroke-[1.5] text-atlas-charcoal/40"
                aria-hidden
              />
            </div>
            <p className="mt-5 font-serif text-xl text-atlas-charcoal">
              {t("emptyTitle")}
            </p>
            <p className="mt-2 max-w-sm text-sm text-atlas-charcoal/60">
              {t("emptyDescription")}
            </p>
            <Link href="/lighting" className={cn(wishlistPrimaryButtonClass, "mt-8 w-auto min-w-[12rem]")}>
              {t("exploreLighting")}
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {items.map((product) => (
              <li key={product.id}>
                <WishlistProductCard
                  product={product}
                  onRemove={() => removeItem(product.id)}
                  onAddToCart={() =>
                    addItem(product, { openDrawer: true })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
