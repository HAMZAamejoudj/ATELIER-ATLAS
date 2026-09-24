import type { FAQPage, WithContext } from "schema-dts";

import { BRAND_NAME } from "@/lib/constants";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return `${BRAND_NAME} — Handmade Moroccan Furniture`;
  return `${pageTitle} | ${BRAND_NAME}`;
}

export type FaqItem = { question: string; answer: string };

export function faqPageJsonLd(faqs: FaqItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
