import { getTranslations } from "next-intl/server";
import { MessageSquare, Layers, Hammer, Truck } from "lucide-react";
import { getLocale } from "@/lib/get-locale";

import { ABOUT_PROCESS } from "@/lib/about-data";

const STEP_KEYS = ["s01", "s02", "s03", "s04"] as const;

const STEP_ICONS = [
  MessageSquare,
  Layers,
  Hammer,
  Truck,
];

export async function AboutProcess() {
  const t = await getTranslations("about.process");
  const locale = await getLocale();
  const isAr = locale === "ar";

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#fbf9f5] via-[#f5f0e8] to-[#fbf9f5] py-16 sm:py-20 lg:py-28"
      aria-labelledby="about-process-heading"
    >
      {/* Subtle background decorative ornament */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#d6cbbe_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2
            id="about-process-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-atlas-charcoal"
          >
            {t("title")}
          </h2>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-atlas-charcoal/20" />
            <span className="text-[10px] uppercase tracking-[0.28em] text-atlas-charcoal/50 font-medium">
              {isAr ? "من الحرفة إلى الكمال" : "Moroccan Master Craft"}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-atlas-charcoal/20" />
          </div>
        </div>

        {/* Process Steps Grid */}
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {ABOUT_PROCESS.map((item, index) => {
            const stepKey = STEP_KEYS[index];
            const Icon = STEP_ICONS[index] || MessageSquare;

            return (
              <li key={item.step} className="group relative flex">
                <article className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-atlas-charcoal/10 bg-white/90 p-7 sm:p-8 shadow-[0_4px_20px_rgba(26,22,20,0.03)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-700/30 hover:shadow-[0_20px_45px_rgba(26,22,20,0.08)]">
                  {/* Top glowing accent bar on hover */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600/20 via-amber-700 to-amber-600/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div>
                    {/* Top row: Icon */}
                    <div className="mb-6 flex items-center">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 transition-all duration-300 group-hover:bg-atlas-charcoal group-hover:text-amber-100 group-hover:border-atlas-charcoal group-hover:scale-105 shadow-sm">
                        <Icon className="size-5.5" />
                      </div>
                    </div>

                    {/* Step Stage Badge */}
                    <p className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-amber-900/70">
                      {isAr ? `المرحلة ${item.step}` : `Phase ${item.step}`}
                    </p>

                    {/* Step Title */}
                    <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold leading-snug text-atlas-charcoal transition-colors duration-300 group-hover:text-amber-950">
                      {t(`steps.${stepKey}.title`)}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-3 font-serif text-sm sm:text-[15px] leading-relaxed text-atlas-charcoal/75">
                      {t(`steps.${stepKey}.description`)}
                    </p>
                  </div>

                  {/* Bottom Accent line */}
                  <div className="mt-6 pt-4 border-t border-atlas-charcoal/5 flex items-center justify-between text-xs text-atlas-charcoal/50">
                    <span className="font-medium">
                      {index === 0 && (isAr ? "استشارة وتصميم" : "Design Consultation")}
                      {index === 1 && (isAr ? "اختيار الخامات" : "Material Selection")}
                      {index === 2 && (isAr ? "صناعة يدوية بالمغرب" : "Marrakech Atelier")}
                      {index === 3 && (isAr ? "توصيل فاخر للمنزل" : "White-Glove Service")}
                    </span>
                    <span className="size-1.5 rounded-full bg-amber-600/40 group-hover:bg-amber-600 transition-colors" />
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
