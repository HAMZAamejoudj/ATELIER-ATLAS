import type { CatalogFilterDefinition } from "@/lib/catalog-filters";
import { PRICE_BUCKET_IDS, type PriceBucketId } from "@/lib/catalog-filters";
import type { Locale } from "@/lib/locale";
import { formatMoney } from "@/lib/money";

export type CatalogTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

function priceBucketOptions(
  t: CatalogTranslator,
  locale: Locale,
): { value: PriceBucketId; label: string }[] {
  return PRICE_BUCKET_IDS.map((id) => ({
    value: id,
    label: t(`priceBuckets.${id}`, {
      under500: formatMoney(500, locale),
      from500: formatMoney(500, locale),
      to999: formatMoney(999, locale),
      from1000: formatMoney(1000, locale),
      to1499: formatMoney(1499, locale),
      from1500: formatMoney(1500, locale),
    }),
  }));
}

function opt(value: string, label: string) {
  return { value, label };
}

export function getLightingFilterDefinitions(
  t: CatalogTranslator,
  locale: Locale,
): CatalogFilterDefinition[] {
  const p = (key: string) => t(`lighting.${key}`);
  return [
    {
      key: "category",
      label: p("category"),
      options: [
        opt("Pendants", p("options.pendants")),
        opt("Table Lamps", p("options.tableLamps")),
        opt("Wall Sconces", p("options.wallSconces")),
        opt("Floor Lamps", p("options.floorLamps")),
        opt("Outdoor", p("options.outdoor")),
      ],
    },
    {
      key: "style",
      label: p("style"),
      options: [
        opt("Contemporary", p("options.contemporary")),
        opt("Sculptural", p("options.sculptural")),
        opt("Classic", p("options.classic")),
      ],
    },
    {
      key: "material",
      label: p("material"),
      options: [
        opt("Travertine", p("options.travertine")),
        opt("Ceramic", p("options.ceramic")),
        opt("Bronze", p("options.bronze")),
        opt("Linen", p("options.linen")),
        opt("Walnut", p("options.walnut")),
      ],
    },
    {
      key: "color",
      label: p("color"),
      options: [
        opt("Neutral", p("options.neutral")),
        opt("Warm", p("options.warm")),
        opt("Dark", p("options.dark")),
      ],
    },
    {
      key: "location",
      label: p("location"),
      options: [
        opt("Indoor", p("options.indoor")),
        opt("Outdoor", p("options.outdoor")),
      ],
    },
    {
      key: "price",
      label: p("price"),
      options: priceBucketOptions(t, locale),
    },
  ];
}

export function getSeatingFilterDefinitions(
  t: CatalogTranslator,
  locale: Locale,
): CatalogFilterDefinition[] {
  const p = (key: string) => t(`seating.${key}`);
  return [
    {
      key: "category",
      label: p("category"),
      options: [
        opt("Sofas", p("options.sofas")),
        opt("Loveseats", p("options.loveseats")),
        opt("Armchairs", p("options.armchairs")),
        opt("Swivel Chairs", p("options.swivelChairs")),
        opt("Ottomans", p("options.ottomans")),
        opt("Dining Chairs", p("options.diningChairs")),
        opt("Benches & Stools", p("options.benchesStools")),
      ],
    },
    {
      key: "style",
      label: p("style"),
      options: [
        opt("Contemporary", p("options.contemporary")),
        opt("Classic", p("options.classic")),
        opt("Relaxed", p("options.relaxed")),
      ],
    },
    {
      key: "material",
      label: p("material"),
      options: [
        opt("Bouclé", p("options.boucle")),
        opt("Linen", p("options.linen")),
        opt("Leather", p("options.leather")),
        opt("Oak", p("options.oak")),
        opt("Walnut", p("options.walnut")),
        opt("Travertine", p("options.travertine")),
      ],
    },
    {
      key: "color",
      label: p("color"),
      options: [
        opt("Neutral", p("options.neutral")),
        opt("Warm", p("options.warm")),
        opt("Dark", p("options.dark")),
      ],
    },
    {
      key: "availability",
      label: p("availability"),
      options: [
        opt("In stock", p("options.inStock")),
        opt("New arrivals", p("options.newArrivals")),
      ],
    },
    {
      key: "price",
      label: p("price"),
      options: priceBucketOptions(t, locale),
    },
  ];
}

