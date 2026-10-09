import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MIRRORS_MATERIALS } from "@/lib/mirrors-data";

export async function MirrorsMaterialLibrary() {
  const t = await getTranslations("mirrors.materialLibrary");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-atlas-cream py-12 sm:py-14 lg:py-16"
      aria-labelledby="mirrors-materials-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="mirrors-materials-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal"
            >
              {t("heading")}
            </h2>
            <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-atlas-charcoal/85">
              {t("description")}
            </p>
          </div>
          <Link
            href="/about#materials"
            className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9 lg:gap-4">
          {MIRRORS_MATERIALS.map((item) => (
            <li key={item.title}>
              <div className="relative aspect-square overflow-hidden bg-[#f0ebe3]">
                <Image
                  src={item.image}
                  alt={t("finishAlt", { material: item.title })}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 30vw, 10vw"
                />
              </div>
              <p className="mt-2 text-center font-serif text-[10px] font-semibold uppercase tracking-[0.1em] text-atlas-charcoal sm:text-[11px]">
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
