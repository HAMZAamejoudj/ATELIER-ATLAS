"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { submitContactInquiry } from "@/actions/contact.actions";
import { SITE_CONTACT_EMAIL } from "@/lib/constants";
import type { ContactSettings, InquiryType } from "@/lib/contact-types";

interface ContactClientProps {
  settings: ContactSettings;
  locale: string;
}

export function ContactClient({ settings, locale }: ContactClientProps) {
  const t = useTranslations("contact");
  const isAr = locale.startsWith("ar");

  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const inquiryTypes: { type: InquiryType; label: string; desc: string }[] = [
    {
      type: "general",
      label: t("types.general.label"),
      desc: t("types.general.desc"),
    },
    {
      type: "bespoke",
      label: t("types.bespoke.label"),
      desc: t("types.bespoke.desc"),
    },
    {
      type: "trade",
      label: t("types.trade.label"),
      desc: t("types.trade.desc"),
    },
    {
      type: "appointment",
      label: t("types.appointment.label"),
      desc: t("types.appointment.desc"),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await submitContactInquiry({
        ...formData,
        type: inquiryType,
      });

      if (res.success) {
        setStatus({
          type: "success",
          message: res.message || t("form.successMessage"),
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message: res.error || t("form.errorMessage"),
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: t("form.errorMessage"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const address = isAr && settings.addressAr ? settings.addressAr : settings.addressEn;
  const hours = isAr && settings.hoursAr ? settings.hoursAr : settings.hoursEn;

  return (
    <section className="py-14 sm:py-20 space-y-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Expanded Wide Contact Form Card */}
      <div className="bg-[#faf8f5] p-6 sm:p-10 md:p-14 rounded-3xl border border-atlas-charcoal/15 shadow-sm space-y-10">
        {/* Header inside Form */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-atlas-charcoal/70">
            {t("form.eyebrow")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] font-normal leading-tight text-atlas-charcoal">
            {t("form.heading")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-atlas-charcoal/80">
            {t("form.subheading")}
          </p>
        </div>

        {/* Inquiry Purpose Selector */}
        <div className="space-y-3.5">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-atlas-charcoal">
            {t("form.selectType")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {inquiryTypes.map((item) => {
              const isSelected = inquiryType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setInquiryType(item.type)}
                  className={`flex flex-col justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-atlas-charcoal bg-atlas-charcoal text-white shadow-md scale-[1.01]"
                      : "border-atlas-charcoal/20 bg-white text-atlas-charcoal hover:border-atlas-charcoal/50 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-sm font-bold tracking-wide">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs mt-1.5 leading-snug ${
                      isSelected ? "text-atlas-cream/80" : "text-atlas-charcoal/70"
                    }`}
                  >
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {status && (
          <div
            className={`flex items-start gap-3.5 p-5 rounded-2xl text-sm border animate-in fade-in duration-300 ${
              status.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold text-base">
                {status.type === "success"
                  ? t("form.successTitle")
                  : t("form.errorTitle")}
              </p>
              <p className="text-sm mt-1 leading-relaxed opacity-95">
                {status.message}
              </p>
            </div>
          </div>
        )}

        {/* Main Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-atlas-charcoal mb-2">
                {t("form.nameLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t("form.namePlaceholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-xl border border-atlas-charcoal/30 bg-white px-4.5 py-3.5 text-base text-atlas-charcoal font-medium placeholder:text-atlas-charcoal/45 focus:border-atlas-charcoal focus:ring-2 focus:ring-atlas-charcoal/15 shadow-sm transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-atlas-charcoal mb-2">
                {t("form.emailLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder={t("form.emailPlaceholder")}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-xl border border-atlas-charcoal/30 bg-white px-4.5 py-3.5 text-base text-atlas-charcoal font-medium placeholder:text-atlas-charcoal/45 focus:border-atlas-charcoal focus:ring-2 focus:ring-atlas-charcoal/15 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-atlas-charcoal mb-2">
                {t("form.phoneLabel")}
              </label>
              <input
                type="tel"
                placeholder="+212 6 00 00 00 00"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full rounded-xl border border-atlas-charcoal/30 bg-white px-4.5 py-3.5 text-base text-atlas-charcoal font-medium placeholder:text-atlas-charcoal/45 focus:border-atlas-charcoal focus:ring-2 focus:ring-atlas-charcoal/15 shadow-sm transition-all"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-atlas-charcoal mb-2">
                {t("form.subjectLabel")}
              </label>
              <input
                type="text"
                placeholder={t("form.subjectPlaceholder")}
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full rounded-xl border border-atlas-charcoal/30 bg-white px-4.5 py-3.5 text-base text-atlas-charcoal font-medium placeholder:text-atlas-charcoal/45 focus:border-atlas-charcoal focus:ring-2 focus:ring-atlas-charcoal/15 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-atlas-charcoal mb-2">
              {t("form.messageLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              placeholder={t("form.messagePlaceholder")}
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="w-full rounded-xl border border-atlas-charcoal/30 bg-white px-4.5 py-4 text-base text-atlas-charcoal font-medium placeholder:text-atlas-charcoal/45 focus:border-atlas-charcoal focus:ring-2 focus:ring-atlas-charcoal/15 shadow-sm transition-all leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-atlas-charcoal px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-black disabled:opacity-50 active:scale-[0.99]"
          >
            <Send className="size-4.5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            <span>{submitting ? t("form.sending") : t("form.submit")}</span>
          </button>
        </form>
      </div>
      </div>

      <div className="border-t border-atlas-charcoal/8 bg-[#f9f8f3]/60 py-16 sm:py-20">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-14">
          <h3 className="text-center font-serif text-[1.65rem] font-normal text-atlas-charcoal sm:text-[1.85rem]">
            {t("studio.title")}
          </h3>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-7">
            {(
              [
                {
                  label: t("studio.addressLabel"),
                  body: (
                    <>
                      <p className="max-w-[22rem] text-[15px] leading-[1.7] text-atlas-charcoal/82 sm:text-base">
                        {address}
                      </p>
                      {settings.googleMapsUrl && (
                        <a
                          href={settings.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-atlas-charcoal/90 underline-offset-4 hover:underline"
                        >
                          <span>{t("studio.viewOnMap")}</span>
                          <ExternalLink className="size-3.5 shrink-0 opacity-60" />
                        </a>
                      )}
                    </>
                  ),
                },
                {
                  label: t("studio.phoneLabel"),
                  body: (
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, "")}`}
                      className="text-[15px] font-medium tracking-wide text-atlas-charcoal underline-offset-4 hover:underline sm:text-base"
                    >
                      {settings.phone}
                    </a>
                  ),
                },
                {
                  label: t("studio.emailLabel"),
                  body: (
                    <>
                      <a
                        href={`mailto:${settings.conciergeEmail || SITE_CONTACT_EMAIL}`}
                        className="block text-[15px] font-medium leading-snug text-atlas-charcoal underline-offset-4 hover:underline sm:text-[1.05rem] [overflow-wrap:anywhere]"
                      >
                        {settings.conciergeEmail || SITE_CONTACT_EMAIL}
                      </a>
                      {settings.tradeEmail &&
                        settings.tradeEmail !== settings.conciergeEmail && (
                          <a
                            href={`mailto:${settings.tradeEmail}`}
                            className="mt-2 block text-sm text-atlas-charcoal/65 [overflow-wrap:anywhere] hover:underline"
                          >
                            Trade: {settings.tradeEmail}
                          </a>
                        )}
                    </>
                  ),
                },
                {
                  label: t("studio.hoursLabel"),
                  body: (
                    <p className="max-w-[16rem] text-[15px] leading-[1.7] text-atlas-charcoal/82 sm:text-base">
                      {hours}
                    </p>
                  ),
                },
              ] as const
            ).map((item) => (
              <article
                key={item.label}
                className="flex min-h-[9.5rem] min-w-0 flex-col rounded-lg border border-atlas-charcoal/10 bg-white/70 px-6 py-7 sm:px-7 sm:py-8"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-atlas-charcoal/40">
                  {item.label}
                </p>
                <div className="mt-4 flex flex-1 flex-col justify-start">{item.body}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
