import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { MIRRORS_TYPES } from "@/lib/mirrors-data";
import type { SubcategoryItem } from "@/lib/sections-helpers";

export async function MirrorsTypes({ items }: { items?: SubcategoryItem[] }) {
  const t = await getTranslations("mirrors.types");
  const locale = await getLocale();
  const isAr = locale.startsWith("ar");

  const list =
    items && items.length > 0
      ? items.map((sub) => ({
          label: isAr && sub.labelAr ? sub.labelAr : sub.labelEn,
          href: sub.href || "/mirrors",
          image: sub.image || "/images/mirrors/categories/all.png",
          alt: isAr && sub.altAr ? sub.altAr : sub.altEn || sub.labelEn,
        }))
      : MIRRORS_TYPES;

  return (
    <section
      className="border-b border-atlas-charcoal/10 bg-[#f9f8f3]"
      aria-labelledby="mirrors-types-heading"
    >
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-4 px-4 pt-8 sm:px-6 sm:pt-10 lg:px-10">
        <h2
          id="mirrors-types-heading"
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-atlas-charcoal"
        >
          {t("heading")}
        </h2>
        <Link
          href="/mirrors"
          className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60"
        >
          {t("exploreAll")}
          <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
      <ul className="mx-auto flex max-w-[1600px] gap-3 overflow-x-auto px-4 py-6 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 sm:pb-10 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-10 [&::-webkit-scrollbar]:hidden">
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
              <p className="mt-3 text-center font-serif text-[13px] font-bold uppercase tracking-[0.1em] text-atlas-charcoal sm:mt-3.5 sm:text-sm">
                {item.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
