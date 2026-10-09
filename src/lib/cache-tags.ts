export const CACHE_TAGS = {
  PRODUCTS: "products",
  PRODUCT: (idOrSlug: string) => `product-${idOrSlug}`,
  COLLECTIONS: "collections",
  BLOG: "blog",
  BLOG_POST: (slug: string) => `blog-${slug}`,
  STATIC_PAGES: "static-pages",
  STATIC_PAGE: (systemName: string) => `static-page-${systemName}`,
  SEO: "seo-global",
  LIBRARY: "library",
} as const;
