import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    href: "/seating",
    label: "Sofas & Seating",
    image: "/images/categories/category-seating.png",
    alt: "Sculptural sofa and seating in neutral tones",
  },
  {
    href: "/tables-consoles",
    label: "Tables",
    image: "/images/categories/category-tables.png",
    alt: "Round artisan wood table",
  },
  {
    href: "/decor",
    label: "Storage",
    image: "/images/categories/category-storage.png",
    alt: "Carved wood storage cabinet",
  },
  {
    href: "/lighting",
    label: "Lighting",
    image: "/images/categories/category-lighting.png",
    alt: "Hammered metal dome pendant light",
  },
  {
    href: "/mirrors",
    label: "Rugs",
    image: "/images/categories/category-rugs.png",
    alt: "Handwoven natural fiber rug",
  },
  {
    href: "/decor",
    label: "Decor",
    image: "/images/categories/category-decor.png",
    alt: "Ceramic vases and decor objects",
  },
] as const;

export function ShopByCategory() {
  return (
    <section
      className="bg-[#f9f8f3] py-14 sm:py-16 lg:py-20"
      aria-labelledby="shop-by-category-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-6">
          <h2
            id="shop-by-category-heading"
            className="font-serif text-3xl font-semibold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.35rem]"
          >
            Shop by Category
          </h2>
          <Link
            href="/seating"
            className="inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60 sm:text-xs"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 lg:mt-12 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => (
            <li
              key={category.label}
              className="w-[42vw] shrink-0 sm:w-[28vw] lg:w-auto"
            >
              <Link href={category.href} className="group block">
                <div
                  className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] border border-atlas-charcoal/12 bg-[#f3f0ea] transition-colors group-hover:border-atlas-charcoal/25"
                >
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 42vw, 16vw"
                  />
                </div>
                <p className="mt-4 text-center font-serif text-xs font-semibold uppercase tracking-[0.12em] text-atlas-charcoal sm:text-sm">
                  {category.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
