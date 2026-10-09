import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getSectionsConfig } from "@/actions/sections.actions";
import { getLocale } from "@/lib/get-locale";

export async function HomeHero() {
  const locale = await getLocale();
  const t = await getTranslations("home.hero");
  const config = await getSectionsConfig();
  const hero = config.homeHero;

  const title =
    locale === "ar"
      ? hero.titleAr || t("title")
      : hero.titleEn || t("title");

  const ctaText =
    locale === "ar"
      ? hero.ctaTextAr || t("cta")
      : hero.ctaTextEn || t("cta");

  const alt =
    locale === "ar"
      ? hero.imageAltAr || t("imageAlt")
      : hero.imageAltEn || t("imageAlt");

  const imageSrc = hero.image || "/images/hero-home.png";
  const ctaLink = hero.ctaLink || "/seating";

  return (
    <section className="relative min-h-[calc(100vh-8.5rem)] w-full overflow-hidden lg:min-h-[calc(100vh-9.5rem)]">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10"
        aria-hidden
      />

      <div className="relative mx-auto flex h-full min-h-[inherit] max-w-[1600px] flex-col justify-center px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="max-w-3xl text-white">
          <h1 className="max-w-[14ch] font-serif text-[2.65rem] leading-[1.04] tracking-tight sm:text-6xl sm:max-w-none md:text-7xl lg:text-[5.35rem] lg:leading-[1.02] xl:text-[5.85rem]">
            {title}
          </h1>
          <Link
            href={ctaLink}
            className="mt-8 inline-flex items-center gap-2 bg-atlas-burgundy px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-atlas-burgundy-light"
          >
            {ctaText}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

