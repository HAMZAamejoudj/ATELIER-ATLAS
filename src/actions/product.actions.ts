"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Json } from "@/types/database";
import { parseColorVariantsFromAttributes } from "@/lib/product-color-variants";
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
  const urlsFromRows = images
    .map((i: { url: string }) => i.url)
    .filter(Boolean) as string[];
  const detailImages = [
    product.detailImage1,
    product.detailImage2,
    product.detailImage3,
  ].filter(Boolean) as string[];

  let mainImage =
    primary?.url || urlsFromRows[0] || "/images/seating/hero-marlow-featured.png";
  let gallery: string[] = [];

  if (urlsFromRows.length > 0) {
    mainImage = urlsFromRows[0];
    gallery = urlsFromRows.slice(1);
  } else if (detailImages.length > 0) {
    gallery = detailImages.filter((url) => url !== mainImage);
  }

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
    colorVariants: parseColorVariantsFromAttributes(
      product.attributes,
      mainImage,
      parseSwatches(product.swatches),
    ),
    badge: (product.badge as ProductBadge | null) ?? null,
    filterFacets: parseFilterFacets(product.filterFacets),
    inStock: product.isAvailable && (product.stock ?? 0) > 0,
    isAvailable: Boolean(product.isAvailable),
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

function revalidateStorefrontCatalog() {
  revalidatePath("/atlasadmin/products");
  revalidatePath("/");
  revalidatePath("/seating");
  revalidatePath("/lighting");
  revalidatePath("/decor");
  revalidatePath("/mirrors");
  revalidatePath("/tables-consoles");
  revalidatePath("/products", "layout");
}

const MAX_PRODUCT_IMAGES = 10;

function resolveProductImageUrls(
  input: CreateProductInput | UpdateProductInput,
): string[] {
  if (input.productImages?.length) {
    return input.productImages
      .map((url) => (url ?? "").trim())
      .filter(Boolean)
      .slice(0, MAX_PRODUCT_IMAGES);
  }

  return [
    input.mainImage,
    input.detailImage1,
    input.detailImage2,
    input.detailImage3,
  ]
    .map((url) => (url ?? "").trim())
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_IMAGES);
}

async function saveProductImages(
  productId: string,
  input: CreateProductInput | UpdateProductInput,
) {
  const urls = resolveProductImageUrls(input);

  await supabaseAdmin
    .from("Product")
    .update({
      detailImage1: urls[1] ?? null,
      detailImage2: urls[2] ?? null,
      detailImage3: urls[3] ?? null,
    })
    .eq("id", productId);

  await supabaseAdmin.from("ProductImage").delete().eq("productId", productId);

  if (urls.length === 0) return;

  await supabaseAdmin.from("ProductImage").insert(
    urls.map((url, index) => ({
      productId,
      url,
      isPrimary: index === 0,
      sortOrder: index,
      altText: null,
    })),
  );
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
          const wanted = collectionSlug.trim().toLowerCase().replace(/[\s_]+/g, "-");
          products = products.filter((p) => {
            const slug = p.collectionSlug.trim().toLowerCase().replace(/[\s_]+/g, "-");
            const name = p.collection.trim().toLowerCase().replace(/[\s_]+/g, "-");
            return slug === wanted || name === wanted;
          });
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

export async function getProductBySlug(
  slug: string,
  lang: LanguageCode = "en",
): Promise<ShopProductDB | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  return unstable_cache(
    async () => {
      try {
        const pickTranslation = async (language: LanguageCode) => {
          const { data } = await supabase
            .from("ProductTranslation")
            .select("productId")
            .eq("slug", normalized)
            .eq("language", language)
            .maybeSingle();
          return data?.productId as string | undefined;
        };

        let productId = await pickTranslation(lang);
        if (!productId && lang !== "en") {
          productId = await pickTranslation("en");
        }
        if (!productId) return null;

        const { data: product, error } = await supabase
          .from("Product")
          .select(productSelect)
          .eq("id", productId)
          .maybeSingle();

        if (error || !product) return null;
        return transformProduct(product, lang);
      } catch (e) {
        console.error("getProductBySlug:", e);
        return null;
      }
    },
    ["atlas-product-slug", normalized, lang],
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
    revalidateStorefrontCatalog();

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
      input.productImages !== undefined ||
      input.mainImage !== undefined ||
      input.detailImage1 !== undefined ||
      input.detailImage2 !== undefined ||
      input.detailImage3 !== undefined
    ) {
      await saveProductImages(id, input);
    }

    revalidateTag(CACHE_TAGS.PRODUCTS, "default");
    revalidateTag(CACHE_TAGS.PRODUCT(id), "default");
    revalidateStorefrontCatalog();

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
    revalidateStorefrontCatalog();
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
  revalidateStorefrontCatalog();
  return { success: true as const };
}
