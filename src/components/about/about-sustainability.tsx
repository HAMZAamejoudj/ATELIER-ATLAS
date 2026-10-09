import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AboutSustainability() {
  const t = await getTranslations("about.sustainability");

  return (
    <section
      id="sustainability"
      className="scroll-mt-24 bg-[#3d473a] text-white"
      aria-labelledby="about-sustainability-heading"
    >
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
        <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem]">
          <Image
            src="/images/trade/trade-program.png"
            alt={t("imageAlt")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
            {t("eyebrow")}
          </p>
          <h2
            id="about-sustainability-heading"
            className="mt-4 font-serif text-[1.75rem] font-semibold leading-[1.12] sm:text-[2rem]"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-white/85">
            {t("description")}
          </p>
          <Link
            href="/blog/a-kinder-tomorrow"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-white/60 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:opacity-80"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
