import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ABOUT_MATERIALS } from "@/lib/about-data";

const MATERIAL_KEYS = ["stone", "wood", "metal"] as const;

export async function AboutMaterials() {
  const t = await getTranslations("about.materials");

  return (
    <section
      id="materials"
      className="scroll-mt-24 bg-atlas-cream py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-materials-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/55">
              {t("eyebrow")}
            </p>
            <h2
              id="about-materials-heading"
              className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-atlas-charcoal sm:text-[2.15rem]"
            >
              {t("title")}
            </h2>
          </div>
          <Link
            href="/seating"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal hover:opacity-60"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3 lg:gap-8">
          {ABOUT_MATERIALS.map((item, index) => {
            const materialKey = MATERIAL_KEYS[index];
            return (
              <li key={item.title}>
                <article className="group overflow-hidden bg-white shadow-[0_12px_40px_rgba(26,22,20,0.06)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ebe3]">
                    <Image
                      src={item.image}
                      alt={t(`items.${materialKey}.alt`)}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif text-lg font-semibold text-atlas-charcoal">
                      {t(`items.${materialKey}.title`)}
                    </h3>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-atlas-charcoal/75">
                      {t(`items.${materialKey}.description`)}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
