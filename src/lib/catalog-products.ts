import { getProducts } from "@/actions/product.actions";
import type { CatalogProductLike } from "@/lib/catalog-filters";
import type { LanguageCode, ProductBadge, ShopProductDB } from "@/types/product";

export const CATALOG_PAGE_SIZE = 12;

export type CatalogCardProduct = CatalogProductLike & {
  href: string;
  image: string;
  alt: string;
  badge?: "BEST SELLER" | "NEW";
  filterFacets?: Record<string, string>;
};

function mapBadge(badge: ProductBadge | null): CatalogCardProduct["badge"] {
  if (badge === "BEST_SELLER") return "BEST SELLER";
  if (badge === "NEW") return "NEW";
  return undefined;
}

export function shopProductToCatalog(product: ShopProductDB): CatalogCardProduct {
  const href = product.collectionSlug ? `/${product.collectionSlug}` : "/";
  return {
    href,
    name: product.title || product.sku || product.id,
    priceUsd: product.priceUsd,
    image: product.image,
    alt: product.title || product.sku || "Product",
    badge: mapBadge(product.badge),
    swatches: product.swatches,
    material: product.material,
    filterFacets: product.filterFacets,
  };
}

function collectionKey(value: string) {
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

export function productMatchesCollection(
  product: ShopProductDB,
  collectionSlug: string,
) {
  const wanted = collectionKey(collectionSlug);
  return (
    collectionKey(product.collectionSlug) === wanted ||
    collectionKey(product.collection) === wanted
  );
}

export function mergeCatalogProducts(
  fallback: CatalogCardProduct[],
  fromDb: CatalogCardProduct[],
): CatalogCardProduct[] {
  const byName = new Map<string, CatalogCardProduct>();
  for (const product of fallback) {
    byName.set(product.name.trim().toLowerCase(), product);
  }
  for (const product of fromDb) {
    byName.set(product.name.trim().toLowerCase(), product);
  }

  const fallbackNames = new Set(
    fallback.map((p) => p.name.trim().toLowerCase()),
  );
  const dbOnly = fromDb.filter(
    (p) => !fallbackNames.has(p.name.trim().toLowerCase()),
  );
  const mergedStatic = fallback.map(
    (p) => byName.get(p.name.trim().toLowerCase()) ?? p,
  );

  return [...dbOnly, ...mergedStatic];
}

export async function getStorefrontCatalogProducts(
  collectionSlug: string,
  fallback: CatalogCardProduct[],
  lang: LanguageCode = "en",
): Promise<CatalogCardProduct[]> {
  const { products } = await getProducts({
    collectionSlug,
    isAvailable: true,
    lang,
    limit: 500,
  });
  const fromDb = products.map(shopProductToCatalog);
  if (fromDb.length === 0) return fallback;
  return mergeCatalogProducts(fallback, fromDb);
}

export function isRemoteCatalogImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
