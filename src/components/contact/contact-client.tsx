"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
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
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
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

      {/* Atelier Details Grid Below Form */}
      <div className="pt-4">
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl font-normal text-atlas-charcoal">
            {t("studio.title")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Address */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-atlas-charcoal/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="size-10 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-900 mb-3.5">
                <MapPin className="size-5" />
              </div>
              <p className="font-bold text-xs uppercase tracking-wider text-atlas-charcoal">
                {t("studio.addressLabel")}
              </p>
              <p className="text-xs sm:text-sm text-atlas-charcoal/80 leading-relaxed mt-1">
                {address}
              </p>
            </div>
            {settings.googleMapsUrl && (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline pt-2"
              >
                <span>{t("studio.viewOnMap")}</span>
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>

          {/* Phone */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-atlas-charcoal/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="size-10 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-900 mb-3.5">
                <Phone className="size-5" />
              </div>
              <p className="font-bold text-xs uppercase tracking-wider text-atlas-charcoal">
                {t("studio.phoneLabel")}
              </p>
              <a
                href={`tel:${settings.phone}`}
                className="text-xs sm:text-sm font-semibold text-atlas-charcoal hover:underline block mt-1"
              >
                {settings.phone}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-atlas-charcoal/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="size-10 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-900 mb-3.5">
                <Mail className="size-5" />
              </div>
              <p className="font-bold text-xs uppercase tracking-wider text-atlas-charcoal">
                {t("studio.emailLabel")}
              </p>
              <a
                href={`mailto:${settings.conciergeEmail || SITE_CONTACT_EMAIL}`}
                className="text-xs sm:text-sm font-semibold text-atlas-charcoal hover:text-amber-800 hover:underline block mt-1.5 break-all"
              >
                {settings.conciergeEmail || SITE_CONTACT_EMAIL}
              </a>
              {settings.tradeEmail && settings.tradeEmail !== settings.conciergeEmail && (
                <a
                  href={`mailto:${settings.tradeEmail}`}
                  className="text-xs text-atlas-charcoal/70 hover:underline block mt-1 break-all"
                >
                  Trade: {settings.tradeEmail}
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          <div className="bg-[#faf8f5] p-6 rounded-2xl border border-atlas-charcoal/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="size-10 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-900 mb-3.5">
                <Clock className="size-5" />
              </div>
              <p className="font-bold text-xs uppercase tracking-wider text-atlas-charcoal">
                {t("studio.hoursLabel")}
              </p>
              <p className="text-xs sm:text-sm text-atlas-charcoal/80 leading-relaxed mt-1">
                {hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
