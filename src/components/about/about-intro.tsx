import { getTranslations } from "next-intl/server";

export async function AboutIntro() {
  const t = await getTranslations("about.intro");

  return (
    <section className="bg-atlas-cream">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:pt-24 lg:pb-14">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/55">
            {t("eyebrow")}
          </p>
          <p className="mt-4 font-serif text-lg leading-[1.65] text-atlas-charcoal sm:text-xl">
            {t("lead")}
          </p>
          <p className="mt-6 font-serif text-base leading-relaxed text-atlas-charcoal/82">
            {t("body")}
          </p>
        </div>
        <blockquote className="flex flex-col justify-center lg:max-w-md lg:justify-self-end">
          <p className="font-serif text-[1.35rem] italic leading-[1.55] text-atlas-charcoal sm:text-[1.45rem]">
            &ldquo;{t("quote")}&rdquo;
          </p>
          <footer className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal/65">
            {t("quoteAttribution")}
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
