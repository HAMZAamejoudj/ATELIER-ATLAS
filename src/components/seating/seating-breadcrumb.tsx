import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { getTranslations } from "next-intl/server";



export async function SeatingBreadcrumb() {

  const t = await getTranslations("seating.breadcrumb");



  const items = [

    { href: "/", label: t("home") },

    { href: "/seating", label: t("furniture") },

    { href: "/seating", label: t("seating") },

  ];



  return (

    <nav aria-label="Breadcrumb" className="bg-atlas-cream">

      <ol className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-1.5 px-4 py-3 text-[11px] text-atlas-charcoal/70 sm:px-6 lg:px-10">

        {items.map((item, index) => {

          const isLast = index === items.length - 1;

          return (

            <li key={`${item.href}-${item.label}`} className="flex items-center gap-1.5">

              {index > 0 ? (

                <ChevronRight

                  className="size-3 shrink-0 text-atlas-charcoal/40"

                  aria-hidden

                />

              ) : null}

              {isLast ? (

                <span className="font-medium text-atlas-charcoal" aria-current="page">

                  {item.label}

                </span>

              ) : (

                <Link

                  href={item.href}

                  className="transition-opacity hover:text-atlas-charcoal hover:opacity-80"

                >

                  {item.label}

                </Link>

              )}

            </li>

          );

        })}

      </ol>

    </nav>

  );

}


