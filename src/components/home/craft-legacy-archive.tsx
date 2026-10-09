import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

export async function CraftLegacyArchive() {
  const t = await getTranslations("home.craftLegacy");
  const tMilestones = await getTranslations("home.craftLegacy.milestones");

  return (
    <section
      className="bg-[#3e232e] text-white"
      aria-labelledby="craft-legacy-heading"
    >
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-10 2xl:gap-12">
        <div className="w-full shrink-0 px-6 py-14 sm:px-10 sm:py-16 lg:w-[33%] lg:max-w-[22rem] lg:py-20 lg:pl-10 lg:pr-4 xl:max-w-[26rem] xl:pl-14 xl:pr-6 2xl:max-w-[28rem]">
          <h2 id="craft-legacy-heading" className="font-serif leading-none">
            <span className="block text-xl font-semibold tracking-[0.22em] sm:text-2xl">
              {t("titleThe")}
            </span>
            <span className="mt-3 block text-[2.15rem] font-semibold uppercase leading-[1.08] tracking-[0.08em] sm:text-4xl lg:whitespace-nowrap xl:text-[2.65rem]">
              {t("titleLine1")}
            </span>
            <span className="block text-[2.15rem] font-semibold uppercase leading-[1.08] tracking-[0.08em] sm:text-4xl xl:text-[2.65rem]">
              {t("titleLine2")}
            </span>
          </h2>
          <p className="mt-8 font-serif text-lg leading-relaxed text-white/90 xl:text-xl">
            {t("description")}
          </p>
          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 border border-white/80 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="w-full min-w-0 lg:w-[67%] lg:flex-1 lg:py-16 xl:py-20">
          <ul
            className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3.5 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible lg:px-8 lg:pb-0 xl:gap-3.5 xl:pr-12 2xl:pr-16 [&::-webkit-scrollbar]:hidden"
          >
            {ABOUT_MILESTONES.map((item) => {
              const key = MILESTONE_KEYS[item.year];
              return (
                <li
                  key={item.year}
                  className="w-[38%] min-w-[8.75rem] max-w-[11.5rem] shrink-0 snap-start sm:w-[32%] sm:max-w-[12.5rem] lg:w-full lg:min-w-0 lg:max-w-none"
                >
                  <article className="flex h-full w-full flex-col border border-white/25">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
                      <Image
                        src={item.image}
                        alt={tMilestones(`${key}.alt`)}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 38vw, 13vw"
                      />
                    </div>
                    <div className="flex w-full flex-col justify-center bg-atlas-cream px-3 py-5 text-atlas-charcoal sm:px-4 sm:py-5">
                      <p className="font-serif text-2xl font-semibold leading-none tracking-tight sm:text-[1.65rem] xl:text-3xl">
                        {item.year}
                      </p>
                      <p className="mt-2.5 text-[9px] font-semibold uppercase leading-snug tracking-[0.12em] sm:text-[10px] sm:tracking-[0.14em]">
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
      </div>
    </section>
  );
}
