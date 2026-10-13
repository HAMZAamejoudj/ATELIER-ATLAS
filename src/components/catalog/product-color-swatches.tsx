"use client";

import { cn } from "@/lib/utils";
import type { ProductColorVariant } from "@/lib/product-color-variants";

type ProductColorSwatchesProps = {
  variants: ProductColorVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  /** Preview variant image while hovering (e.g. catalog card); cleared on mouse leave */
  onPreview?: (index: number | null) => void;
  maxVisible?: number;
  size?: "sm" | "md";
};

export function ProductColorSwatches({
  variants,
  selectedIndex,
  onSelect,
  onPreview,
  maxVisible = 5,
  size = "sm",
}: ProductColorSwatchesProps) {
  if (variants.length === 0) return null;

  const visible = variants.slice(0, maxVisible);
  const extra = variants.length - visible.length;
  const dot =
    size === "md"
      ? "size-4 sm:size-[18px]"
      : "size-3 sm:size-3.5";

  return (
    <div
      className="flex items-center gap-1.5"
      onMouseLeave={() => onPreview?.(null)}
    >
      <ul className="flex items-center gap-1" role="list">
        {visible.map((variant, index) => (
          <li key={`${variant.hex}-${index}`}>
            <button
              type="button"
              aria-label={variant.name || variant.hex}
              aria-pressed={selectedIndex === index}
              onMouseEnter={() => onPreview?.(index)}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSelect(index);
              }}
              className={cn(
                "rounded-full border-2 transition-all duration-200 ease-out hover:scale-[1.2] hover:shadow-sm",
                dot,
                selectedIndex === index
                  ? "border-atlas-charcoal"
                  : "border-transparent ring-1 ring-atlas-charcoal/20",
              )}
              style={{ backgroundColor: variant.hex }}
            />
          </li>
        ))}
      </ul>
      {extra > 0 ? (
        <span className="text-[10px] font-semibold tabular-nums text-atlas-charcoal/70">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
