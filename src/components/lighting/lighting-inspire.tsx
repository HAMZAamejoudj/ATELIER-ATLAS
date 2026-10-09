import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LIGHTING_INSPIRE } from "@/lib/lighting-data";

export async function LightingInspire() {
  const t = await getTranslations("lighting.inspire");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-[#f9f8f3]"
      aria-labelledby="lighting-inspire-heading"
    >
      <div className="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/65">
            {t("eyebrow")}
          </p>
          <h2
            id="lighting-inspire-heading"
            className="mt-3 max-w-md font-serif text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-atlas-charcoal sm:text-[2.15rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md font-serif text-base leading-relaxed text-atlas-charcoal/85">
            {t("description")}
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-atlas-charcoal pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-opacity hover:opacity-60"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 px-4 pb-14 sm:gap-4 sm:px-6 sm:pb-16 lg:px-10 lg:py-16">
          {LIGHTING_INSPIRE.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ebe3]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 45vw, 22vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
                    aria-hidden
                  />
                  <p className="absolute bottom-3 left-3 right-3 font-serif text-sm font-semibold text-white sm:text-[15px]">
                    {item.label}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
