import { getTranslations } from "next-intl/server";

export async function HomeSeoIntro() {
  const t = await getTranslations("home.seoIntro");
  const paragraphs = [
    t("p1"),
    t("p2"),
    t("p3"),
    t("p4"),
    t("p5"),
    t("p6"),
  ];

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-[#f9f8f3] px-4 py-14 sm:px-6 lg:px-10 lg:py-16"
      aria-labelledby="home-seo-intro-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="home-seo-intro-heading"
          className="font-serif text-2xl font-bold tracking-tight text-atlas-charcoal sm:text-3xl"
        >
          {t("title")}
        </h2>
        <div className="mt-8 space-y-5 text-left font-serif text-sm leading-relaxed text-atlas-charcoal/85 sm:text-[15px] sm:leading-7">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
