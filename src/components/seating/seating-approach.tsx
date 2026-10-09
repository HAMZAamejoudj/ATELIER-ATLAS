import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BRAND_NAME } from "@/lib/constants";

export async function SeatingApproach() {
  const t = await getTranslations("seating.approach");

  return (
    <section aria-labelledby="seating-approach-heading">
      <div className="lg:grid lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-atlas-cream px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20 xl:px-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/65">
            {t("eyebrow")}
          </p>
          <h2
            id="seating-approach-heading"
            className="mt-3 max-w-lg font-serif text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-atlas-charcoal sm:text-[2.15rem] lg:text-[2.35rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md font-serif text-base leading-relaxed text-atlas-charcoal/85">
            {t("body")}
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-atlas-charcoal pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-opacity hover:opacity-60"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="relative min-h-[22rem] sm:min-h-[26rem] lg:min-h-[28rem]">
          <Image
            src="/images/products/product-lenoir-sofa.png"
            alt={t("imageAlt")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-end justify-start p-8 text-right text-white sm:p-10 lg:p-12">
            <blockquote className="max-w-md font-serif text-xl leading-snug italic sm:text-2xl lg:text-[1.65rem]">
              &ldquo;{t("quote")}&rdquo;
            </blockquote>
            <p className="mt-6 font-serif text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
              {BRAND_NAME}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
