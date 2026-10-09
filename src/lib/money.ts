import type { Locale } from "@/lib/locale";

const DEFAULT_USD_TO_MAD_RATE = 10;

export function getUsdToMadRate(): number {
  const raw = process.env.USD_TO_MAD_RATE;
  if (!raw) return DEFAULT_USD_TO_MAD_RATE;
  const rate = Number.parseFloat(raw);
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_USD_TO_MAD_RATE;
}

export function localeToCurrency(locale: Locale): "USD" | "MAD" {
  return locale === "ar" ? "MAD" : "USD";
}

export function localeToNumberFormatLocale(locale: Locale): string {
  return locale === "ar" ? "ar-MA" : "en-US";
}

export function usdToMad(usd: number, rate = getUsdToMadRate()): number {
  return Math.round(usd * rate);
}

export function formatMoney(usd: number, locale: Locale): string {
  const currency = localeToCurrency(locale);
  const amount = currency === "MAD" ? usdToMad(usd) : usd;
  return new Intl.NumberFormat(localeToNumberFormatLocale(locale), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
