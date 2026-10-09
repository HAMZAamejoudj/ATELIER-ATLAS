import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { SubcategoryItem } from "@/lib/sections-helpers";
import { getLocale } from "@/lib/get-locale";
import { LIGHTING_SUBCATEGORIES } from "@/lib/lighting-data";

interface Props {
  items?: SubcategoryItem[];
}

export async function LightingSubcategories({ items }: Props) {
  const locale = await getLocale();
  const t = await getTranslations("lighting.subcategories");

  const list =
    items && items.length > 0
      ? items.map((i) => ({
          href: i.href,
          label: locale === "ar" ? i.labelAr : i.labelEn,
          tagline: locale === "ar" ? i.taglineAr : i.taglineEn,
          image: i.image,
          alt: locale === "ar" ? i.altAr || i.labelAr : i.altEn || i.labelEn,
        }))
      : LIGHTING_SUBCATEGORIES.map((item) => ({
          href: item.href,
          label: item.label,
          tagline: item.tagline,
          image: item.image,
          alt: item.alt,
        }));

  return (
    <section
      className="border-b border-atlas-charcoal/10 bg-[#f9f8f3]"
      aria-labelledby="lighting-subcategories-heading"
    >
      <h2 id="lighting-subcategories-heading" className="sr-only">
        {t("heading")}
      </h2>
      <ul className="mx-auto flex max-w-[1600px] gap-3 overflow-x-auto px-4 py-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 sm:py-10 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-10 [&::-webkit-scrollbar]:hidden">
        {list.map((item) => (
          <li key={item.label} className="w-[38vw] shrink-0 sm:w-[24vw] lg:w-auto">
            <Link href={item.href} className="group block">
              <div className="relative aspect-square overflow-hidden bg-[#f0ebe3]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 38vw, 14vw"
                />
              </div>
              <p className="mt-3 text-center font-serif text-xs font-semibold uppercase tracking-[0.12em] text-atlas-charcoal sm:mt-3.5 sm:text-[13px]">
                {item.label}
              </p>
              {item.tagline && (
                <p className="mt-1 text-center text-[9px] font-medium uppercase tracking-[0.14em] text-atlas-charcoal/55">
                  {item.tagline}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

