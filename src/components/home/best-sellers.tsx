"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/wishlist/add-to-wishlist-button";
import { useLocalizedProduct } from "@/hooks/use-localized-product";

const PRODUCTS = [
  {
    href: "/seating",
    name: "The Lenoir Sofa",
    priceUsd: 4800,
    image: "/images/products/product-lenoir-sofa.png",
    alt: "The Lenoir Sofa in beige upholstery",
  },
  {
    href: "/tables-consoles",
    name: "The Arden Dining Table",
    priceUsd: 3250,
    image: "/images/products/product-arden-table.png",
    alt: "The Arden round dining table",
  },
  {
    href: "/seating",
    name: "The Vale Lounge Chair",
    priceUsd: 2950,
    image: "/images/products/product-vale-chair.png",
    alt: "The Vale leather lounge chair",
  },
  {
    href: "/decor",
    name: "The Marais Sideboard",
    priceUsd: 4200,
    image: "/images/products/product-marais-sideboard.png",
    alt: "The Marais wood sideboard",
  },
  {
    href: "/lighting",
    name: "The Odette Table Lamp",
    priceUsd: 1450,
    image: "/images/products/product-odette-lamp.png",
    alt: "The Odette bronze table lamp",
  },
] as const;

function BestSellerCard({
  product,
}: {
  product: (typeof PRODUCTS)[number];
}) {
  const { displayName, displayPrice, cartProduct } = useLocalizedProduct(product);

  return (
    <article className="group">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0ebe3]">
        <div className="absolute top-3 left-3 z-10">
          <AddToCartButton product={cartProduct} />
        </div>
        <AddToWishlistButton product={cartProduct} />
        <Link href={product.href} className="block size-full">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 72vw, 18vw"
          />
        </Link>
      </div>
      <div className="mt-4">
        <Link
          href={product.href}
          className="block font-serif text-[15px] font-bold leading-snug text-atlas-charcoal transition-opacity hover:opacity-75 sm:text-base"
        >
          {displayName}
        </Link>
        <p className="mt-1.5 font-sans text-[15px] font-bold not-italic tabular-nums tracking-normal text-atlas-charcoal sm:text-base">
          {displayPrice}
        </p>
      </div>
    </article>
  );
}

export function BestSellers() {
  const t = useTranslations("home.bestSellers");

  return (
    <section
      className="bg-[#f9f8f3] py-14 sm:py-16 lg:py-20"
      aria-labelledby="best-sellers-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <h2
            id="best-sellers-heading"
            className="font-serif text-3xl font-bold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.35rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-2 font-serif text-base font-medium text-atlas-charcoal/85 sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <ul
          className="mt-10 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 lg:mt-12 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {PRODUCTS.map((product) => (
            <li
              key={product.name}
              className="w-[72vw] max-w-[16rem] shrink-0 sm:w-[42vw] sm:max-w-[18rem] lg:w-full lg:min-w-0 lg:max-w-none"
            >
              <BestSellerCard product={product} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/seating"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60 sm:text-xs"
          >
            {t("shopAll")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
