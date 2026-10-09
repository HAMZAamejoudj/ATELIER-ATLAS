import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MIRRORS_SPACE_LINKS } from "@/lib/mirrors-data";

export async function MirrorsReflectiveSpaces() {
  const t = await getTranslations("mirrors.reflectiveSpaces");

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-[#2c3d32] text-white"
      aria-labelledby="mirrors-spaces-heading"
    >
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)_minmax(0,0.75fr)]">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">
            {t("eyebrow")}
          </p>
          <h2
            id="mirrors-spaces-heading"
            className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] sm:text-[2.15rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-5 max-w-md font-serif text-base leading-relaxed text-white/80">
            {t("description")}
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-white/70 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-75"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="relative min-h-[20rem] lg:min-h-[24rem]">
          <Image
            src="/images/mirrors/inspire-foyer-mirror.png"
            alt={t("foyerImageAlt")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 35vw"
          />
        </div>

        <nav
          aria-label={t("roomsNav")}
          className="flex flex-col justify-center gap-4 border-t border-white/10 px-4 py-10 sm:px-8 lg:border-t-0 lg:border-l lg:py-16 lg:pl-10 lg:pr-10"
        >
          <ul className="space-y-4">
            {MIRRORS_SPACE_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
