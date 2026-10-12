import { getProductBySlug } from "@/actions/product.actions";
import {
  getStaticProductBySlug,
  getStaticProductsInCollection,
  type StorefrontProductDetail,
} from "@/lib/storefront-product-registry";
import { swatchesToColorVariants } from "@/lib/product-color-variants";
import { productDetailPath } from "@/lib/product-slug";
import type { LanguageCode, ShopProductDB } from "@/types/product";
import type { Locale } from "@/lib/locale";

function shopToDetail(product: ShopProductDB): StorefrontProductDetail {
  const slug = product.slug;
  const gallery = [
    product.image,
    ...product.gallery.filter((url) => url && url !== product.image),
  ];

  return {
    id: product.id,
    slug,
    name: product.title,
    priceUsd: product.priceUsd,
    compareAtUsd: product.compareAtUsd,
    description:
      product.description ||
      product.shortDescription ||
      `${product.title} — made to order in ${product.material}.`,
    shortDescription:
      product.shortDescription ||
      product.description?.slice(0, 160) ||
      product.title,
    image: product.image,
    gallery: gallery.length ? gallery : [product.image],
    alt: product.title,
    material: product.material,
    swatches: product.swatches,
    colorVariants: product.colorVariants?.length
      ? product.colorVariants
      : swatchesToColorVariants(product.swatches, product.image),
    badge: product.badge,
    collectionSlug: product.collectionSlug,
    collectionLabel: product.collection,
    sku: product.sku || slug,
    inStock: product.inStock,
    href: productDetailPath(slug),
  };
}

export async function resolveProductDetail(
  slug: string,
  locale: Locale,
): Promise<StorefrontProductDetail | null> {
  const lang = locale as LanguageCode;
  const fromDb = await getProductBySlug(slug, lang);
  if (fromDb?.isAvailable) {
    return shopToDetail(fromDb);
  }

  return getStaticProductBySlug(slug);
}

export async function resolveRelatedProducts(
  product: StorefrontProductDetail,
  locale: Locale,
): Promise<StorefrontProductDetail[]> {
  const lang = locale as LanguageCode;
  const staticRelated = getStaticProductsInCollection(
    product.collectionSlug,
    product.slug,
    4,
  );

  const { getProducts } = await import("@/actions/product.actions");
  const { products } = await getProducts({
    collectionSlug: product.collectionSlug,
    isAvailable: true,
    lang,
    limit: 20,
  });

  const dbRelated = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4)
    .map(shopToDetail);

  if (dbRelated.length >= 4) return dbRelated;
  const seen = new Set<string>([product.slug, ...dbRelated.map((p) => p.slug)]);
  for (const item of staticRelated) {
    if (seen.has(item.slug)) continue;
    dbRelated.push(item);
    seen.add(item.slug);
    if (dbRelated.length >= 4) break;
  }
  return dbRelated;
}
