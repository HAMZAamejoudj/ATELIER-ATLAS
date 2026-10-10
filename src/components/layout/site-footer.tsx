import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BRAND_NAME, LOGO_NAME } from "@/lib/constants";
import { Input } from "@/components/ui/input";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-serif text-sm font-semibold uppercase tracking-[0.14em] text-white/95">
        {title}
      </h3>
      <ul className="mt-5 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="font-serif text-sm text-white/65 transition-colors hover:text-white/90"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.042-3.441.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const t = await getTranslations("footer");

  const shopLinks = [
    { href: "/seating", label: t("links.seating") },
    { href: "/tables-consoles", label: t("links.tables") },
    { href: "/lighting", label: t("links.lighting") },
    { href: "/decor", label: t("links.decor") },
    { href: "/mirrors", label: t("links.mirrors") },
  ];

  const companyLinks = [
    { href: "/about", label: t("links.ourStory") },
    { href: "/blog", label: t("links.blog") },
    { href: "/contact", label: t("links.contact") },
  ];

  const helpLinks = [
    { href: "/contact", label: t("links.bespoke") },
    { href: "/wishlist", label: t("links.wishlist") },
  ];

  return (
    <footer className="bg-[#141210] text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20">
        <div
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,minmax(0,0.75fr))_1.4fr] lg:gap-10 xl:gap-14"
        >
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-xl font-medium uppercase tracking-[0.04em] text-white sm:text-[1.35rem]"
            >
              {LOGO_NAME}
            </Link>
            <div className="mt-4 h-px w-full max-w-[12rem] bg-white/25" />
            <p className="mt-4 font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
              {t("tagline")}
            </p>
            <p className="mt-4 max-w-sm font-serif text-sm leading-relaxed text-white/55">
              {t("description")}
            </p>
          </div>

          <FooterLinkColumn title={t("columns.shop")} links={shopLinks} />
          <FooterLinkColumn title={t("columns.company")} links={companyLinks} />
          <FooterLinkColumn title={t("columns.help")} links={helpLinks} />

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-lg font-medium text-white">
              {t("newsletter.title")}
            </h3>
            <p className="mt-2 font-serif text-sm italic text-white/60">
              {t("newsletter.description")}
            </p>
            <form className="mt-5 flex max-w-md" action="#" method="post">
              <Input
                type="email"
                name="email"
                placeholder={t("newsletter.placeholder")}
                autoComplete="email"
                className="h-11 flex-1 rounded-none border-white/20 bg-white/10 text-sm text-white placeholder:text-white/45 focus-visible:border-white/40 focus-visible:ring-white/20"
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-l-0 border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label={t("newsletter.subscribeAria")}
              >
                <ArrowRight className="size-4" />
              </button>
            </form>
            <div className="mt-6 flex items-center gap-5 text-white/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label={t("social.instagram")}
              >
                <InstagramIcon className="size-[18px]" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label={t("social.pinterest")}
              >
                <PinterestIcon className="size-[18px]" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label={t("social.x")}
              >
                <XIcon className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/45">
          <p className="font-serif">
            {t("copyright", { year, brand: BRAND_NAME })}
          </p>
        </div>
      </div>
    </footer>
  );
}
