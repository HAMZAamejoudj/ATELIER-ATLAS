"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Layers, Shield, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProductColorSwatches } from "@/components/catalog/product-color-swatches";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/wishlist/add-to-wishlist-button";
import { useLocalizedProduct } from "@/hooks/use-localized-product";
import { isRemoteCatalogImage } from "@/lib/catalog-products";
import { formatMoney } from "@/lib/money";
import { translateProductName } from "@/lib/product-names-ar";
import { swatchesToColorVariants } from "@/lib/product-color-variants";
import type { StorefrontProductDetail } from "@/lib/storefront-product-registry";
import { cn } from "@/lib/utils";

type ProductDetailViewProps = {
  product: StorefrontProductDetail;
  related: StorefrontProductDetail[];
  locale: "en" | "ar";
};

export function ProductDetailView({
  product,
  related,
  locale,
}: ProductDetailViewProps) {
  const t = useTranslations("productDetail");
  const tCommon = useTranslations("common");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [previewVariant, setPreviewVariant] = useState<number | null>(null);
  /** When "gallery", thumbnail clicks control the hero; swatches switch to "variant". */
  const [heroSource, setHeroSource] = useState<"gallery" | "variant">("gallery");

  const variants = useMemo(
    () =>
      product.colorVariants?.length
        ? product.colorVariants
        : swatchesToColorVariants(product.swatches, product.image),
    [product.colorVariants, product.swatches, product.image],
  );

  const galleryImages = useMemo(() => {
    const list = [product.image, ...product.gallery].filter(
      (url, index, arr) => url && arr.indexOf(url) === index,
    );
    return list.length ? list : [product.image];
  }, [product.gallery, product.image]);

  const activeColorIndex = previewVariant ?? selectedVariant;
  const variantHeroImage = variants[activeColorIndex]?.image;
  const galleryHeroImage = galleryImages[activeImage] ?? product.image;
  const heroImage =
    previewVariant !== null && variantHeroImage
      ? variantHeroImage
      : heroSource === "variant" && variantHeroImage
        ? variantHeroImage
        : galleryHeroImage;

  const hasOptions = Boolean(
    product.productOptions?.priceRows &&
      product.productOptions.priceRows.length > 0,
  );
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  const selectedRow = hasOptions
    ? product.productOptions!.priceRows[selectedRowIndex] ||
      product.productOptions!.priceRows[0]
    : null;

  const activePriceUsd = selectedRow
    ? selectedRow.salePriceUsd ?? selectedRow.priceUsd
    : product.priceUsd;

  const activeCompareAtUsd = selectedRow
    ? selectedRow.salePriceUsd != null &&
      selectedRow.salePriceUsd < selectedRow.priceUsd
      ? selectedRow.priceUsd
      : null
    : product.compareAtUsd;

  const cardProduct = {
    name: selectedRow ? `${product.name} (${selectedRow.option})` : product.name,
    priceUsd: activePriceUsd,
    image: heroImage,
    alt: product.alt,
    href: product.href,
  };
  const { displayName, displayPrice, cartProduct } =
    useLocalizedProduct(cardProduct);

  const badgeLabel =
    product.badge === "BEST_SELLER"
      ? tCommon("badges.bestSeller")
      : product.badge === "NEW"
        ? tCommon("badges.new")
        : null;

  const collectionHref = `/${product.collectionSlug}`;

  return (
    <div className="bg-[#f9f8f3]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <nav
          className="flex flex-wrap items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-atlas-charcoal/70"
          aria-label={t("breadcrumbAria")}
        >
          <Link href="/" className="transition-opacity hover:opacity-60">
            {t("home")}
          </Link>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden />
          <Link
            href={collectionHref}
            className="transition-opacity hover:opacity-60"
          >
            {product.collectionLabel}
          </Link>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden />
          <span className="text-atlas-charcoal">{displayName}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pb-20">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3]">
            <Image
              src={heroImage}
              alt={product.alt}
              fill
              priority
              unoptimized={isRemoteCatalogImage(heroImage)}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {badgeLabel ? (
              <span className="absolute top-4 left-4 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-atlas-charcoal">
                {badgeLabel}
              </span>
            ) : null}
          </div>
          {galleryImages.length > 1 ? (
            <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((src, index) => (
                <li key={`${src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewVariant(null);
                      setActiveImage(index);
                      setHeroSource("gallery");
                      const variantIndex = variants.findIndex(
                        (v) => v.image === src,
                      );
                      if (variantIndex >= 0) setSelectedVariant(variantIndex);
                    }}
                    className={cn(
                      "relative h-20 w-16 shrink-0 overflow-hidden border bg-[#f0ebe3] sm:h-24 sm:w-20",
                      heroSource === "gallery" && activeImage === index
                        ? "border-atlas-charcoal"
                        : heroSource === "variant" && heroImage === src
                          ? "border-atlas-charcoal"
                          : "border-transparent opacity-80 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized={isRemoteCatalogImage(src)}
                      className="object-cover object-center"
                      sizes="80px"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="lg:pt-4">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-atlas-charcoal/65">
            {product.collectionLabel}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
            {displayName}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <p className="font-sans text-xl font-bold tabular-nums text-atlas-charcoal sm:text-2xl">
              {displayPrice}
            </p>
            {activeCompareAtUsd != null && activeCompareAtUsd > activePriceUsd && (
              <span className="font-sans text-sm line-through text-atlas-charcoal/50">
                {formatMoney(activeCompareAtUsd, locale)}
              </span>
            )}
          </div>
          <p className="mt-5 max-w-xl font-serif text-base leading-relaxed text-atlas-charcoal/85 sm:text-[17px] sm:leading-7">
            {product.shortDescription}
          </p>

          {/* Product Options & Bundles Dropdown */}
          {hasOptions && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="product-option-selector"
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-atlas-charcoal/80"
                >
                  {product.productOptions?.groups?.[0]?.name ||
                    (locale === "ar" ? "الخيارات والقياسات" : "Options & Bundles")}
                </label>
                {selectedRow?.sku && (
                  <span className="font-sans text-xs font-semibold text-atlas-charcoal/60">
                    {selectedRow.sku}
                  </span>
                )}
              </div>
              <select
                id="product-option-selector"
                value={selectedRowIndex}
                onChange={(e) => setSelectedRowIndex(Number(e.target.value))}
                className="h-11 w-full rounded-none border border-atlas-charcoal/20 bg-white px-3 font-sans text-xs font-semibold uppercase tracking-wider text-atlas-charcoal shadow-sm transition-colors focus:border-atlas-charcoal focus:outline-none"
              >
                {product.productOptions!.priceRows.map((row, idx) => (
                  <option key={row.id || idx} value={idx}>
                    {row.option} — {formatMoney(row.salePriceUsd ?? row.priceUsd, locale)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ProductColorSwatches
              variants={variants}
              selectedIndex={selectedVariant}
              onSelect={(index) => {
                setSelectedVariant(index);
                setPreviewVariant(null);
                setHeroSource("variant");
              }}
              onPreview={setPreviewVariant}
              maxVisible={8}
              size="md"
            />
            {variants[activeColorIndex]?.name ? (
              <span className="text-xs font-semibold text-atlas-charcoal/75">
                {variants[activeColorIndex].name}
              </span>
            ) : null}
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-atlas-charcoal/80">
              {product.material}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AddToCartButton
              product={cartProduct}
              variant="dark"
              className="!h-12 bg-atlas-burgundy text-[11px] font-bold tracking-[0.18em] hover:bg-atlas-burgundy-light hover:opacity-100"
            />
            <AddToWishlistButton
              product={cartProduct}
              className="!static !size-12 !rounded-none border border-atlas-charcoal/20 bg-white"
            />
          </div>

          <p className="mt-4 font-sans text-xs text-atlas-charcoal/60">
            {t("sku")}: {selectedRow?.sku || product.sku}
          </p>

          <ul className="mt-10 space-y-4 border-t border-atlas-charcoal/10 pt-8">
            <li className="flex gap-3 text-sm text-atlas-charcoal/85">
              <Truck className="mt-0.5 size-4 shrink-0 text-atlas-charcoal/70" />
              {t("trust.delivery")}
            </li>
            <li className="flex gap-3 text-sm text-atlas-charcoal/85">
              <Shield className="mt-0.5 size-4 shrink-0 text-atlas-charcoal/70" />
              {t("trust.guarantee")}
            </li>
            <li className="flex gap-3 text-sm text-atlas-charcoal/85">
              <Layers className="mt-0.5 size-4 shrink-0 text-atlas-charcoal/70" />
              {t("trust.materials")}
            </li>
          </ul>

          <div className="mt-10 border-t border-atlas-charcoal/10 pt-8">
            <h2 className="font-serif text-xl font-bold text-atlas-charcoal">
              {t("aboutTitle")}
            </h2>
            <p className="mt-4 font-serif text-sm leading-relaxed text-atlas-charcoal/85 sm:text-[15px] sm:leading-7">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-atlas-charcoal/10 bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-[1600px]">
            <h2 className="text-center font-serif text-2xl font-bold text-atlas-charcoal sm:text-3xl">
              {t("relatedTitle")}
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
              {related.map((item) => {
                const name = translateProductName(item.name, locale);
                return (
                  <li key={item.slug}>
                    <Link href={item.href} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3]">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          unoptimized={isRemoteCatalogImage(item.image)}
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <p className="mt-3 font-serif text-sm font-bold text-atlas-charcoal sm:text-[15px]">
                        {name}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
