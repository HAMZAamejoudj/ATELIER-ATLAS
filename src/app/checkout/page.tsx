import type { Metadata } from "next";

import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocale } from "@/lib/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale.startsWith("ar");

  return {
    title: isAr
      ? "إتمام الطلب — الدفع عند الاستلام | أتيليه أطلس"
      : "Checkout — Cash on Delivery | ATELIER ATLAS",
    description: isAr
      ? "أتمم طلبك بأمان مع خيار الدفع نقداً عند الاستلام والتوصيل المجاني لكافة مدن المغرب."
      : "Complete your order with Cash on Delivery and free white-glove shipping across Morocco.",
  };
}

export default async function CheckoutPage() {
  const locale = await getLocale();

  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh] bg-[#f9f8f3]">
        <CheckoutClient locale={locale} />
      </main>
    </>
  );
}
