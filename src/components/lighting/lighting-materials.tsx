import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function LightingMaterials() {
  const t = await getTranslations("lighting.materials");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-atlas-cream"
      aria-labelledby="lighting-materials-heading"
    >
      <div className="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20 xl:px-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/65">
            {t("eyebrow")}
          </p>
          <h2
            id="lighting-materials-heading"
            className="mt-3 max-w-md font-serif text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-atlas-charcoal sm:text-[2.15rem] lg:text-[2.35rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md font-serif text-base leading-relaxed text-atlas-charcoal/85">
            {t("description")}
          </p>
          <Link
            href="/about#materials"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-atlas-charcoal pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-opacity hover:opacity-60"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="relative min-h-[18rem] sm:min-h-[20rem]">
            <Image
              src="/images/lighting/materials-indoor.png"
              alt={t("indoor.imageAlt")}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 50vw, 30vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
                {t("indoor.label")}
              </p>
              <p className="mt-2 max-w-xs font-serif text-sm leading-relaxed text-white/95 sm:text-[15px]">
                {t("indoor.description")}
              </p>
              <Link
                href="/lighting#indoor-pendants"
                className="mt-4 inline-flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-75"
              >
                {t("indoor.cta")}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[18rem] sm:min-h-[20rem]">
            <Image
              src="/images/lighting/materials-outdoor.png"
              alt={t("outdoor.imageAlt")}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 50vw, 30vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
                {t("outdoor.label")}
              </p>
              <p className="mt-2 max-w-xs font-serif text-sm leading-relaxed text-white/95 sm:text-[15px]">
                {t("outdoor.description")}
              </p>
              <Link
                href="/lighting#outdoor-lanterns"
                className="mt-4 inline-flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-75"
              >
                {t("outdoor.cta")}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
