"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import type { PopupConfig } from "@/lib/popup-types";

interface PromotionalPopupProps {
  config: PopupConfig;
  locale: string;
}

export function PromotionalPopup({ config, locale }: PromotionalPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = locale.startsWith("ar");

  useEffect(() => {
    if (!config.enabled) return;

    // Check frequency storage
    const storageKey = "atelier_atlas_popup_seen";
    const now = Date.now();

    if (config.frequency === "session") {
      const seenThisSession = sessionStorage.getItem(storageKey);
      if (seenThisSession) return;
    } else if (config.frequency === "weekly") {
      const lastSeen = localStorage.getItem(storageKey);
      if (lastSeen) {
        const diffDays = (now - parseInt(lastSeen, 10)) / (1000 * 60 * 60 * 24);
        if (diffDays < 7) return;
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, (config.delaySeconds || 4) * 1000);

    return () => clearTimeout(timer);
  }, [config.enabled, config.delaySeconds, config.frequency]);

  const handleClose = () => {
    setIsOpen(false);
    const storageKey = "atelier_atlas_popup_seen";
    if (config.frequency === "session") {
      sessionStorage.setItem(storageKey, "true");
    } else {
      localStorage.setItem(storageKey, Date.now().toString());
    }
  };

  if (!isOpen || !config.enabled) return null;

  const badge = isAr && config.badgeAr ? config.badgeAr : config.badgeEn;
  const title = isAr && config.titleAr ? config.titleAr : config.titleEn;
  const description =
    isAr && config.descriptionAr ? config.descriptionAr : config.descriptionEn;
  const buttonText =
    isAr && config.buttonTextAr ? config.buttonTextAr : config.buttonTextEn;
  const dismissText =
    isAr && config.dismissTextAr ? config.dismissTextAr : config.dismissTextEn;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Box */}
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-[#faf8f5] shadow-2xl border border-atlas-charcoal/10 transition-all animate-in zoom-in-95 fade-in duration-300 sm:grid sm:grid-cols-12"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 flex size-8 items-center justify-center rounded-full bg-white/80 text-atlas-charcoal shadow-sm transition-all hover:bg-white hover:scale-105 active:scale-95 ltr:right-3.5 rtl:left-3.5 rtl:right-auto"
          aria-label="Close popup"
        >
          <X className="size-4" />
        </button>

        {/* Left/Top Image */}
        <div className="relative aspect-[16/9] w-full bg-[#eee7dd] sm:aspect-auto sm:h-full sm:col-span-5">
          <Image
            src={config.image || "/images/hero-home.png"}
            alt="Moroccan Travertine handcrafted furniture"
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-between p-6 sm:p-7 md:p-8 sm:col-span-7">
          <div>
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center rounded-full bg-amber-100/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-900 mb-3.5 border border-amber-200/50">
                <span>{badge}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-serif text-xl sm:text-2xl font-semibold leading-snug text-atlas-charcoal">
              {title}
            </h3>

            {/* Description */}
            <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-atlas-charcoal/75">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-2">
            <Link
              href={config.buttonLink || "/seating"}
              onClick={handleClose}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-atlas-charcoal px-5 py-3 text-xs sm:text-[13px] font-semibold tracking-[0.06em] text-white shadow-md transition-all hover:bg-black active:scale-[0.98]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>

            {dismissText && (
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 block w-full text-center text-[11px] text-atlas-charcoal/60 hover:text-atlas-charcoal hover:underline transition-colors"
              >
                {dismissText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
