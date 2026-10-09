"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import {
  headerActionButtonClass,
  headerActionIconClass,
} from "@/components/layout/header-action-styles";
import { LOCALE_COOKIE, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function writeLocaleCookie(locale: Locale) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
}

type LanguageSwitcherProps = {
  initialLocale: Locale;
};

export function LanguageSwitcher({ initialLocale }: LanguageSwitcherProps) {
  const t = useTranslations("common");
  const localeOptions: { value: Locale; label: string }[] = [
    { value: "en", label: t("languages.en") },
    { value: "ar", label: t("languages.ar") },
  ];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectLocale(locale: Locale) {
    setOpen(false);
    if (locale === initialLocale) {
      return;
    }
    writeLocaleCookie(locale);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={pending}
        className={cn(headerActionButtonClass, pending && "opacity-70")}
        aria-label={t("chooseLanguage")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((value) => !value)}
      >
        <Languages className={headerActionIconClass} aria-hidden />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("language")}
          className={cn(
            "absolute top-[calc(100%+6px)] z-50 min-w-[10.5rem] overflow-hidden",
            "border border-atlas-charcoal/15 bg-atlas-cream py-1 shadow-[0_8px_24px_rgba(26,22,20,0.12)]",
            "end-0",
          )}
        >
          {localeOptions.map((option) => {
            const isSelected = option.value === initialLocale;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={pending}
                  onClick={() => selectLocale(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between px-3.5 py-2.5 text-left font-serif text-sm transition-colors",
                    "hover:bg-atlas-charcoal/[0.06]",
                    isSelected && "bg-atlas-charcoal/[0.08] font-medium",
                  )}
                >
                  {option.label}
                  {isSelected ? (
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-atlas-charcoal/50">
                      ✓
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
