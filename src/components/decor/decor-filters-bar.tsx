import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { DECOR_FILTERS } from "@/lib/decor-data";

export function DecorFiltersBar() {
  return (
    <div className="sticky top-0 z-20 border-b border-atlas-charcoal/10 bg-atlas-cream">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 py-4 sm:gap-2.5 sm:px-6 lg:px-10">
        <span className="mr-1 flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal">
          <SlidersHorizontal className="size-3.5" aria-hidden />
          Filters
        </span>
        {DECOR_FILTERS.map((label) => (
          <button
            key={label}
            type="button"
            className="inline-flex items-center gap-1.5 border border-atlas-charcoal/20 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-atlas-charcoal transition-colors hover:border-atlas-charcoal/40"
          >
            {label}
            <ChevronDown className="size-3 opacity-60" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
