import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { SubcategoryItem } from "@/lib/sections-helpers";
import { getLocale } from "@/lib/get-locale";
import { SEATING_SUBCATEGORIES } from "@/lib/seating-data";

function subcategoryLabelKey(href: string): "sofas" | "loveseats" | "armchairs" | "ottomans" | "diningChairs" {
  if (href.includes("dining-chairs")) return "diningChairs";
  if (href.includes("loveseats")) return "loveseats";
  if (href.includes("armchairs")) return "armchairs";
  if (href.includes("ottomans")) return "ottomans";
  return "sofas";
}

interface Props {
  items?: SubcategoryItem[];
}

export async function SeatingSubcategories({ items }: Props) {
  const locale = await getLocale();
  const t = await getTranslations("seating.subcategories");

  const list =
    items && items.length > 0
      ? items.map((i) => ({
          href: i.href,
          label: locale === "ar" ? i.labelAr : i.labelEn,
          image: i.image,
          alt: locale === "ar" ? i.altAr || i.labelAr : i.altEn || i.labelEn,
        }))
      : SEATING_SUBCATEGORIES.map((item) => ({
          href: item.href,
          label: t(subcategoryLabelKey(item.href)),
          image: item.image,
          alt: item.alt,
        }));

  return (
    <section
      className="bg-[#f9f8f3]"
      aria-labelledby="seating-subcategories-heading"
    >
      <h2 id="seating-subcategories-heading" className="sr-only">
        {t("heading")}
      </h2>
      <ul className="mx-auto flex max-w-[1600px] gap-3 overflow-x-auto px-4 py-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 sm:py-10 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-10 [&::-webkit-scrollbar]:hidden">
        {list.map((item) => (
          <li key={item.href} className="w-[38vw] shrink-0 sm:w-[28vw] lg:w-auto">
            <Link href={item.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 38vw, 18vw"
                />
              </div>
              <p className="mt-3 text-center font-serif text-xs font-semibold uppercase tracking-[0.14em] text-atlas-charcoal sm:mt-4 sm:text-sm">
                {item.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

