import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  PhoneCall,
  Truck,
  Banknote,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { getLocale } from "@/lib/get-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale.startsWith("ar");

  return {
    title: isAr
      ? "تم تأكيد طلبك بنجاح | أتيليه أطلس"
      : "Order Confirmed | ATELIER ATLAS",
  };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; total?: string; name?: string }>;
}) {
  const locale = await getLocale();
  const isAr = locale.startsWith("ar");
  const params = await searchParams;
  const reference = params.ref || "ATL-ORDER";
  const customerName = params.name ? decodeURIComponent(params.name) : "";
  const total = params.total ? Number(params.total).toLocaleString() : "";

  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh] bg-[#f9f8f3] py-12 sm:py-16 lg:py-20">
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Success Icon */}
          <div className="mx-auto flex size-20 sm:size-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200/80 mb-6 shadow-sm">
            <CheckCircle2 className="size-12 sm:size-14" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900 mb-4 border border-amber-200/50">
            <Sparkles className="size-3.5 text-amber-700" />
            <span>{isAr ? "الدفع عند الاستلام" : "Cash on Delivery Order"}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-atlas-charcoal">
            {isAr
              ? `شكراً لطلبك${customerName ? `، ${customerName}` : ""}!`
              : `Thank You for Your Order${customerName ? `, ${customerName}` : ""}!`}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-atlas-charcoal/75 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? "تم تسجيل طلبك بنجاح في ورشة أتيليه أطلس. ستدفع ثمن طلبك نقداً عند استلام وفحص القطعة عند باب منزلك."
              : "Your handcrafted order has been received. You will pay in cash upon receiving and inspecting your piece at your address."}
          </p>

          {/* Reference Card */}
          <div className="mt-8 rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-atlas-charcoal/10 text-left rtl:text-right max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-atlas-charcoal/5 pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-atlas-charcoal/50 block">
                  {isAr ? "رقم المرجع للطلب" : "Order Reference"}
                </span>
                <span className="font-mono text-lg font-bold text-atlas-charcoal tracking-wider">
                  {reference}
                </span>
              </div>
              {total && (
                <div className="sm:text-right rtl:sm:text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-atlas-charcoal/50 block">
                    {isAr ? "المبلغ المستحق نقداً" : "Amount Due on Delivery"}
                  </span>
                  <span className="font-mono text-lg font-bold text-amber-700">
                    ${total} USD
                  </span>
                </div>
              )}
            </div>

            {/* Next Steps Timeline */}
            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <h2 className="font-serif text-sm font-bold text-atlas-charcoal uppercase tracking-wider">
                {isAr ? "الخطوات القادمة" : "What Happens Next"}
              </h2>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-800 shrink-0 mt-0.5">
                  <PhoneCall className="size-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-atlas-charcoal">
                    {isAr ? "1. تأكيد الموعد هاتفياً أو عبر واتساب" : "1. Phone / WhatsApp Confirmation"}
                  </p>
                  <p className="text-atlas-charcoal/65 text-xs mt-0.5">
                    {isAr
                      ? "سيتصل بك ممثل خدمة الزبائن لتأكيد العنوان وتحديد التوقيت الأنسب لك."
                      : "Our team will contact you to verify your address and coordinate delivery timing."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-800 shrink-0 mt-0.5">
                  <Truck className="size-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-atlas-charcoal">
                    {isAr ? "2. التوصيل والمعاينة الفورية" : "2. White-Glove Delivery & Inspection"}
                  </p>
                  <p className="text-atlas-charcoal/65 text-xs mt-0.5">
                    {isAr
                      ? "يتم توصيل القطعة بعناية فائقة ويمكنك فحص جودتها وتشطيبها قبل الدفع."
                      : "Your piece is carefully delivered and you can inspect its finish at your home."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-800 shrink-0 mt-0.5">
                  <Banknote className="size-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-atlas-charcoal">
                    {isAr ? "3. الدفع نقداً" : "3. Cash Payment"}
                  </p>
                  <p className="text-atlas-charcoal/65 text-xs mt-0.5">
                    {isAr
                      ? "تسليم المبلغ نقداً لمسؤول التوصيل واستلام وصل الشراء."
                      : "Hand the cash payment to our delivery courier and receive your receipt."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-atlas-charcoal px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-md hover:bg-black transition-all"
            >
              <ShoppingBag className="size-4" />
              <span>{isAr ? "متابعة التسوق" : "Continue Shopping"}</span>
            </Link>

            <Link
              href="/blog"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-atlas-charcoal/20 bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-atlas-charcoal hover:bg-atlas-charcoal/5 transition-all"
            >
              <span>{isAr ? "قراءة مجلة الورشة" : "Read The Journal"}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
