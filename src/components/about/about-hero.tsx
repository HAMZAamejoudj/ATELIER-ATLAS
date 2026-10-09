import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AboutHero() {
  const t = await getTranslations("about.hero");

  return (
    <section
      className="relative min-h-[26rem] overflow-hidden sm:min-h-[30rem] lg:min-h-[34rem]"
      aria-labelledby="about-hero-heading"
    >
      <Image
        src="/images/hero-home.png"
        alt={t("imageAlt")}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/15"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[inherit] max-w-[1600px] flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/75">
            <li>
              <Link href="/" className="hover:text-white">
                {t("breadcrumbHome")}
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3 opacity-50" aria-hidden />
              <span className="font-medium text-white" aria-current="page">
                {t("breadcrumbCurrent")}
              </span>
            </li>
          </ol>
        </nav>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85">
          {t("eyebrow")}
        </p>
        <h1
          id="about-hero-heading"
          className="mt-3 max-w-2xl font-serif text-[2.15rem] font-semibold leading-[1.08] text-white sm:text-[2.75rem] lg:text-[3rem]"
        >
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl font-serif text-base leading-relaxed text-white/90 sm:text-[17px]">
          {t("description")}
        </p>
      </div>
    </section>
  );
}
