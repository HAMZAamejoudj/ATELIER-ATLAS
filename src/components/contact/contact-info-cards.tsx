import { Compass, Sparkles, Building2, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function ContactInfoCards() {
  const t = await getTranslations("contact.pillars");

  const pillars = [
    {
      icon: Compass,
      title: t("bespoke.title"),
      desc: t("bespoke.desc"),
      actionLabel: t("bespoke.action"),
      href: "/contact#form",
    },
    {
      icon: Building2,
      title: t("trade.title"),
      desc: t("trade.desc"),
      actionLabel: t("trade.action"),
      href: "/contact#form",
    },
    {
      icon: Calendar,
      title: t("appointment.title"),
      desc: t("appointment.desc"),
      actionLabel: t("appointment.action"),
      href: "/contact#form",
    },
  ];

  return (
    <section className="border-t border-atlas-charcoal/10 bg-[#f4eee6] py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-atlas-charcoal/60">
            {t("eyebrow")}
          </span>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-atlas-charcoal">
            {t("heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white p-8 border border-atlas-charcoal/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="size-12 rounded-xl bg-amber-100/60 flex items-center justify-center text-amber-900 mb-5 border border-amber-200/40">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-serif text-xl text-atlas-charcoal font-medium mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-atlas-charcoal/70">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-atlas-charcoal/10">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-atlas-charcoal hover:text-amber-900 transition-colors"
                  >
                    <span>{item.actionLabel}</span>
                    <span aria-hidden className="rtl:rotate-180">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
