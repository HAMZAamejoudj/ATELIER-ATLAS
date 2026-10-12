import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

export const productCardIconClass =
  "size-6 stroke-[2] text-atlas-charcoal drop-shadow-[0_0_10px_rgba(255,255,255,0.95),0_1px_4px_rgba(255,255,255,0.75)] transition-transform duration-200 ease-out will-change-transform sm:size-7";

/** Smaller overlay icons (e.g. Best Sellers horizontal cards) */
export const compactProductCardIconClass =
  "size-[18px] stroke-[1.75] text-atlas-charcoal drop-shadow-[0_0_8px_rgba(255,255,255,0.95),0_1px_3px_rgba(255,255,255,0.75)] transition-transform duration-200 ease-out will-change-transform sm:size-5";

export const productCardActionButtonClass =
  "inline-flex items-center justify-center p-1 text-atlas-charcoal transition-transform duration-200 ease-out hover:scale-110 active:scale-95 motion-reduce:transform-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-charcoal/20";

export function useProductCardActionPulse(durationMs = 450) {
  const [pulsing, setPulsing] = useState(false);

  const triggerPulse = useCallback(() => {
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), durationMs);
  }, [durationMs]);

  return { pulsing, triggerPulse };
}

export function productCardActionClasses(options: {
  pulsing?: boolean;
  extra?: string;
}) {
  return cn(
    productCardActionButtonClass,
    options.pulsing && "animate-product-action-pop",
    options.extra,
  );
}
