import type { Locale } from "@/lib/locale";

export type LocalizedString = {
  en: string;
  ar: string;
};

export function localized(value: LocalizedString, locale: Locale): string {
  return value[locale] ?? value.en;
}

export function locEn(value: string): LocalizedString {
  return { en: value, ar: value };
}
