import { getTranslations } from "next-intl/server";

export async function ContactHero() {
  const t = await getTranslations("contact");

  return (
    <section className="relative overflow-hidden bg-[#201d1a] text-atlas-cream py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-b border-[#322d28]">
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center space-y-5">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-white tracking-tight">
          {t("hero.title")}
        </h1>

        <p className="mx-auto max-w-2xl font-serif text-base sm:text-lg leading-relaxed text-atlas-cream/75">
          {t("hero.description")}
        </p>
      </div>
    </section>
  );
}
