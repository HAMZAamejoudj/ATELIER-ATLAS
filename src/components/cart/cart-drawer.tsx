"use client";



import Image from "next/image";

import Link from "next/link";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";



import { useCart } from "@/components/cart/cart-provider";

import {

  Sheet,

  SheetContent,

  SheetDescription,

  SheetFooter,

  SheetHeader,

  SheetTitle,

} from "@/components/ui/sheet";

import { formatCartSubtotal, formatLinePrice } from "@/lib/cart";

import { isLocale, type Locale } from "@/lib/locale";



export function CartDrawer() {

  const t = useTranslations("cart");

  const rawLocale = useLocale();

  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  const {

    items,

    isOpen,

    setOpen,

    setQuantity,

    removeItem,

    itemCount,

  } = useCart();



  const subtotal = formatCartSubtotal(items, locale);



  return (

    <Sheet open={isOpen} onOpenChange={setOpen}>

      <SheetContent

        side="right"

        className="flex w-full max-w-md flex-col gap-0 border-atlas-charcoal/10 bg-atlas-cream p-0 sm:max-w-md"

      >

        <SheetHeader className="border-b border-atlas-charcoal/10 px-5 py-5 text-left">

          <SheetTitle className="font-serif text-xl font-semibold text-atlas-charcoal">

            {t("title")}

          </SheetTitle>

          <SheetDescription className="text-xs text-atlas-charcoal/60">

            {t("itemCount", { count: itemCount })}

          </SheetDescription>

        </SheetHeader>



        <div className="flex-1 overflow-y-auto px-5 py-4">

          {items.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-16 text-center">

              <ShoppingBag

                className="size-10 stroke-[1.25] text-atlas-charcoal/30"

                aria-hidden

              />

              <p className="mt-4 font-serif text-base text-atlas-charcoal/80">

                {t("emptyTitle")}

              </p>

              <p className="mt-2 max-w-xs text-sm text-atlas-charcoal/55">

                {t("emptyDescription")}

              </p>

              <Link

                href="/seating"

                onClick={() => setOpen(false)}

                className="mt-6 border border-atlas-charcoal/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal hover:bg-atlas-charcoal/5"

              >

                {t("shopFurniture")}

              </Link>

            </div>

          ) : (

            <ul className="space-y-5">

              {items.map((line) => (

                <li

                  key={line.id}

                  className="flex gap-4 border-b border-atlas-charcoal/10 pb-5 last:border-0"

                >

                  <Link

                    href={line.href}

                    onClick={() => setOpen(false)}

                    className="relative size-20 shrink-0 overflow-hidden bg-[#f0ebe3]"

                  >

                    <Image

                      src={line.image}

                      alt={line.alt}

                      fill

                      className="object-cover object-center"

                      sizes="80px"

                    />

                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">

                    <Link

                      href={line.href}

                      onClick={() => setOpen(false)}

                      className="font-serif text-sm font-semibold leading-snug text-atlas-charcoal hover:opacity-80"

                    >

                      {line.name}

                    </Link>

                    <p className="mt-1 text-sm font-semibold tabular-nums text-atlas-charcoal">

                      {formatLinePrice(line.priceUsd, locale)}

                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">

                      <div className="inline-flex items-center border border-atlas-charcoal/20">

                        <button

                          type="button"

                          className="flex size-8 items-center justify-center text-atlas-charcoal hover:bg-atlas-charcoal/5"

                          aria-label={t("decreaseQuantity", { product: line.name })}

                          onClick={() =>

                            setQuantity(line.id, line.quantity - 1)

                          }

                        >

                          <Minus className="size-3.5" />

                        </button>

                        <span className="min-w-[2rem] text-center text-sm tabular-nums">

                          {line.quantity}

                        </span>

                        <button

                          type="button"

                          className="flex size-8 items-center justify-center text-atlas-charcoal hover:bg-atlas-charcoal/5"

                          aria-label={t("increaseQuantity", { product: line.name })}

                          onClick={() =>

                            setQuantity(line.id, line.quantity + 1)

                          }

                        >

                          <Plus className="size-3.5" />

                        </button>

                      </div>

                      <button

                        type="button"

                        className="text-atlas-charcoal/50 transition-colors hover:text-atlas-charcoal"

                        aria-label={t("removeFromBag", { product: line.name })}

                        onClick={() => removeItem(line.id)}

                      >

                        <Trash2 className="size-4" />

                      </button>

                    </div>

                  </div>

                </li>

              ))}

            </ul>

          )}

        </div>



        {items.length > 0 ? (

          <SheetFooter className="border-t border-atlas-charcoal/10 px-5 py-5">

            <div className="flex w-full items-center justify-between">

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal/60">

                {t("subtotal")}

              </span>

              <span className="font-sans text-lg font-semibold tabular-nums text-atlas-charcoal">

                {subtotal}

              </span>

            </div>

            <p className="w-full text-left text-[11px] text-atlas-charcoal/50">

              {t("shippingNote")}

            </p>

            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex h-11 w-full items-center justify-center bg-atlas-charcoal text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-black transition-all shadow-md active:scale-[0.99]"
            >
              {t("proceedToCheckout")}
            </Link>

          </SheetFooter>

        ) : null}

      </SheetContent>

    </Sheet>

  );

}


