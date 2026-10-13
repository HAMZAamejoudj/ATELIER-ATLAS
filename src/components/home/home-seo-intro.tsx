import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getLocale } from "@/lib/get-locale";

export async function HomeSeoIntro() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const t = await getTranslations("home.seoIntro");

  const p1 = t("p1");
  const p2 = t("p2");
  const p3 = t("p3");
  const p4 = t("p4");
  const p5 = t("p5");

  return (
    <section
      className="relative overflow-hidden bg-[#FAF8F5] px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      aria-labelledby="home-seo-intro-heading"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* Background Subtle Ambience Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-amber-100/35 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Editorial Monogram & Header */}
        <header className="mx-auto max-w-4xl text-center">
          <h2
            id="home-seo-intro-heading"
            className="text-balance font-serif text-3xl font-bold tracking-tight text-atlas-charcoal sm:text-4xl lg:text-[2.35rem]"
          >
            {t("title")}
          </h2>

          <p className="mx-auto mt-2 max-w-2xl font-serif text-base font-medium leading-relaxed text-atlas-charcoal/85 sm:text-lg">
            {isAr
              ? "« كل قطعة تُصمم لمساحات هادئة ومضيئة: طاولات تجمع العائلة، ومرايا توسّع الضوء، ومقاعد للسهرات الهادئة، وقطع ديكور تُكافئ اللمسة اليومية. »"
              : "“Each piece is designed for rooms that feel calm, luminous, and deeply lived-in — dining tables that anchor conversation, mirrors that widen light, seating that invites unhurried evenings.”"}
          </p>
        </header>

        {/* Tier 1: atelier story + image */}
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="relative aspect-[5/4] w-full overflow-hidden bg-stone-200/40 sm:aspect-[4/3]">
            <Image
              src="/images/legacy/legacy-today.png"
              alt={isAr ? "ورشة العمل في مراكش" : "Marrakech stone atelier workshop"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-12">
            <article>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal/45">
                {isAr ? "فلسفة الورشة" : "The Atelier Philosophy"}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-atlas-charcoal sm:text-2xl">
                {isAr
                  ? "أثاث نحتي يدوي الصنع لمساحات هادئة"
                  : "Sculptural Form Shaped for Calm & Light"}
              </h3>
              <p className="mt-4 text-sm leading-[1.75] text-atlas-charcoal/72 sm:text-[15px]">
                {p1}
              </p>
            </article>

            <article>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal/45">
                {isAr ? "الترافرتين والخامات" : "Travertine & Materiality"}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-atlas-charcoal sm:text-2xl">
                {isAr
                  ? "قوة هادئة وملمس يتعتق بجمال عبر السنين"
                  : "Quiet Strength Honed in Traditional Moroccan Ateliers"}
              </h3>
              <p className="mt-4 text-sm leading-[1.75] text-atlas-charcoal/72 sm:text-[15px]">
                {p2}
              </p>
              <p className="mt-6 text-xs leading-relaxed text-atlas-charcoal/55">
                {isAr
                  ? "ترافرتين · بلوط · نحاس مطرق · كتان"
                  : "Travertine · Solid oak · Hammered brass · Washed linen"}
              </p>
            </article>
          </div>
        </div>

        {/* Tier 2: three pillars — minimal editorial */}
        <div className="mt-16">
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            <article>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal/45">
                {isAr ? "المجموعات" : "The Disciplines"}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-atlas-charcoal sm:text-[1.35rem]">
                {isAr ? "مقاعد، طاولات، إضاءة ومرايا" : "Seating, Tables & Objects"}
              </h3>
              <p className="mt-4 text-sm leading-[1.75] text-atlas-charcoal/72">
                {p3}
              </p>
              <p className="mt-6 text-xs leading-relaxed text-atlas-charcoal/55">
                {isAr
                  ? "مقاعد ترافرتين · طاولات طعام · مرايا مقوسة · إضاءة معلقة"
                  : "Travertine seating · Dining tables · Arched mirrors · Pendant lighting"}
              </p>
            </article>

            <article>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal/45">
                {isAr ? "حسب الطلب والتجارة" : "Bespoke & Trade"}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-atlas-charcoal sm:text-[1.35rem]">
                {isAr ? "وضوح الخامات ومقاسات مخصصة" : "Material Clarity & Custom Scale"}
              </h3>
              <p className="mt-4 text-sm leading-[1.75] text-atlas-charcoal/72">
                {p4}
              </p>
              <Link
                href="/contact#trade"
                className="group mt-6 inline-flex items-center gap-1.5 border-b border-atlas-charcoal/25 pb-0.5 text-xs font-medium text-atlas-charcoal transition-colors hover:border-atlas-charcoal"
              >
                <span>
                  {isAr ? "طلبات المهندسين والمقاسات الخاصة" : "Trade & bespoke inquiries"}
                </span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </article>

            <article>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal/45">
                {isAr ? "الحرفة والاستدامة" : "Craft Legacy"}
              </p>
              <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-atlas-charcoal sm:text-[1.35rem]">
                {isAr ? "نجارة متينة وأجور عادلة" : "Repairable Joinery & Fair Craft"}
              </h3>
              <p className="mt-4 text-sm leading-[1.75] text-atlas-charcoal/72">
                {p5}
              </p>
              <p className="mt-6 text-xs text-atlas-charcoal/55">
                {isAr
                  ? "حرفة مغربية متوارثة — سيدي غانم، مراكش"
                  : "Moroccan artisanal heritage · Sidi Ghanem, Marrakech"}
              </p>
            </article>
          </div>
        </div>

      </div>
    </section>
  );
}
