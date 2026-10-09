-- ATELIER ATLAS — initial admin schema (en / ar)

CREATE TYPE "LanguageCode" AS ENUM ('en', 'ar');
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
);
CREATE TYPE "ProductBadge" AS ENUM ('BEST_SELLER', 'NEW');

-- Auth
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  "image" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'STAFF',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "UserCredential" (
  "userId" TEXT PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE "UserCredential" ENABLE ROW LEVEL SECURITY;

-- Collections (shop categories)
CREATE TABLE "Collection" (
  "id" TEXT PRIMARY KEY,
  "systemSlug" TEXT NOT NULL UNIQUE,
  "sortOrder" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "CollectionTranslation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "collectionId" TEXT NOT NULL REFERENCES "Collection"("id") ON DELETE CASCADE,
  "language" "LanguageCode" NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "h1" TEXT,
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "keywords" TEXT,
  "ogImage" TEXT,
  "canonical" TEXT,
  UNIQUE ("collectionId", "language")
);

-- Products
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "collectionId" TEXT NOT NULL REFERENCES "Collection"("id"),
  "priceUsd" NUMERIC(12, 2) NOT NULL,
  "compareAtUsd" NUMERIC(12, 2),
  "sku" TEXT NOT NULL DEFAULT '',
  "stock" INT NOT NULL DEFAULT 0,
  "material" TEXT NOT NULL DEFAULT '',
  "swatches" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "badge" "ProductBadge",
  "filterFacets" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INT NOT NULL DEFAULT 0,
  "attributes" JSONB,
  "detailImage1" TEXT,
  "detailImage2" TEXT,
  "detailImage3" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "ProductTranslation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "language" "LanguageCode" NOT NULL,
  "name" TEXT NOT NULL,
  "h1" TEXT,
  "shortDescription" TEXT,
  "description" TEXT,
  "slug" TEXT NOT NULL,
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "keywords" TEXT,
  "ogImage" TEXT,
  "canonical" TEXT,
  UNIQUE ("productId", "language")
);

CREATE UNIQUE INDEX "ProductTranslation_slug_language_key" ON "ProductTranslation" ("slug", "language");

CREATE TABLE "ProductImage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "altText" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INT NOT NULL DEFAULT 0
);

-- Blog
CREATE TABLE "BlogPost" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "topic" TEXT NOT NULL DEFAULT 'Craft',
  "format" TEXT NOT NULL DEFAULT 'Story',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "publishedAt" TIMESTAMPTZ,
  "featuredImageUrl" TEXT,
  "authorName" TEXT,
  "readTimeMinutes" INT NOT NULL DEFAULT 5,
  "viewCount" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "BlogPostTranslation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "blogPostId" TEXT NOT NULL REFERENCES "BlogPost"("id") ON DELETE CASCADE,
  "language" "LanguageCode" NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "body" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  UNIQUE ("blogPostId", "language")
);

CREATE UNIQUE INDEX "BlogPostTranslation_slug_language_key" ON "BlogPostTranslation" ("slug", "language");

-- SEO & static pages
CREATE TABLE "GlobalSeoSetting" (
  "id" TEXT PRIMARY KEY,
  "ogImage" TEXT,
  "twitterHandle" TEXT,
  "facebookPage" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "GlobalSeoTranslation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "globalSeoSettingId" TEXT NOT NULL REFERENCES "GlobalSeoSetting"("id") ON DELETE CASCADE,
  "language" "LanguageCode" NOT NULL,
  "siteName" TEXT,
  "titleSuffix" TEXT,
  "defaultMetaDesc" TEXT,
  "defaultKeywords" TEXT,
  UNIQUE ("globalSeoSettingId", "language")
);

CREATE TABLE "StaticPage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "systemName" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "StaticPageTranslation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "staticPageId" TEXT NOT NULL REFERENCES "StaticPage"("id") ON DELETE CASCADE,
  "language" "LanguageCode" NOT NULL,
  "h1" TEXT,
  "description" TEXT,
  "slug" TEXT NOT NULL,
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "keywords" TEXT,
  "ogImage" TEXT,
  "canonical" TEXT,
  UNIQUE ("staticPageId", "language")
);

-- Media library
CREATE TABLE "MediaLibrary" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "storagePath" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "localPath" TEXT,
  "originalSize" INT NOT NULL,
  "compressedSize" INT NOT NULL,
  "contentHash" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "width" INT,
  "height" INT,
  "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
  "duplicateOfId" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE "Customer" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "isWholesale" BOOLEAN NOT NULL DEFAULT false,
  "companyName" TEXT,
  "taxId" TEXT,
  "totalSpent" NUMERIC(12, 2) NOT NULL DEFAULT 0,
  "lastOrderDate" TIMESTAMPTZ,
  "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Address" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
  "label" TEXT,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT,
  "postalCode" TEXT,
  "country" TEXT NOT NULL,
  "phone" TEXT
);

CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "reference" TEXT NOT NULL UNIQUE,
  "customerId" TEXT NOT NULL REFERENCES "Customer"("id"),
  "shippingAddressId" TEXT NOT NULL REFERENCES "Address"("id"),
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "subtotal" NUMERIC(12, 2) NOT NULL DEFAULT 0,
  "shipping" NUMERIC(12, 2) NOT NULL DEFAULT 0,
  "totalAmount" NUMERIC(12, 2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "paymentProvider" TEXT NOT NULL,
  "paymentId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "productNameSnapshot" TEXT NOT NULL,
  "priceSnapshot" NUMERIC(12, 2) NOT NULL,
  "quantity" INT NOT NULL DEFAULT 1
);

-- RLS: public read for published catalog
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Collection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CollectionTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPostTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaticPage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaticPageTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalSeoSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalSeoTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MediaLibrary" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_product" ON "Product" FOR SELECT USING (true);
CREATE POLICY "public_read_product_translation" ON "ProductTranslation" FOR SELECT USING (true);
CREATE POLICY "public_read_product_image" ON "ProductImage" FOR SELECT USING (true);
CREATE POLICY "public_read_collection" ON "Collection" FOR SELECT USING (true);
CREATE POLICY "public_read_collection_translation" ON "CollectionTranslation" FOR SELECT USING (true);
CREATE POLICY "public_read_blog_published" ON "BlogPost" FOR SELECT USING (status = 'published');
CREATE POLICY "public_read_blog_translation" ON "BlogPostTranslation" FOR SELECT USING (true);
CREATE POLICY "public_read_static_page" ON "StaticPage" FOR SELECT USING (true);
CREATE POLICY "public_read_static_page_translation" ON "StaticPageTranslation" FOR SELECT USING (true);
CREATE POLICY "public_read_seo" ON "GlobalSeoSetting" FOR SELECT USING (true);
CREATE POLICY "public_read_seo_translation" ON "GlobalSeoTranslation" FOR SELECT USING (true);
CREATE POLICY "public_read_media" ON "MediaLibrary" FOR SELECT USING (true);

-- Seed admin (password: AtelierAtlas#2026 — change after first login)
INSERT INTO "User" ("id", "name", "email", "role")
VALUES ('atlas_admin_01', 'Atlas Admin', 'admin@atelier-atlas.com', 'ADMIN');

INSERT INTO "UserCredential" ("userId", "passwordHash")
VALUES ('atlas_admin_01', '$2b$12$bmHnYfO0.Ci5ToOyXRDseuvI0W4R3Xfmg9miWGXDpo0C6Lz99.AcC');

-- Collections
INSERT INTO "Collection" ("id", "systemSlug", "sortOrder") VALUES
  ('atlas_col_seating', 'seating', 1),
  ('atlas_col_tables', 'tables-consoles', 2),
  ('atlas_col_lighting', 'lighting', 3),
  ('atlas_col_mirrors', 'mirrors', 4),
  ('atlas_col_decor', 'decor', 5);

INSERT INTO "CollectionTranslation" ("collectionId", "language", "name", "slug") VALUES
  ('atlas_col_seating', 'en', 'Seating', 'seating'),
  ('atlas_col_seating', 'ar', 'مقاعد', 'seating'),
  ('atlas_col_tables', 'en', 'Tables & Consoles', 'tables-consoles'),
  ('atlas_col_tables', 'ar', 'طاولات وكونسولات', 'tables-consoles'),
  ('atlas_col_lighting', 'en', 'Lighting', 'lighting'),
  ('atlas_col_lighting', 'ar', 'إضاءة', 'lighting'),
  ('atlas_col_mirrors', 'en', 'Mirrors', 'mirrors'),
  ('atlas_col_mirrors', 'ar', 'مرايا', 'mirrors'),
  ('atlas_col_decor', 'en', 'Decor', 'decor'),
  ('atlas_col_decor', 'ar', 'ديكور', 'decor');

INSERT INTO "GlobalSeoSetting" ("id") VALUES ('seo_default');

INSERT INTO "GlobalSeoTranslation" ("globalSeoSettingId", "language", "siteName", "titleSuffix") VALUES
  ('seo_default', 'en', 'ATELIER ATLAS', 'ATELIER ATLAS'),
  ('seo_default', 'ar', 'أتيليه أطلس', 'أتيليه أطلس');

INSERT INTO "StaticPage" ("id", "systemName") VALUES
  ('sp_about', 'about'),
  ('sp_contact', 'contact'),
  ('sp_sur_mesure', 'sur-mesure');

INSERT INTO "StaticPageTranslation" ("staticPageId", "language", "slug", "h1") VALUES
  ('sp_about', 'en', 'about', 'About'),
  ('sp_about', 'ar', 'about', 'من نحن'),
  ('sp_contact', 'en', 'contact', 'Contact'),
  ('sp_contact', 'ar', 'contact', 'اتصل بنا'),
  ('sp_sur_mesure', 'en', 'sur-mesure', 'Sur-Mesure'),
  ('sp_sur_mesure', 'ar', 'sur-mesure', 'حسب الطلب');
