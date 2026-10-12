"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { SiteLogo } from "@/components/layout/site-logo";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const iconLinkClass =
  "text-atlas-charcoal transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-burgundy/40";

type NavItem = { href: string; label: string };

export function MobileNav({
  items,
  className,
}: {
  items: readonly NavItem[];
  className?: string;
}) {
  const t = useTranslations("common");

  return (
    <Sheet>
      <SheetTrigger
        className={cn(iconLinkClass, "lg:hidden", className)}
        aria-label={t("openMenu")}
      >
        <Menu className="size-[18px] stroke-[1.25]" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[min(100%,22rem)] border-atlas-cream-dark bg-atlas-cream p-0 text-atlas-charcoal"
      >
        <SheetHeader className="border-b border-atlas-cream-dark px-6 py-6">
          <SheetTitle className="text-left">
            <SiteLogo variant="mobile" />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-6 py-6">
          {items.map((item) => (
            <SheetClose
              key={item.href}
              render={
                <Link
                  href={item.href}
                  className="border-b border-atlas-cream-dark/80 py-3.5 text-[14px] font-bold uppercase tracking-[0.04em] text-atlas-charcoal transition-opacity last:border-b-0 hover:opacity-60"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-atlas-cream-dark px-6 py-6 text-[11px] font-medium uppercase tracking-[0.16em]">
          <SheetClose
            render={
              <Link href="/contact#trade" className="hover:opacity-60" />
            }
          >
            Trade program
          </SheetClose>
          <SheetClose
            render={<Link href="/contact" className="hover:opacity-60" />}
          >
            Find a studio
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
