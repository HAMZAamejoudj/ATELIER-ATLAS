import { formatMoney } from "@/lib/money";

export function formatUsd(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatMadPreview(usd: number): string {
  return formatMoney(usd, "ar");
}
