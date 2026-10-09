export type LanguageCode = "en" | "ar";

export type ProductBadge = "BEST_SELLER" | "NEW";

export interface ProductTranslationInput {
  language: LanguageCode;
  name: string;
  h1?: string;
  shortDescription?: string;
  description?: string;
  slug: string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export interface ShopProductDB {
  id: string;
  slug: string;
  slugAr?: string;
  title: string;
  nameAr?: string;
  h1: string;
  h1Ar?: string;
  description: string;
  shortDescription: string;
  priceUsd: number;
  compareAtUsd: number | null;
  sku: string;
  stock: number;
  material: string;
  swatches: string[];
  badge: ProductBadge | null;
  filterFacets: Record<string, string>;
  inStock: boolean;
  featured: boolean;
  collection: string;
  collectionSlug: string;
  collectionId: string;
  image: string;
  gallery: string[];
  detailImage1?: string | null;
  detailImage2?: string | null;
  detailImage3?: string | null;
  createdAt: string;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  metaTitleAr?: string;
  metaDescAr?: string;
  keywordsAr?: string;
  shortDescriptionAr?: string;
  descriptionAr?: string;
}

export interface CreateProductInput {
  collectionId: string;
  priceUsd: number;
  compareAtUsd?: number | null;
  sku: string;
  stock?: number;
  material: string;
  swatches: string[];
  badge?: ProductBadge | null;
  filterFacets?: Record<string, string>;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  attributes?: Record<string, unknown>;
  translations: ProductTranslationInput[];
  mainImage?: string;
  detailImage1?: string | null;
  detailImage2?: string | null;
  detailImage3?: string | null;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface CollectionDB {
  id: string;
  systemSlug: string;
  name: string;
  slug: string;
  sortOrder: number;
  h1?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
}

export interface CollectionTranslationInput {
  language: LanguageCode;
  name: string;
  slug: string;
  h1?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
}

export interface CollectionDetailDB {
  id: string;
  systemSlug: string;
  sortOrder: number;
  translations: {
    id?: string;
    language: LanguageCode;
    name: string;
    slug: string;
    h1?: string | null;
    description?: string | null;
    metaTitle?: string | null;
    metaDesc?: string | null;
    keywords?: string | null;
    ogImage?: string | null;
    canonical?: string | null;
  }[];
}

export interface UpdateCollectionInput {
  systemSlug?: string;
  sortOrder?: number;
  translations: CollectionTranslationInput[];
}

