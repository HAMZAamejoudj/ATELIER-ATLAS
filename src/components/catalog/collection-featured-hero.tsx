"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useLocalizedProduct } from "@/hooks/use-localized-product";
import { localized } from "@/lib/i18n-content";
import type {
  FeaturedProduct,
  FeaturedProductCopy,
} from "@/lib/featured-product";
import { translateProductName } from "@/lib/product-names-ar";
import { cn } from "@/lib/utils";

const THUMB_BUTTON =
  "h-[4.75rem] w-[6.25rem] sm:h-[5.5rem] sm:w-[7.25rem] lg:h-[6.25rem] lg:w-[8.25rem] xl:h-[6.75rem] xl:w-[9rem]";
const THUMB_GAP = "gap-5 sm:gap-6 lg:gap-7";
const AUTOPLAY_MS = 6000;

const EMPTY_FEATURED: FeaturedProduct = {
  name: "",
  priceUsd: 0,
  description: "",
  image: "/images/decor/product-sienna-mirror.png",
  heroImage: "/images/decor/product-sienna-mirror.png",
  alt: "",
};

export type FeaturedHeroNamespace =
  | "seating"
  | "tablesConsoles"
  | "lighting"
  | "decor"
  | "mirrors";

type CollectionFeaturedHeroProps = {
  products: readonly FeaturedProduct[];
  copy: FeaturedProductCopy;
  href: string;
  headingId: string;
  namespace: FeaturedHeroNamespace;
  heroImageClassName?: string;
};

export function CollectionFeaturedHero({
  products,
  copy,
  href,
  headingId,
  namespace,
  heroImageClassName = "object-cover object-center",
}: CollectionFeaturedHeroProps) {
  const t = useTranslations(namespace);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const safeProducts = products ?? [];
  const hasProducts = safeProducts.length > 0;
  const lastIndex = hasProducts ? safeProducts.length - 1 : 0;
  const featured =
    (hasProducts
      ? (safeProducts[activeIndex] ?? safeProducts[0])
      : null) ?? EMPTY_FEATURED;
  const featuredCopy = copy[featured.name];

  const productInput = useMemo(
    () => ({
      name: featured.name,
      priceUsd: featured.priceUsd,
      image: featured.image,
      alt: featured.alt,
      href,
    }),
    [featured, href],
  );

  const { displayName, displayPrice, cartProduct, locale } =
    useLocalizedProduct(productInput);

  const description = featuredCopy
    ? localized(featuredCopy.description, locale)
    : featured.description;
  const heroAlt = featuredCopy
    ? localized(featuredCopy.alt, locale)
    : featured.alt;

  useEffect(() => {
    if (!hasProducts || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i === lastIndex ? 0 : i + 1));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasProducts, isPaused, lastIndex]);

  function goPrev() {
    setActiveIndex((i) => (i === 0 ? lastIndex : i - 1));
  }

  function goNext() {
    setActiveIndex((i) => (i === lastIndex ? 0 : i + 1));
  }

  if (!hasProducts) {
    return null;
  }

  return (
    <section
      aria-labelledby={headingId}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[32rem] w-full overflow-hidden bg-[#e6d9c8] sm:min-h-[38rem] lg:min-h-[44rem] xl:min-h-[48rem]">
        <Image
          key={featured.heroImage}
          src={featured.heroImage}
          alt={heroAlt}
          fill
          priority
          className={featured.heroClassName ?? heroImageClassName}
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 via-50% to-transparent to-80%"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid min-h-[inherit] w-full max-w-[1600px] grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-x-1 px-2 sm:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] sm:gap-x-2 sm:px-4 lg:grid-cols-[4rem_minmax(0,1fr)_4rem] lg:px-8 xl:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] xl:px-10">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={goPrev}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-atlas-charcoal/15 bg-white/90 text-atlas-charcoal shadow-sm transition-colors hover:bg-white sm:size-10"
              aria-label={t("featured.prevProduct")}
            >
              <ChevronLeft className="size-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="flex min-w-0 flex-col justify-end py-10 sm:py-12 lg:justify-center lg:py-16 xl:py-[4.5rem]">
            <div className="w-full max-w-[26rem] text-white lg:max-w-[30rem] xl:max-w-[34rem]">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">
                {t("featured.label")}
              </p>
              <h1
                id={headingId}
                className="mt-3 font-serif text-[2.05rem] font-semibold leading-[1.05] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem] xl:text-[3rem]"
              >
                {displayName}
              </h1>
              <p className="mt-4 max-w-[22rem] font-sans text-[15px] leading-relaxed text-white/92 sm:text-base">
                {description}
              </p>
              <p className="mt-5 font-sans text-xl font-semibold tabular-nums sm:text-[1.35rem]">
                {displayPrice}
              </p>
              <AddToCartButton
                variant="dark"
                className="mt-6 gap-2 rounded-none"
                product={cartProduct}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={goNext}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-atlas-charcoal/15 bg-white/90 text-atlas-charcoal shadow-sm transition-colors hover:bg-white sm:size-10"
              aria-label={t("featured.nextProduct")}
            >
              <ChevronRight className="size-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-atlas-cream">
        <div className="mx-auto flex max-w-[1600px] justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="flex max-w-full flex-col items-center">
            <ul
              className={cn(
                "flex justify-center overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                THUMB_GAP,
              )}
              aria-label={t("featured.thumbnails")}
            >
              {safeProducts.map((item, index) => (
                <li key={item.name} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative block overflow-hidden bg-[#f0ebe3] transition-all",
                      THUMB_BUTTON,
                      index === activeIndex
                        ? "border border-atlas-charcoal"
                        : "border border-transparent opacity-80 hover:opacity-100",
                    )}
                    aria-label={t("featured.showProduct", {
                      product: translateProductName(item.name, locale),
                    })}
                    aria-current={index === activeIndex ? "true" : undefined}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100px, 144px"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div
              className="mt-4 flex items-center justify-center gap-2 sm:mt-5"
              role="tablist"
              aria-label={t("featured.slideIndicators")}
            >
              {safeProducts.map((item, index) => (
                <button
                  key={`${item.name}-dot`}
                  type="button"
                  role="tab"
                  onClick={() => setActiveIndex(index)}
                  aria-label={t("featured.showProduct", {
                    product: translateProductName(item.name, locale),
                  })}
                  aria-selected={index === activeIndex}
                  className={cn(
                    "rounded-full transition-all duration-300 ease-out",
                    index === activeIndex
                      ? "size-2 bg-atlas-charcoal"
                      : "size-1.5 bg-atlas-charcoal/25 hover:bg-atlas-charcoal/45",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
