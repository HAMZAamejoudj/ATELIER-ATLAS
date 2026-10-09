import { cn } from "@/lib/utils";

/** Shared 40px header control — language, account, wishlist, cart */
export const headerActionButtonClass = cn(
  "relative inline-flex size-10 shrink-0 items-center justify-center",
  "border border-atlas-charcoal/18 bg-atlas-cream text-atlas-charcoal",
  "shadow-[0_1px_0_rgba(26,22,20,0.04)]",
  "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out",
  "hover:border-atlas-charcoal/40 hover:bg-white hover:shadow-[0_2px_8px_rgba(26,22,20,0.06)] hover:scale-[1.04]",
  "active:scale-[0.96] motion-reduce:transform-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-burgundy/35 focus-visible:ring-offset-2 focus-visible:ring-offset-atlas-cream",
);

export const headerActionIconClass = "size-[21px] stroke-[1.5]";

export function headerActionBadgeClass(count: number) {
  return cn(
    "pointer-events-none absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full",
    "bg-atlas-charcoal px-1 text-[10px] font-semibold leading-none tabular-nums text-atlas-cream",
    "ring-2 ring-atlas-cream",
    count > 9 && "px-1.5 text-[9px]",
  );
}
