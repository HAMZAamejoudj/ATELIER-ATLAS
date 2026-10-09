import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DECOR_VALUES } from "@/lib/decor-data";
import { cn } from "@/lib/utils";

export async function DecorBalanceBanner() {
  const t = await getTranslations("decor.balanceBanner");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-[#3d2f28] text-white"
      aria-labelledby="decor-balance-heading"
    >
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.75fr)]">
        <div className="relative min-h-[16rem] sm:min-h-[18rem] lg:min-h-[22rem]">
          <Image
            src="/images/decor/banner-objects-balance.png"
            alt={t("imageAlt")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>

        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
          <h2
            id="decor-balance-heading"
            className="font-serif text-[1.75rem] font-semibold leading-[1.12] sm:text-[2rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md font-serif text-sm leading-relaxed text-white/85 sm:text-[15px]">
            {t("description")}
          </p>
          <Link
            href="#decor-products"
            className={cn(
              "mt-7 inline-flex w-fit items-center gap-2 border border-white/80 px-5 py-2.5",
              "text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-white/10",
            )}
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="flex flex-col justify-center gap-4 border-t border-white/10 px-4 py-10 sm:px-8 lg:border-t-0 lg:border-l lg:py-12 lg:pl-10 lg:pr-10">
          {DECOR_VALUES.map((value) => (
            <li
              key={value}
              className="font-serif text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90"
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
