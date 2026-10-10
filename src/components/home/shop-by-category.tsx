import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getCollections } from "@/actions/collection.actions";
import { getLocale } from "@/lib/get-locale";

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  seating: "/images/categories/category-seating.png",
  "tables-consoles": "/images/products/product-arden-table.png",
  lighting: "/images/categories/category-lighting.png",
  mirrors: "/images/categories/category-rugs.png",
  decor: "/images/categories/category-decor.png",
};

export async function ShopByCategory() {
  const locale = await getLocale();
  const t = await getTranslations("home.categories");
  const dbCollections = await getCollections(locale);

  const categories =
    dbCollections.length > 0
      ? dbCollections.map((c) => ({
          href: `/${c.systemSlug}`,
          label: c.name,
          image:
            c.ogImage ||
            FALLBACK_CATEGORY_IMAGES[c.systemSlug] ||
            "/images/categories/category-seating.png",
          alt: c.name,
        }))
      : [
          {
            href: "/seating",
            label: t("items.sofasSeating"),
            image: "/images/categories/category-seating.png",
            alt: t("alts.seating"),
          },
          {
            href: "/tables-consoles",
            label: t("items.tables"),
            image: "/images/products/product-arden-table.png",
            alt: t("alts.tables"),
          },
          {
            href: "/decor",
            label: t("items.storage"),
            image: "/images/categories/category-storage.png",
            alt: t("alts.storage"),
          },
          {
            href: "/lighting",
            label: t("items.lighting"),
            image: "/images/categories/category-lighting.png",
            alt: t("alts.lighting"),
          },
          {
            href: "/mirrors",
            label: t("items.rugs"),
            image: "/images/categories/category-rugs.png",
            alt: t("alts.rugs"),
          },
          {
            href: "/decor",
            label: t("items.decor"),
            image: "/images/categories/category-decor.png",
            alt: t("alts.decor"),
          },
        ];

  return (
    <section
      className="bg-[#f9f8f3] py-14 sm:py-16 lg:py-20"
      aria-labelledby="shop-by-category-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <h2
          id="shop-by-category-heading"
          className="text-center font-serif text-3xl font-bold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.35rem]"
        >
          {t("title")}
        </h2>

        <ul className="mt-10 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 lg:mt-12 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <li
              key={category.label}
              className="w-[42vw] shrink-0 sm:w-[28vw] lg:w-auto"
            >
              <Link href={category.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] border border-atlas-charcoal/12 bg-[#f3f0ea] transition-colors group-hover:border-atlas-charcoal/25">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 42vw, 16vw"
                  />
                </div>
                <p className="mt-4 text-center font-serif text-[13px] font-bold uppercase tracking-[0.1em] text-atlas-charcoal sm:text-sm">
                  {category.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/seating"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60 sm:text-xs"
          >
            {t("viewAll")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

