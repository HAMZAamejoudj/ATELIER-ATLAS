"use client";



import type { MouseEvent } from "react";

import { ShoppingBag } from "lucide-react";

import { useTranslations } from "next-intl";



import { useCart } from "@/components/cart/cart-provider";

import { toCartProduct, type CartProduct } from "@/lib/cart";

import {

  productCardActionClasses,

  productCardIconClass,

  useProductCardActionPulse,

} from "@/lib/product-card-actions";

import { cn } from "@/lib/utils";



type AddToCartButtonProps = {

  product: {

    name: string;

    nameEn?: string;

    priceUsd: number;

    image: string;

    alt: string;

    href: string;

  };

  variant?: "icon" | "dark";

  className?: string;
  iconClassName?: string;

};



export function AddToCartButton({

  product,

  variant = "icon",

  className,
  iconClassName,

}: AddToCartButtonProps) {

  const t = useTranslations("cart");

  const { addItem } = useCart();

  const { triggerPulse, pulsing } = useProductCardActionPulse();



  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    event.stopPropagation();

    triggerPulse();

    addItem(toCartProduct(product) satisfies CartProduct);

  };



  if (variant === "dark") {

    return (

      <button

        type="button"

        onClick={handleClick}

        className={cn(

          "inline-flex h-11 items-center gap-2 bg-atlas-charcoal px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90",

          className,

        )}

      >

        {t("addToCart")}

      </button>

    );

  }



  return (

    <button

      type="button"

      onClick={handleClick}

      className={cn(

        productCardActionClasses({ pulsing }),

        "group/cart flex max-w-full items-center",

        className,

      )}

      aria-label={t("addToBagAria", { product: product.name })}

    >

      <ShoppingBag

        className={cn(

          iconClassName ?? productCardIconClass,

          "shrink-0 transition-transform duration-200 ease-out group-hover/cart:rotate-[-6deg]",

        )}

        aria-hidden

      />

      <span

        className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover/cart:max-w-[7.5rem] group-hover/cart:opacity-100 group-focus-visible/cart:max-w-[7.5rem] group-focus-visible/cart:opacity-100"

        aria-hidden

      >

        <span className="pl-1 pr-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-atlas-charcoal [text-shadow:0_0_10px_rgba(255,255,255,0.95),0_1px_3px_rgba(255,255,255,0.8)]">

          {t("addToCart")}

        </span>

      </span>

    </button>

  );

}


