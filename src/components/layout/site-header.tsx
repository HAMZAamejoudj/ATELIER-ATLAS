import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/seating", label: "Furniture" },
  { href: "/lighting", label: "Lighting" },
  { href: "/decor", label: "Decor" },
  { href: "/mirrors", label: "Rugs" },
  { href: "/blog", label: "Inspiration" },
  { href: "/about", label: "Our Story" },
] as const;

const ANNOUNCEMENT =
  "Complimentary white glove delivery on orders over $5,000 | A more considered home";

const iconLinkClass =
  "text-atlas-charcoal transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-burgundy/40";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header className={cn("w-full", className)}>
      <div className="bg-atlas-burgundy text-atlas-cream">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] sm:px-6 lg:px-10">
          <p className="sr-only">{ANNOUNCEMENT}</p>
          <div
            className="min-w-0 flex-1 overflow-hidden motion-reduce:overflow-visible sm:hidden"
            aria-hidden
          >
            <div className="flex w-max animate-header-marquee motion-reduce:w-full motion-reduce:animate-none">
              <p className="pr-12 whitespace-nowrap motion-reduce:whitespace-normal motion-reduce:pr-0">
                {ANNOUNCEMENT}
              </p>
              <p className="pr-12 whitespace-nowrap motion-reduce:hidden">
                {ANNOUNCEMENT}
              </p>
            </div>
          </div>
          <p className="hidden sm:block">{ANNOUNCEMENT}</p>
          <div className="hidden shrink-0 gap-6 sm:flex">
            <Link href="/contact#trade" className="hover:opacity-80">
              Trade program
            </Link>
            <Link href="/contact" className="hover:opacity-80">
              Find a studio
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-atlas-cream-dark/80 bg-atlas-cream">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <MobileNav items={MAIN_NAV} />
            <Link
              href="/"
              className="font-serif text-xl tracking-[0.12em] text-atlas-charcoal uppercase whitespace-nowrap sm:text-2xl lg:text-[1.65rem]"
            >
              {BRAND_NAME}
            </Link>
          </div>

          <nav
            className="hidden items-center justify-center gap-6 lg:flex xl:gap-8"
            aria-label="Main"
          >
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-atlas-charcoal transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 sm:gap-5">
            <button type="button" className={iconLinkClass} aria-label="Search">
              <Search className="size-[18px] stroke-[1.25]" />
            </button>
            <Link href="/account" className={iconLinkClass} aria-label="Account">
              <User className="size-[18px] stroke-[1.25]" />
            </Link>
            <button type="button" className={iconLinkClass} aria-label="Wishlist">
              <Heart className="size-[18px] stroke-[1.25]" />
            </button>
            <button type="button" className={iconLinkClass} aria-label="Cart">
              <ShoppingBag className="size-[18px] stroke-[1.25]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
