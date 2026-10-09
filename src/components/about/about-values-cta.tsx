import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AboutValuesCta() {
  const t = await getTranslations("about.visit");

  return (
    <section
      className="bg-atlas-cream py-14 sm:py-16 lg:py-20"
      aria-labelledby="about-visit-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/55">
            {t("eyebrow")}
          </p>
          <h2
            id="about-visit-heading"
            className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] text-atlas-charcoal sm:text-[2.15rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-4 font-serif text-base leading-[1.65] text-atlas-charcoal/78 sm:text-[17px]">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-atlas-charcoal px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
            >
              {t("contact")}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <Link
              href="/contact#trade"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-atlas-charcoal/25 bg-transparent px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-colors hover:bg-atlas-charcoal/[0.04]"
            >
              {t("trade")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
