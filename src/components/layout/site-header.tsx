import Link from "next/link";
import { User } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CartHeaderButton } from "@/components/cart/cart-header-button";
import {
  headerActionButtonClass,
  headerActionIconClass,
} from "@/components/layout/header-action-styles";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WishlistHeaderButton } from "@/components/wishlist/wishlist-header-button";
import { LOGO_NAME } from "@/lib/constants";
import { getLocale } from "@/lib/get-locale";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const MAIN_NAV_KEYS = [
  { href: "/seating", key: "furniture" as const },
  { href: "/tables-consoles", key: "tablesConsoles" as const },
  { href: "/lighting", key: "lighting" as const },
  { href: "/decor", key: "decor" as const },
  { href: "/mirrors", key: "mirrors" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/about", key: "ourStory" as const },
  { href: "/contact", key: "contact" as const },
] as const;

export async function SiteHeader({ className }: { className?: string }) {
  const locale = await getLocale();
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const announcement = tNav("announcement", {
    threshold: formatMoney(5000, locale),
  });

  const mainNav = MAIN_NAV_KEYS.map((item) => ({
    href: item.href,
    label: tNav(item.key),
  }));

  return (
    <header className={cn("w-full", className)}>
      <div className="bg-atlas-burgundy text-atlas-cream">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] sm:px-6 lg:px-10">
          <p className="sr-only">{announcement}</p>
          <div
            className="min-w-0 flex-1 overflow-hidden motion-reduce:overflow-visible sm:hidden"
            aria-hidden
          >
            <div className="flex w-max animate-header-marquee motion-reduce:w-full motion-reduce:animate-none">
              <p className="pr-12 whitespace-nowrap motion-reduce:whitespace-normal motion-reduce:pr-0">
                {announcement}
              </p>
              <p className="pr-12 whitespace-nowrap motion-reduce:hidden">
                {announcement}
              </p>
            </div>
          </div>
          <p className="hidden sm:block">{announcement}</p>
          <div className="hidden shrink-0 gap-6 sm:flex">
            <Link href="/contact#trade" className="hover:opacity-80">
              {tCommon("tradeProgram")}
            </Link>
            <Link href="/contact" className="hover:opacity-80">
              {tCommon("findStudio")}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-atlas-cream-dark/80 bg-atlas-cream">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-5 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <MobileNav items={mainNav} />
            <Link
              href="/"
              className="font-serif text-[1.05rem] uppercase tracking-[0.04em] text-atlas-charcoal whitespace-nowrap sm:text-[1.2rem] lg:text-[1.35rem]"
            >
              {LOGO_NAME}
            </Link>
          </div>

          <nav
            className="hidden items-center justify-center gap-6 lg:flex xl:gap-8 2xl:gap-9"
            aria-label="Main"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-bold uppercase tracking-[0.04em] text-atlas-charcoal transition-opacity hover:opacity-60 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-2.5">
            <LanguageSwitcher initialLocale={locale} />
            <Link
              href="/account"
              className={headerActionButtonClass}
              aria-label={tCommon("account")}
            >
              <User className={headerActionIconClass} aria-hidden />
            </Link>
            <WishlistHeaderButton />
            <CartHeaderButton />
          </div>
        </div>
      </div>
    </header>
  );
}
