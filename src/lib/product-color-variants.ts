export type ProductColorVariant = {
  name: string;
  hex: string;
  image: string;
};

export function swatchesToColorVariants(
  swatches: string[],
  fallbackImage: string,
): ProductColorVariant[] {
  return swatches.map((hex) => ({
    name: "",
    hex,
    image: fallbackImage,
  }));
}

function isColorVariant(value: unknown): value is ProductColorVariant {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.hex === "string" && row.hex.length > 0;
}

export function parseColorVariantsFromAttributes(
  attributes: unknown,
  fallbackImage: string,
  swatches: string[],
): ProductColorVariant[] {
  if (attributes && typeof attributes === "object" && !Array.isArray(attributes)) {
    const raw = (attributes as Record<string, unknown>).colorVariants;
    if (Array.isArray(raw)) {
      const parsed = raw
        .filter(isColorVariant)
        .map((v) => ({
          name: v.name?.trim() || "",
          hex: v.hex.trim(),
          image: v.image?.trim() || fallbackImage,
        }));
      if (parsed.length > 0) return parsed;
    }
  }

  if (swatches.length > 0) {
    return swatchesToColorVariants(swatches, fallbackImage);
  }

  return [];
}

export function colorVariantsToSwatches(
  variants: ProductColorVariant[],
): string[] {
  return variants.map((v) => v.hex).filter(Boolean);
}
