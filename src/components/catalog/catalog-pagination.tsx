"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import { useCatalog } from "@/components/catalog/catalog-provider";

function pageItems(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: Array<number | "…"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("…");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

export function CatalogPagination() {
  const t = useTranslations("catalog.pagination");
  const navRef = useRef<HTMLElement>(null);
  const { page, totalPages, setPage, filteredProducts, pageSize } = useCatalog();

  if (filteredProducts.length <= pageSize) return null;

  const goTo = (next: number) => {
    setPage(next);
    navRef.current
      ?.closest("section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      ref={navRef}
      className="mx-auto mt-12 flex max-w-[1600px] flex-col items-center justify-center gap-4 px-4 sm:mt-14 sm:px-6 lg:px-10"
      aria-label={t("label")}
    >
      <p className="font-serif text-sm text-atlas-charcoal/70">
        {t("summary", {
          from: (page - 1) * pageSize + 1,
          to: Math.min(page * pageSize, filteredProducts.length),
          total: filteredProducts.length,
        })}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-10 items-center gap-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-atlas-charcoal transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={t("previous")}
        >
          <ChevronLeft className="size-4" aria-hidden />
          {t("previous")}
        </button>
        <ul className="flex items-center gap-1">
          {pageItems(page, totalPages).map((item, index) =>
            item === "…" ? (
              <li
                key={`ellipsis-${index}`}
                className="px-1 text-sm text-atlas-charcoal/50"
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => goTo(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={`flex h-10 min-w-10 items-center justify-center px-2 text-sm font-semibold transition-colors ${
                    item === page
                      ? "bg-atlas-charcoal text-atlas-cream"
                      : "text-atlas-charcoal hover:bg-atlas-charcoal/5"
                  }`}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-10 items-center gap-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-atlas-charcoal transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={t("next")}
        >
          {t("next")}
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
