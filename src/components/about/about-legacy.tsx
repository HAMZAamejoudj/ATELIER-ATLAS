import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { ABOUT_MILESTONES } from "@/lib/about-data";

const MILESTONE_KEYS: Record<string, "y1928" | "y1956" | "y1984" | "y2012" | "today"> =
  {
    "1928": "y1928",
    "1956": "y1956",
    "1984": "y1984",
    "2012": "y2012",
    Today: "today",
  };

export async function AboutLegacy() {
  const t = await getTranslations("about.legacy");
  const tMilestones = await getTranslations("home.craftLegacy.milestones");

  return (
    <section
      className="bg-[#3e232e] py-16 text-white sm:py-20 lg:py-24"
      aria-labelledby="about-legacy-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <h2
          id="about-legacy-heading"
          className="font-serif text-2xl font-semibold uppercase tracking-[0.08em] sm:text-3xl"
        >
          {t("title")}
        </h2>
        <p className="mt-4 max-w-lg font-serif text-base leading-relaxed text-white/85">
          {t("description")}
        </p>
        <ul className="mt-10 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {ABOUT_MILESTONES.map((item) => {
            const key = MILESTONE_KEYS[item.year];
            return (
              <li
                key={item.year}
                className="w-[42vw] shrink-0 sm:w-[32vw] lg:w-auto"
              >
                <article className="flex h-full flex-col overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/20">
                    <Image
                      src={item.image}
                      alt={tMilestones(`${key}.alt`)}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 40vw, 18vw"
                    />
                  </div>
                  <div className="bg-atlas-cream px-4 py-5 text-atlas-charcoal">
                    <p className="font-serif text-2xl font-semibold leading-none">
                      {item.year}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase leading-snug tracking-[0.12em]">
                      {tMilestones(`${key}.line1`)}
                      <br />
                      {tMilestones(`${key}.line2`)}
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
