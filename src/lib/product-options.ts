export interface ProductOptionGroup {
  id: string;
  name: string;
  options: string[];
}

export interface ProductPriceRow {
  id: string;
  option: string;
  priceUsd: number;
  salePriceUsd: number | null;
  stock: number;
  sku: string;
}

export interface ProductOptionsConfig {
  groups: ProductOptionGroup[];
  priceRows: ProductPriceRow[];
}

/**
 * Generates all unique combinations from one or more option groups.
 * If 1 group: ["Faucet Only", "+Sprayer", ...]
 * If multiple groups: ["Small / Faucet Only", "Small / +Sprayer", ...]
 */
export function generateCombinations(groups: ProductOptionGroup[]): string[] {
  const activeGroups = groups
    .map((g) => ({
      ...g,
      options: (g.options || []).map((o) => o.trim()).filter(Boolean),
    }))
    .filter((g) => g.options.length > 0);

  if (activeGroups.length === 0) return [];

  return activeGroups.reduce<string[]>((acc, group) => {
    if (acc.length === 0) return group.options;
    return acc.flatMap((prefix) =>
      group.options.map((opt) => `${prefix} / ${opt}`),
    );
  }, []);
}

/**
 * Creates or updates price rows matching current combinations.
 * Preserves user-entered price, sale price, stock, and SKU if the option already exists.
 */
export function generatePriceRowsFromGroups(
  groups: ProductOptionGroup[],
  existingRows: ProductPriceRow[] = [],
  defaultPrice = 0,
  defaultStock = 0,
  baseSku = "VAR",
): ProductPriceRow[] {
  const combinations = generateCombinations(groups);
  if (combinations.length === 0) return [];

  const existingMap = new Map<string, ProductPriceRow>();
  for (const row of existingRows) {
    if (row.option?.trim()) {
      existingMap.set(row.option.trim(), row);
    }
  }

  const cleanBaseSku = (baseSku || "VAR").trim() || "VAR";

  return combinations.map((combination, index) => {
    const existing = existingMap.get(combination);
    if (existing) {
      return {
        ...existing,
        option: combination,
      };
    }

    return {
      id: `row-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      option: combination,
      priceUsd: defaultPrice > 0 ? defaultPrice : 0,
      salePriceUsd: null,
      stock: defaultStock > 0 ? defaultStock : 0,
      sku: `${cleanBaseSku}-b${index + 1}`,
    };
  });
}

/**
 * Safely parses ProductOptionsConfig from the database attributes JSON.
 */
export function parseProductOptionsFromAttributes(
  attributes: unknown,
): ProductOptionsConfig | null {
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) {
    return null;
  }

  const raw = (attributes as Record<string, unknown>).productOptions;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const rawConfig = raw as Record<string, unknown>;

  const groups: ProductOptionGroup[] = Array.isArray(rawConfig.groups)
    ? rawConfig.groups.map((g: unknown, idx: number) => {
        const item = (g && typeof g === "object" ? g : {}) as Record<string, unknown>;
        return {
          id: typeof item.id === "string" && item.id ? item.id : `group-${idx}`,
          name: typeof item.name === "string" ? item.name : "",
          options: Array.isArray(item.options)
            ? (item.options as unknown[])
                .filter((o): o is string => typeof o === "string" && Boolean(o.trim()))
                .map((o) => o.trim())
            : [],
        };
      })
    : [];

  const priceRows: ProductPriceRow[] = Array.isArray(rawConfig.priceRows)
    ? rawConfig.priceRows.map((r: unknown, idx: number) => {
        const item = (r && typeof r === "object" ? r : {}) as Record<string, unknown>;
        const priceNum =
          typeof item.priceUsd === "number"
            ? item.priceUsd
            : Number(item.priceUsd) || 0;
        const saleNum =
          item.salePriceUsd != null && item.salePriceUsd !== ""
            ? Number(item.salePriceUsd)
            : null;
        const stockNum =
          typeof item.stock === "number" ? item.stock : Number(item.stock) || 0;

        return {
          id: typeof item.id === "string" && item.id ? item.id : `row-${idx}`,
          option: typeof item.option === "string" ? item.option : "",
          priceUsd: Number.isFinite(priceNum) ? Math.max(0, priceNum) : 0,
          salePriceUsd:
            saleNum != null && Number.isFinite(saleNum)
              ? Math.max(0, saleNum)
              : null,
          stock: Number.isFinite(stockNum) ? Math.max(0, stockNum) : 0,
          sku: typeof item.sku === "string" ? item.sku : "",
        };
      })
    : [];

  if (groups.length === 0 && priceRows.length === 0) {
    return null;
  }

  return {
    groups,
    priceRows,
  };
}

/**
 * Sanitizes options before persisting.
 * If there are no groups or no price rows, returns null.
 */
export function sanitizeProductOptions(
  config: ProductOptionsConfig | null | undefined,
): ProductOptionsConfig | null {
  if (!config) return null;

  const groups = (config.groups || [])
    .map((g) => ({
      id: g.id || `group-${Math.random().toString(36).slice(2, 7)}`,
      name: g.name.trim(),
      options: (g.options || []).map((o) => o.trim()).filter(Boolean),
    }))
    .filter((g) => g.name.length > 0 || g.options.length > 0);

  const priceRows = (config.priceRows || [])
    .map((r, idx) => ({
      id: r.id || `row-${idx}`,
      option: r.option.trim(),
      priceUsd: Number(r.priceUsd) || 0,
      salePriceUsd:
        r.salePriceUsd != null && r.salePriceUsd !== ("" as unknown)
          ? Number(r.salePriceUsd)
          : null,
      stock: Number(r.stock) || 0,
      sku: (r.sku || "").trim(),
    }))
    .filter((r) => r.option.length > 0);

  if (groups.length === 0 && priceRows.length === 0) {
    return null;
  }

  return {
    groups,
    priceRows,
  };
}
