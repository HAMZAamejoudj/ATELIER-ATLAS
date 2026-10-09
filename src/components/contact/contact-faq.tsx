import { getTranslations } from "next-intl/server";

export async function ContactFaq() {
  const t = await getTranslations("contact.faq");

  const faqs = [
    {
      q: t("q1.question"),
      a: t("q1.answer"),
    },
    {
      q: t("q2.question"),
      a: t("q2.answer"),
    },
    {
      q: t("q3.question"),
      a: t("q3.answer"),
    },
    {
      q: t("q4.question"),
      a: t("q4.answer"),
    },
  ];

  return (
    <section className="bg-[#faf8f5] py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-t border-atlas-charcoal/10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-atlas-charcoal/60">
            {t("eyebrow")}
          </span>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-atlas-charcoal">
            {t("heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 border border-atlas-charcoal/10 shadow-sm"
            >
              <h3 className="font-serif text-base font-semibold text-atlas-charcoal mb-2">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-[13px] leading-relaxed text-atlas-charcoal/75">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
