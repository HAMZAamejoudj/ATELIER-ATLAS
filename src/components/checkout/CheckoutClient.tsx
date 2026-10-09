"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  Banknote,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Clock,
} from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { createCashOnDeliveryOrder } from "@/actions/order.actions";
import { formatLinePrice } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import type { CheckoutFormValues } from "@/types/checkout";

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Oujda",
  "Tétouan",
  "Essaouira",
  "El Jadida",
  "Mohammedia",
  "Kénitra",
  "Nador",
  "Safi",
  "Béni Mellal",
  "Laâyoune",
  "Dakhla",
  "Témara",
  "Salé",
  "Autre / Other City",
];

interface CheckoutClientProps {
  locale: string;
}

export function CheckoutClient({ locale }: CheckoutClientProps) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const isAr = locale.startsWith("ar");

  const [form, setForm] = useState<CheckoutFormValues>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "Casablanca",
    address: "",
    postalCode: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.priceUsd * item.quantity,
    0
  );

  const shippingAmount = 0; // Free white-glove luxury delivery
  const totalAmount = subtotal + shippingAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (items.length === 0) {
      setFormError(
        isAr ? "سلة التسوق فارغة." : "Your shopping bag is empty."
      );
      return;
    }

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim()
    ) {
      setFormError(
        isAr
          ? "يرجى ملء جميع الحقول الإلزامية الخاصة بمعلومات التوصيل."
          : "Please complete all required shipping fields."
      );
      return;
    }

    setSubmitting(true);
    try {
      const checkoutItems = items.map((i) => ({
        id: i.id,
        name: i.name,
        priceUsd: i.priceUsd,
        quantity: i.quantity,
        image: i.image,
      }));

      const res = await createCashOnDeliveryOrder(form, checkoutItems);

      if (res.success && res.reference) {
        clearCart();
        router.push(
          `/checkout/success?ref=${res.reference}&total=${res.totalAmount}&name=${encodeURIComponent(
            `${form.firstName} ${form.lastName}`
          )}`
        );
      } else {
        setFormError(
          res.error ||
            (isAr
              ? "حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى."
              : "Failed to place order. Please try again.")
        );
        setSubmitting(false);
      }
    } catch {
      setFormError(
        isAr
          ? "حدث خطأ غير متوقع. يرجى التحقق من اتصالك."
          : "An unexpected error occurred. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:py-28">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-50 text-atlas-charcoal/40 mb-6">
          <ShoppingBag className="size-10 stroke-[1.25]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-atlas-charcoal">
          {isAr ? "سلة التسوق فارغة" : "Your Shopping Bag is Empty"}
        </h1>
        <p className="mt-3 text-sm text-atlas-charcoal/65 max-w-md mx-auto">
          {isAr
            ? "لم تقم بإضافة أي قطعة إلى سلة التسوق بعد. استكشف مجموعاتنا الحرفية الفريدة والمصنوعة يدويًا في ورشة مراكش."
            : "You haven't added any pieces to your bag yet. Explore our handcrafted collection made to order in our Marrakech atelier."}
        </p>
        <Link
          href="/seating"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-atlas-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-md hover:bg-black transition-all"
        >
          <span>{isAr ? "استكشف المقاعد والأثاث" : "Explore Furniture"}</span>
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Top Breadcrumb & Title */}
      <div className="mb-8 border-b border-atlas-charcoal/10 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-atlas-charcoal/60 hover:text-atlas-charcoal transition-colors mb-3"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          <span>{isAr ? "العودة إلى المتجر" : "Back to Atelier Store"}</span>
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-atlas-charcoal sm:text-4xl">
            {isAr ? "إتمام الطلب — الدفع عند الاستلام" : "Checkout — Cash on Delivery"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-atlas-charcoal/70">
            {isAr
              ? "توصيل فاخر ومضمون لجميع مدن المغرب. الدفع نقداً عند استلام وفحص القطعة."
              : "Free white-glove delivery across Morocco. Inspect and pay in cash upon receiving your piece."}
          </p>
        </div>
      </div>

      {formError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 animate-in fade-in">
          <AlertCircle className="size-5 shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact Info */}
          <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-atlas-charcoal/10">
            <div className="flex items-center gap-3 mb-5 border-b border-atlas-charcoal/5 pb-4">
              <span className="flex size-7 items-center justify-center rounded-full bg-atlas-charcoal text-xs font-bold text-white">
                1
              </span>
              <h2 className="font-serif text-lg font-bold text-atlas-charcoal">
                {isAr ? "معلومات الاتصال بالزبون" : "Customer Contact"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                  {isAr ? "الاسم الشخصي *" : "First Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: يوسف" : "e.g. Youssef"}
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                  {isAr ? "الاسم العائلي *" : "Last Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: العلمي" : "e.g. El Alami"}
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                  {isAr ? "رقم الهاتف المحمول (ضروري للتوصيل) *" : "Phone Number (For Delivery Confirmation) *"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="06 XX XX XX XX / +212 6..."
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all font-mono"
                  />
                </div>
                <p className="mt-1 text-[11px] text-atlas-charcoal/60">
                  {isAr
                    ? "سنتواصل معك عبر الهاتف لتأكيد موعد التسليم."
                    : "Our concierge will call/WhatsApp you to schedule delivery."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                  {isAr ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-atlas-charcoal/10">
            <div className="flex items-center gap-3 mb-5 border-b border-atlas-charcoal/5 pb-4">
              <span className="flex size-7 items-center justify-center rounded-full bg-atlas-charcoal text-xs font-bold text-white">
                2
              </span>
              <h2 className="font-serif text-lg font-bold text-atlas-charcoal">
                {isAr ? "عنوان التوصيل في المغرب" : "Shipping Destination (Morocco)"}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                    {isAr ? "المدينة *" : "City *"}
                  </label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, city: e.target.value }))
                    }
                    className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all cursor-pointer"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                    {isAr ? "الحي أو الرمز البريدي" : "Neighborhood / Postal Code"}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? "مثال: المعاريف، أكدال، 20000" : "e.g. Maarif, Guéliz, Agdal"}
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, postalCode: e.target.value }))
                    }
                    className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                  {isAr ? "العنوان بالكامل (الشارع، رقم العمارة / الفيلا) *" : "Full Street Address (Street, Building / Villa No.) *"}
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder={
                    isAr
                      ? "مثال: شارع أنفا، إقامة الياسمين، عمارة ب، شقة 12"
                      : "e.g. Boulevard d'Anfa, Résidence Yasmina, Immeuble B, Apt 12"
                  }
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-atlas-charcoal/80 mb-1.5">
                  {isAr ? "ملاحظات إضافية للتوصيل (اختياري)" : "Special Delivery Instructions (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? "مثال: يرجى التوصيل بعد الساعة 4 مساءً"
                      : "e.g. Please deliver after 4 PM, floor 3 with elevator"
                  }
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="w-full rounded-xl border border-atlas-charcoal/20 bg-[#faf8f5] px-4 py-3 text-sm text-atlas-charcoal placeholder:text-atlas-charcoal/30 focus:border-atlas-charcoal focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method (Cash on Delivery) */}
          <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-atlas-charcoal/10">
            <div className="flex items-center gap-3 mb-5 border-b border-atlas-charcoal/5 pb-4">
              <span className="flex size-7 items-center justify-center rounded-full bg-atlas-charcoal text-xs font-bold text-white">
                3
              </span>
              <h2 className="font-serif text-lg font-bold text-atlas-charcoal">
                {isAr ? "طريقة الدفع" : "Payment Method"}
              </h2>
            </div>

            {/* Selected COD Card */}
            <div className="relative rounded-2xl border-2 border-amber-600/70 bg-amber-50/40 p-5 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-600 text-white shrink-0 mt-0.5 shadow-sm">
                    <Banknote className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-atlas-charcoal">
                      {isAr ? "الدفع عند الاستلام (Cash on Delivery)" : "Cash on Delivery (Paiement à la livraison)"}
                    </h3>
                    <p className="mt-1 text-xs text-atlas-charcoal/75 leading-relaxed">
                      {isAr
                        ? "الدفع نقداً فقط عند استلام قطعتك والتأكد من جودتها ومطابقتها للمواصفات أمام ممثل التوصيل."
                        : "Pay safely in cash when your handcrafted piece is delivered and inspected at your address."}
                    </p>
                  </div>
                </div>

                <div className="flex size-5 items-center justify-center rounded-full bg-amber-600 text-white shrink-0">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-4 text-xs font-medium text-amber-900/80">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="size-3.5 text-amber-700" />
                  {isAr ? "توصيل مجاني لكافة المدن" : "Free White-Glove Delivery"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-amber-700" />
                  {isAr ? "تنسيق مسبق للموعد" : "Scheduled Appointment"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 Cols Sticky) */}
        <div className="lg:col-span-5 sticky top-6 space-y-6">
          <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-atlas-charcoal/10">
            <h2 className="font-serif text-lg font-bold text-atlas-charcoal border-b border-atlas-charcoal/10 pb-4">
              {isAr ? "ملخص الطلب" : "Order Summary"}
            </h2>

            {/* Cart Items List */}
            <ul className="divide-y divide-atlas-charcoal/5 max-h-72 overflow-y-auto my-4 py-1 pr-1">
              {items.map((item) => (
                <li key={item.id} className="py-3.5 flex items-center gap-3.5 first:pt-0 last:pb-0">
                  <div className="relative size-16 shrink-0">
                    <div className="absolute inset-0 overflow-hidden rounded-lg bg-[#f0ebe3] border border-atlas-charcoal/10">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <span className="absolute -top-2 -right-2 flex size-[22px] items-center justify-center rounded-full bg-atlas-charcoal text-[11px] font-bold text-white shadow-sm z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-serif text-xs sm:text-sm font-semibold text-atlas-charcoal truncate">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-atlas-charcoal/60">
                      {item.quantity} × <span className="font-sans tabular-nums">{formatLinePrice(item.priceUsd, locale as any)}</span>
                    </p>
                  </div>
                  <span className="shrink-0 font-sans text-xs sm:text-sm font-bold text-atlas-charcoal tabular-nums">
                    {formatLinePrice(item.priceUsd * item.quantity, locale as any)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Cost Breakdown */}
            <div className="border-t border-atlas-charcoal/10 pt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-atlas-charcoal/75">
                <span className="font-medium">{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                <span className="font-sans text-sm sm:text-base font-bold text-atlas-charcoal tabular-nums">
                  {formatMoney(subtotal, locale as any)}
                </span>
              </div>

              <div className="flex justify-between items-center text-atlas-charcoal/75">
                <span className="font-medium">{isAr ? "مصاريف الشحن والتوصيل" : "Shipping & Handling"}</span>
                <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                  {isAr ? "مجاناً (Gratuit)" : "Free (Gratuit)"}
                </span>
              </div>

              <div className="border-t border-atlas-charcoal/10 pt-4 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base sm:text-lg font-bold text-atlas-charcoal block">
                    {isAr ? "المجموع الكلي للدفع" : "Total to Pay"}
                  </span>
                  <span className="text-[11px] text-atlas-charcoal/60">
                    {isAr ? "نقداً عند الاستلام" : "Cash upon delivery"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xl sm:text-2xl font-bold text-atlas-charcoal tabular-nums tracking-tight">
                    {formatMoney(totalAmount, locale as any)}
                  </span>
                </div>
              </div>
            </div>

            {/* Big Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-amber-600 px-6 py-4 text-sm font-semibold tracking-wider uppercase text-white shadow-xl hover:bg-amber-500 disabled:opacity-60 transition-all active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>{isAr ? "جارٍ تأكيد الطلب..." : "Confirming Order..."}</span>
                </>
              ) : (
                <>
                  <Banknote className="size-5" />
                  <span>
                    {isAr ? "تأكيد الطلب — الدفع عند الاستلام" : "Confirm Order — Pay on Delivery"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
