"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Json } from "@/types/database";
import type {
  CreateProductInput,
  LanguageCode,
  ProductBadge,
  ShopProductDB,
  UpdateProductInput,
} from "@/types/product";

const productSelect = `
  *,
  collection:Collection(*, translations:CollectionTranslation(*)),
  translations:ProductTranslation(*),
  images:ProductImage(*)
`;

function parseSwatches(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((s) => typeof s === "string");
  return [];
}

function parseFilterFacets(raw: unknown): Record<string, string> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, string>;
  }
  return {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformProduct(product: any, lang: LanguageCode = "en"): ShopProductDB {
  const translations = product.translations || [];
  const t =
    translations.find((x: { language: string }) => x.language === lang) ||
    translations.find((x: { language: string }) => x.language === "en") ||
    translations[0];
  const tAr = translations.find((x: { language: string }) => x.language === "ar");

  const collectionTranslations = product.collection?.translations || [];
  const colT =
    collectionTranslations.find((x: { language: string }) => x.language === lang) ||
    collectionTranslations.find((x: { language: string }) => x.language === "en") ||
    collectionTranslations[0];

  const images = (product.images || []).sort(
    (a: { sortOrder: number }, b: { sortOrder: number }) =>
      a.sortOrder - b.sortOrder,
  );
  const primary =
    images.find((i: { isPrimary: boolean }) => i.isPrimary) || images[0];
  const mainImage = primary?.url || "/images/seating/hero-marlow-featured.png";
  const detailImages = [
    product.detailImage1,
    product.detailImage2,
    product.detailImage3,
  ].filter(Boolean) as string[];
  const gallery = detailImages.length
    ? detailImages
    : images
        .filter((i: { url: string }) => i.url !== mainImage)
        .map((i: { url: string }) => i.url);

  return {
    id: product.id,
    slug: t?.slug || product.sku || product.id,
    slugAr: tAr?.slug,
    title: t?.name || "",
    nameAr: tAr?.name,
    h1: t?.h1 || t?.name || "",
    h1Ar: tAr?.h1 || tAr?.name,
    description: t?.description || "",
    shortDescription: t?.shortDescription || "",
    descriptionAr: tAr?.description || undefined,
    shortDescriptionAr: tAr?.shortDescription || undefined,
    priceUsd: Number(product.priceUsd),
    compareAtUsd:
      product.compareAtUsd != null ? Number(product.compareAtUsd) : null,
    sku: product.sku || "",
    stock: product.stock ?? 0,
    material: product.material || "",
    swatches: parseSwatches(product.swatches),
    badge: (product.badge as ProductBadge | null) ?? null,
    filterFacets: parseFilterFacets(product.filterFacets),
    inStock: product.isAvailable && (product.stock ?? 0) > 0,
    featured: product.isFeatured,
    collection: colT?.name || "Collection",
    collectionSlug: product.collection?.systemSlug || colT?.slug || "",
    collectionId: product.collectionId,
    image: mainImage,
    gallery,
    detailImage1: product.detailImage1,
    detailImage2: product.detailImage2,
    detailImage3: product.detailImage3,
    createdAt: product.createdAt,
    metaTitle: t?.metaTitle || undefined,
    metaDesc: t?.metaDesc || undefined,
    keywords: t?.keywords || undefined,
    ogImage: t?.ogImage || undefined,
    canonical: t?.canonical || undefined,
    metaTitleAr: tAr?.metaTitle || undefined,
    metaDescAr: tAr?.metaDesc || undefined,
    keywordsAr: tAr?.keywords || undefined,
  };
}

function resolveProductImages(input: CreateProductInput | UpdateProductInput) {
  const mainImage =
    input.mainImage ||
    undefined;
  const detailImage1 = input.detailImage1 ?? null;
  const detailImage2 = input.detailImage2 ?? null;
  const detailImage3 = input.detailImage3 ?? null;
  return { mainImage, detailImage1, detailImage2, detailImage3 };
}

async function saveProductImages(
  productId: string,
  input: CreateProductInput | UpdateProductInput,
) {
  const { mainImage, detailImage1, detailImage2, detailImage3 } =
    resolveProductImages(input);

  await supabaseAdmin
    .from("Product")
    .update({
      detailImage1,
      detailImage2,
      detailImage3,
    })
    .eq("id", productId);

  await supabaseAdmin.from("ProductImage").delete().eq("productId", productId);
  if (mainImage) {
    await supabaseAdmin.from("ProductImage").insert({
      productId,
      url: mainImage,
      isPrimary: true,
      sortOrder: 0,
      altText: null,
    });
  }
}

export async function getProducts(options?: {
  collectionSlug?: string;
  search?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  lang?: LanguageCode;
  limit?: number;
}): Promise<{ products: ShopProductDB[]; total: number }> {
  const {
    collectionSlug,
    search,
    isAvailable,
    isFeatured,
    lang = "en",
    limit = 200,
  } = options || {};

  return unstable_cache(
    async () => {
      try {
        let query = supabase.from("Product").select(productSelect, {
          count: "exact",
        });

        if (typeof isAvailable === "boolean")
          query = query.eq("isAvailable", isAvailable);
        if (typeof isFeatured === "boolean")
          query = query.eq("isFeatured", isFeatured);
        if (search) query = query.ilike("sku", `%${search}%`);

        const { data, count, error } = await query
          .order("sortOrder", { ascending: true })
          .order("createdAt", { ascending: false })
          .limit(limit);

        if (error) throw error;

        let products = (data || []).map((p) => transformProduct(p, lang));

        if (collectionSlug && collectionSlug !== "all") {
          products = products.filter(
            (p) => p.collectionSlug === collectionSlug,
          );
        }

        return { products, total: count || products.length };
      } catch (e) {
        console.error("getProducts:", e);
        return { products: [], total: 0 };
      }
    },
    ["atlas-products", JSON.stringify(options || {})],
    { tags: [CACHE_TAGS.PRODUCTS], revalidate: 60 },
  )();
}

export async function getProductById(
  id: string,
  lang: LanguageCode = "en",
): Promise<ShopProductDB | null> {
  try {
    const { data: product, error } = await supabase
      .from("Product")
      .select(productSelect)
      .eq("id", id)
      .single();

    if (error || !product) return null;
    return transformProduct(product, lang);
  } catch (e) {
    console.error("getProductById:", e);
    return null;
  }
}

export async function isSlugUnique(
  slug: string,
  language: LanguageCode,
  excludeProductId?: string,
): Promise<boolean> {
  let query = supabaseAdmin
    .from("ProductTranslation")
    .select("productId")
    .eq("slug", slug)
    .eq("language", language);
  if (excludeProductId) query = query.neq("productId", excludeProductId);
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createProduct(input: CreateProductInput) {
  try {
    await checkAdmin();
    const { data: product, error } = await supabaseAdmin
      .from("Product")
      .insert({
        collectionId: input.collectionId,
        priceUsd: input.priceUsd,
        compareAtUsd: input.compareAtUsd ?? null,
        sku: input.sku,
        stock: input.stock ?? 0,
        material: input.material,
        swatches: input.swatches,
        badge: input.badge ?? null,
        filterFacets: input.filterFacets || {},
        isAvailable: input.isAvailable ?? true,
        isFeatured: input.isFeatured ?? false,
        sortOrder: input.sortOrder ?? 0,
        attributes: (input.attributes ?? null) as Json | null,
      })
      .select()
      .single();

    if (error) throw error;

    const { error: translationError } = await supabaseAdmin
      .from("ProductTranslation")
      .insert(
        input.translations.map((t) => ({
          productId: product.id,
          language: t.language,
          name: t.name,
          h1: t.h1 || t.name,
          shortDescription: t.shortDescription || null,
          description: t.description || null,
          slug: t.slug,
          metaTitle: t.metaTitle || null,
          metaDesc: t.metaDesc || null,
          keywords: t.keywords || null,
          ogImage: t.ogImage || null,
          canonical: t.canonical || null,
        })),
      );
    if (translationError) throw translationError;

    await saveProductImages(product.id, input);

    revalidateTag(CACHE_TAGS.PRODUCTS, "default");
    revalidatePath("/atlasadmin/products");

    const created = await getProductById(product.id);
    return { success: true as const, product: created };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create product";
    return { success: false as const, error: message };
  }
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  try {
    await checkAdmin();
    await supabaseAdmin
      .from("Product")
      .update({
        ...(input.collectionId && { collectionId: input.collectionId }),
        ...(input.priceUsd != null && { priceUsd: input.priceUsd }),
        ...(input.compareAtUsd !== undefined && {
          compareAtUsd: input.compareAtUsd,
        }),
        ...(input.sku && { sku: input.sku }),
        ...(input.stock != null && { stock: input.stock }),
        ...(input.material != null && { material: input.material }),
        ...(input.swatches && { swatches: input.swatches }),
        ...(input.badge !== undefined && { badge: input.badge }),
        ...(input.filterFacets && { filterFacets: input.filterFacets }),
        ...(input.isAvailable != null && { isAvailable: input.isAvailable }),
        ...(input.isFeatured != null && { isFeatured: input.isFeatured }),
        ...(input.sortOrder != null && { sortOrder: input.sortOrder }),
        ...(input.attributes !== undefined && {
          attributes: input.attributes as Json,
        }),
      })
      .eq("id", id);

    if (input.translations) {
      await supabaseAdmin
        .from("ProductTranslation")
        .delete()
        .eq("productId", id);
      await supabaseAdmin.from("ProductTranslation").insert(
        input.translations.map((t) => ({
          productId: id,
          language: t.language,
          name: t.name,
          h1: t.h1 || t.name,
          shortDescription: t.shortDescription || null,
          description: t.description || null,
          slug: t.slug,
          metaTitle: t.metaTitle || null,
          metaDesc: t.metaDesc || null,
          keywords: t.keywords || null,
          ogImage: t.ogImage || null,
          canonical: t.canonical || null,
        })),
      );
    }

    if (
      input.mainImage !== undefined ||
      input.detailImage1 !== undefined ||
      input.detailImage2 !== undefined ||
      input.detailImage3 !== undefined
    ) {
      await saveProductImages(id, input);
    }

    revalidateTag(CACHE_TAGS.PRODUCTS, "default");
    revalidateTag(CACHE_TAGS.PRODUCT(id), "default");
    revalidatePath("/atlasadmin/products");

    const updated = await getProductById(id);
    return { success: true as const, product: updated };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update product";
    return { success: false as const, error: message };
  }
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  try {
    const { error } = await supabaseAdmin.from("Product").delete().eq("id", id);
    if (error) throw error;
    revalidateTag(CACHE_TAGS.PRODUCTS, "default");
    return { success: true as const };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to delete product";
    return { success: false as const, error: message };
  }
}

export async function toggleProductStatus(
  id: string,
  field: "isAvailable" | "isFeatured",
  value: boolean,
) {
  await checkAdmin();
  const update =
    field === "isAvailable" ? { isAvailable: value } : { isFeatured: value };
  const { error } = await supabaseAdmin
    .from("Product")
    .update(update)
    .eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidateTag(CACHE_TAGS.PRODUCTS, "default");
  return { success: true as const };
}
