"use client";



import Link from "next/link";

import { Heart } from "lucide-react";

import { useTranslations } from "next-intl";



import {

  headerActionBadgeClass,

  headerActionButtonClass,

  headerActionIconClass,

} from "@/components/layout/header-action-styles";

import { useWishlist } from "@/components/wishlist/wishlist-provider";

import { cn } from "@/lib/utils";



export function WishlistHeaderButton({ className }: { className?: string }) {

  const t = useTranslations("wishlist");

  const { itemCount } = useWishlist();



  return (

    <Link

      href="/wishlist"

      className={cn(headerActionButtonClass, className)}

      aria-label={

        itemCount > 0

          ? t("wishlistWithItems", { count: itemCount })

          : t("wishlistLabel")

      }

    >

      <Heart className={headerActionIconClass} aria-hidden />

      {itemCount > 0 ? (

        <span className={headerActionBadgeClass(itemCount)}>

          {itemCount > 9 ? "9+" : itemCount}

        </span>

      ) : null}

    </Link>

  );

}


