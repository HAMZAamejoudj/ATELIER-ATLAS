"use client";



import { ShoppingBag } from "lucide-react";

import { useTranslations } from "next-intl";



import {

  headerActionBadgeClass,

  headerActionButtonClass,

  headerActionIconClass,

} from "@/components/layout/header-action-styles";

import { useCart } from "@/components/cart/cart-provider";

import { cn } from "@/lib/utils";



export function CartHeaderButton({ className }: { className?: string }) {

  const t = useTranslations("cart");

  const { openCart, itemCount } = useCart();



  return (

    <button

      type="button"

      className={cn(headerActionButtonClass, className)}

      aria-label={

        itemCount > 0

          ? t("cartWithItems", { count: itemCount })

          : t("cartLabel")

      }

      onClick={openCart}

    >

      <ShoppingBag className={headerActionIconClass} aria-hidden />

      {itemCount > 0 ? (

        <span className={headerActionBadgeClass(itemCount)}>

          {itemCount > 9 ? "9+" : itemCount}

        </span>

      ) : null}

    </button>

  );

}


