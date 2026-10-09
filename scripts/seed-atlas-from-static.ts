/**
 * One-shot seed: static *-data.ts → Supabase
 * Usage: npx tsx scripts/seed-atlas-from-static.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { BLOG_POSTS } from "../src/lib/blog-data";
import { BLOG_POSTS_AR } from "../src/lib/blog-posts-ar";
import {
  getDecorFilterValues,
  getLightingFilterValues,
  getMirrorsFilterValues,
  getSeatingFilterValues,
  getTablesFilterValues,
} from "../src/lib/catalog-infer-filters";
import { DECOR_PRODUCTS } from "../src/lib/decor-data";
import { LIGHTING_PRODUCTS } from "../src/lib/lighting-data";
import { MIRRORS_PRODUCTS } from "../src/lib/mirrors-data";
import { translateProductName } from "../src/lib/product-names-ar";
import { SEATING_PRODUCTS } from "../src/lib/seating-data";
import { slugify } from "../src/lib/slugify";
import { TABLES_PRODUCTS } from "../src/lib/tables-data";

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const key = m[1].trim();
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

const COLLECTION_IDS: Record<string, string> = {
  seating: "atlas_col_seating",
  "tables-consoles": "atlas_col_tables",
  lighting: "atlas_col_lighting",
  mirrors: "atlas_col_mirrors",
  decor: "atlas_col_decor",
};

type StaticProduct = {
  name: string;
  priceUsd: number;
  image: string;
  material: string;
  swatches: string[];
  badge?: "BEST SELLER" | "NEW";
};

function badgeToEnum(badge?: string) {
  if (badge === "BEST SELLER") return "BEST_SELLER";
  if (badge === "NEW") return "NEW";
  return null;
}

function inferFacets(
  collection: string,
  product: StaticProduct,
): Record<string, string> {
  const base = {
    name: product.name,
    priceUsd: product.priceUsd,
    swatches: product.swatches,
    material: product.material,
    badge: product.badge,
  };
  switch (collection) {
    case "seating":
      return getSeatingFilterValues(base);
    case "tables-consoles":
      return getTablesFilterValues(base);
    case "lighting":
      return getLightingFilterValues(base);
    case "mirrors":
      return getMirrorsFilterValues(base);
    case "decor":
      return getDecorFilterValues(base);
    default:
      return {};
  }
}

async function seedProducts(
  collection: string,
  products: StaticProduct[],
) {
  const collectionId = COLLECTION_IDS[collection];
  let sort = 0;
  for (const p of products) {
    sort += 1;
    const slug = slugify(p.name);
    const nameAr = translateProductName(p.name, "ar");
    const facets = inferFacets(collection, p);
    const { price: _price, ...filterFacets } = facets as Record<string, string>;

    const { data: product, error } = await supabase
      .from("Product")
      .insert({
        collectionId,
        priceUsd: p.priceUsd,
        sku: slug,
        stock: 10,
        material: p.material,
        swatches: p.swatches,
        badge: badgeToEnum(p.badge),
        filterFacets,
        isAvailable: true,
        isFeatured: false,
        sortOrder: sort,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Product insert failed", p.name, error.message);
      continue;
    }

    await supabase.from("ProductTranslation").insert([
      {
        productId: product.id,
        language: "en",
        name: p.name,
        slug,
      },
      {
        productId: product.id,
        language: "ar",
        name: nameAr,
        slug: slug,
      },
    ]);

    await supabase.from("ProductImage").insert({
      productId: product.id,
      url: p.image,
      isPrimary: true,
      sortOrder: 0,
    });

    console.log("Product:", p.name);
  }
}

async function seedBlog() {
  for (const post of BLOG_POSTS) {
    const ar = BLOG_POSTS_AR[post.slug];
    const { data: row, error } = await supabase
      .from("BlogPost")
      .insert({
        topic: post.topic,
        format: post.format,
        status: "published",
        publishedAt: new Date(post.date).toISOString(),
        featuredImageUrl: post.image,
        authorName: post.author,
        readTimeMinutes: post.readTimeMinutes,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Blog insert failed", post.slug, error.message);
      continue;
    }

    await supabase.from("BlogPostTranslation").insert([
      {
        blogPostId: row.id,
        language: "en",
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
      },
      {
        blogPostId: row.id,
        language: "ar",
        title: ar?.title || post.title,
        slug: post.slug,
        excerpt: ar?.excerpt || post.excerpt,
        body: ar?.body || post.body,
      },
    ]);
    console.log("Blog:", post.slug);
  }
}

async function main() {
  console.log("Seeding products…");
  await seedProducts("seating", SEATING_PRODUCTS);
  await seedProducts("tables-consoles", TABLES_PRODUCTS);
  await seedProducts("lighting", LIGHTING_PRODUCTS);
  await seedProducts("mirrors", MIRRORS_PRODUCTS);
  await seedProducts("decor", DECOR_PRODUCTS);
  console.log("Seeding blog…");
  await seedBlog();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