export function getDecorFilterDefinitions(
  t: CatalogTranslator,
  locale: Locale,
): CatalogFilterDefinition[] {
  const p = (key: string) => t(`decor.${key}`);
  return [
    {
      key: "category",
      label: p("category"),
      options: [
        opt("Mirrors", p("options.mirrors")),
        opt("Vases", p("options.vases")),
        opt("Objects", p("options.objects")),
        opt("Trays", p("options.trays")),
        opt("Candleholders", p("options.candleholders")),
      ],
    },
    {
      key: "material",
      label: p("material"),
      options: [
        opt("Bronze", p("options.bronze")),
        opt("Travertine", p("options.travertine")),
        opt("Ceramic", p("options.ceramic")),
        opt("Stone", p("options.stone")),
        opt("Marble", p("options.marble")),
        opt("Brass", p("options.brass")),
        opt("Walnut", p("options.walnut")),
      ],
    },
    {
      key: "color",
      label: p("color"),
      options: [
        opt("Neutral", p("options.neutral")),
        opt("Warm", p("options.warm")),
        opt("Dark", p("options.dark")),
      ],
    },
    {
      key: "style",
      label: p("style"),
      options: [
        opt("Modern", p("options.modern")),
        opt("Heritage", p("options.heritage")),
      ],
    },
    {
      key: "size",
      label: p("size"),
      options: [
        opt("Small", p("options.small")),
        opt("Medium", p("options.medium")),
        opt("Large", p("options.large")),
      ],
    },
    {
      key: "availability",
      label: p("availability"),
      options: [opt("In stock", p("options.inStock"))],
    },
    {
      key: "price",
      label: p("price"),
      options: priceBucketOptions(t, locale),
    },
  ];
}

export function getTablesFilterDefinitions(
  t: CatalogTranslator,
  locale: Locale,
): CatalogFilterDefinition[] {
  const p = (key: string) => t(`tablesConsoles.${key}`);
  return [
    {
      key: "category",
      label: p("category"),
      options: [
        opt("Dining Tables", p("options.diningTables")),
        opt("Console Tables", p("options.consoleTables")),
        opt("Sideboards", p("options.sideboards")),
        opt("Coffee Tables", p("options.coffeeTables")),
        opt("Side Tables", p("options.sideTables")),
      ],
    },
    {
      key: "style",
      label: p("style"),
      options: [
        opt("Contemporary", p("options.contemporary")),
        opt("Classic", p("options.classic")),
        opt("Sculptural", p("options.sculptural")),
      ],
    },
    {
      key: "material",
      label: p("material"),
      options: [
        opt("Travertine", p("options.travertine")),
        opt("Walnut", p("options.walnut")),
        opt("Oak", p("options.oak")),
        opt("Marble", p("options.marble")),
        opt("Metal", p("options.metal")),
      ],
    },
    {
      key: "color",
      label: p("color"),
      options: [
        opt("Neutral", p("options.neutral")),
        opt("Warm", p("options.warm")),
        opt("Dark", p("options.dark")),
      ],
    },
    {
      key: "availability",
      label: p("availability"),
      options: [
        opt("In stock", p("options.inStock")),
        opt("New arrivals", p("options.newArrivals")),
      ],
    },
    {
      key: "price",
      label: p("price"),
      options: priceBucketOptions(t, locale),
    },
  ];
}

export function getMirrorsFilterDefinitions(
  t: CatalogTranslator,
  locale: Locale,
): CatalogFilterDefinition[] {
  const p = (key: string) => t(`mirrors.${key}`);
  return [
    {
      key: "style",
      label: p("style"),
      options: [
        opt("Statement", p("options.statement")),
        opt("Classic", p("options.classic")),
        opt("Minimal", p("options.minimal")),
      ],
    },
    {
      key: "shape",
      label: p("shape"),
      options: [
        opt("Arched", p("options.arched")),
        opt("Round", p("options.round")),
        opt("Rectangular", p("options.rectangular")),
      ],
    },
    {
      key: "size",
      label: p("size"),
      options: [
        opt("Small", p("options.small")),
        opt("Medium", p("options.medium")),
        opt("Large", p("options.large")),
        opt("Extra large", p("options.extraLarge")),
      ],
    },
    {
      key: "frame material",
      label: p("frameMaterial"),
      options: [
        opt("Antique Brass", p("options.antiqueBrass")),
        opt("Travertine", p("options.travertine")),
        opt("Walnut", p("options.walnut")),
        opt("Aged Bronze", p("options.agedBronze")),
        opt("Oak", p("options.oak")),
        opt("Blackened Steel", p("options.blackenedSteel")),
        opt("Brass", p("options.brass")),
        opt("Marble", p("options.marble")),
      ],
    },
    {
      key: "color",
      label: p("color"),
      options: [
        opt("Neutral", p("options.neutral")),
        opt("Warm", p("options.warm")),
        opt("Dark", p("options.dark")),
      ],
    },
    {
      key: "price",
      label: p("price"),
      options: priceBucketOptions(t, locale),
    },
  ];
}
