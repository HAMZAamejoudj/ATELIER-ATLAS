"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { ProductColorSwatches } from "@/components/catalog/product-color-swatches";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/wishlist/add-to-wishlist-button";
import { useLocalizedProduct } from "@/hooks/use-localized-product";
import {
  catalogCardImageSequence,
  isRemoteCatalogImage,
  type CatalogCardProduct,
} from "@/lib/catalog-products";
import { swatchesToColorVariants } from "@/lib/product-color-variants";

const CARD_HOVER_SLIDE_MS = 1400;

export function CatalogProductCard({ product }: { product: CatalogCardProduct }) {
  const t = useTranslations("common");
  const variants = useMemo(
    () =>
      product.colorVariants?.length
        ? product.colorVariants
        : swatchesToColorVariants(product.swatches, product.image),
    [product.colorVariants, product.swatches, product.image],
  );

  const slideImages = useMemo(
    () => catalogCardImageSequence(product, variants),
    [product, variants],
  );

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [previewVariant, setPreviewVariant] = useState<number | null>(null);
  const [cardHover, setCardHover] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const activeVariant = previewVariant ?? selectedVariant;
  const variantImage = variants[activeVariant]?.image || product.image;
  const canAutoSlide = slideImages.length > 1;
  const slideshowActive =
    cardHover && canAutoSlide && previewVariant === null;

  useEffect(() => {
    if (!slideshowActive) return;
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % slideImages.length);
    }, CARD_HOVER_SLIDE_MS);
    return () => window.clearInterval(id);
  }, [slideshowActive, slideImages.length]);

  useEffect(() => {
    if (!cardHover) setSlideIndex(0);
  }, [cardHover]);

  const displayImage = previewVariant !== null
    ? variantImage
    : slideshowActive
      ? slideImages[slideIndex]
      : variantImage;

  const { displayName, displayPrice, cartProduct } = useLocalizedProduct({
    ...product,
    image: displayImage,
  });

  const badgeLabel =
    product.badge === "BEST SELLER"
      ? t("badges.bestSeller")
      : product.badge === "NEW"
        ? t("badges.new")
        : null;

  return (
    <article
      className="group"
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => {
        setCardHover(false);
        setPreviewVariant(null);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3]">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <AddToCartButton product={cartProduct} />
          {badgeLabel ? (
            <span className="bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal">
              {badgeLabel}
            </span>
          ) : null}
        </div>
        <AddToWishlistButton product={cartProduct} />
        <Link href={product.href} className="block size-full">
          <Image
            key={displayImage}
            src={displayImage}
            alt={product.alt}
            fill
            unoptimized={isRemoteCatalogImage(displayImage)}
            className="object-cover object-center transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.02] animate-in fade-in duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
      </div>
      <div className="mt-3 sm:mt-4">
        <Link
          href={product.href}
          className="block font-serif text-[15px] font-bold leading-snug text-atlas-charcoal transition-opacity hover:opacity-75 sm:text-base"
        >
          {displayName}
        </Link>
        <p className="mt-1 font-sans text-sm font-bold tabular-nums text-atlas-charcoal sm:text-[15px]">
          {displayPrice}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <ProductColorSwatches
            variants={variants}
            selectedIndex={selectedVariant}
            onSelect={setSelectedVariant}
            onPreview={setPreviewVariant}
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-atlas-charcoal/80">
            {product.material}
          </span>
        </div>
      </div>
    </article>
  );
}
