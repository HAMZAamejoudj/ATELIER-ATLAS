"use client";



import { useCallback, useState, type MouseEvent } from "react";

import { Heart } from "lucide-react";

import { useTranslations } from "next-intl";



import { useWishlist } from "@/components/wishlist/wishlist-provider";

import {

  productCardActionButtonClass,

  productCardIconClass,

} from "@/lib/product-card-actions";

import { toWishlistItem } from "@/lib/wishlist";

import { cn } from "@/lib/utils";



type AddToWishlistButtonProps = {

  product: {

    name: string;

    nameEn?: string;

    priceUsd: number;

    image: string;

    alt: string;

    href: string;

  };

  className?: string;

};



export function AddToWishlistButton({

  product,

  className,

}: AddToWishlistButtonProps) {

  const t = useTranslations("wishlist");

  const { toggleItem, isInWishlist } = useWishlist();

  const item = toWishlistItem(product);

  const saved = isInWishlist(item.id);

  const [toggling, setToggling] = useState(false);



  const handleClick = useCallback(

    (event: MouseEvent<HTMLButtonElement>) => {

      event.preventDefault();

      event.stopPropagation();

      setToggling(true);

      window.setTimeout(() => setToggling(false), 380);

      toggleItem(item);

    },

    [item, toggleItem],

  );



  return (

    <button

      type="button"

      onClick={handleClick}

      className={cn(

        productCardActionButtonClass,

        "group/btn absolute top-3 right-3 z-10",

        toggling && "animate-heart-toggle",

        className,

      )}

      aria-label={

        saved

          ? t("removeAria", { product: product.name })

          : t("addToWishlistAria", { product: product.name })

      }

      aria-pressed={saved}

    >

      <Heart

        className={cn(

          productCardIconClass,

          "transition-[fill,transform] duration-300 ease-out",

          saved

            ? "scale-100 fill-atlas-charcoal text-atlas-charcoal"

            : "scale-100 fill-transparent group-hover/btn:fill-atlas-charcoal/20",

        )}

        aria-hidden

      />

    </button>

  );

}


