"use server";

import { revalidateTag } from "next/cache";

import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { LanguageCode } from "@/types/product";

export interface BlogPostAdmin {
  id: string;
  topic: string;
  format: string;
  status: string;
  publishedAt: string | null;
  featuredImageUrl: string | null;
  authorName: string | null;
  readTimeMinutes: number;
  translations: {
    language: LanguageCode;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string[];
    metaTitle: string | null;
    metaDescription: string | null;
  }[];
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  publishedAt: string | null;
  featuredImageUrl: string | null;
  topic: string;
  format: string;
}

const postSelect = `
  *,
  translations:BlogPostTranslation(*)
`;

function parseBody(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((p) => typeof p === "string");
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListItem(post: any, lang: LanguageCode): BlogPostListItem {
  const translations = post.translations || [];
  const t =
    translations.find((x: { language: string }) => x.language === lang) ||
    translations.find((x: { language: string }) => x.language === "en") ||
    translations[0];
  return {
    id: post.id,
    title: t?.title || "",
    slug: t?.slug || "",
    excerpt: t?.excerpt,
    status: post.status,
    publishedAt: post.publishedAt,
    featuredImageUrl: post.featuredImageUrl,
    topic: post.topic,
    format: post.format,
  };
}

export async function getBlogPosts(
  admin = false,
  lang: LanguageCode = "en",
  limit?: number,
): Promise<BlogPostListItem[]> {
  let query = supabase.from("BlogPost").select(postSelect).order("createdAt", {
    ascending: false,
  });
  if (!admin) query = query.eq("status", "published");
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];
  return (data || []).map((post) => toListItem(post, lang));
}

export async function getBlogPostById(id: string): Promise<BlogPostAdmin | null> {
  const { data, error } = await supabaseAdmin
    .from("BlogPost")
    .select(postSelect)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const post = data as {
    id: string;
    topic: string;
    format: string;
    status: string;
    publishedAt: string | null;
    featuredImageUrl: string | null;
    authorName: string | null;
    readTimeMinutes: number;
    translations: {
      language: LanguageCode;
      title: string;
      slug: string;
      excerpt: string | null;
      body: unknown;
      metaTitle: string | null;
      metaDescription: string | null;
    }[];
  };

  const translations = (post.translations || []).map(
    (t: {
      language: LanguageCode;
      title: string;
      slug: string;
      excerpt: string | null;
      body: unknown;
      metaTitle: string | null;
      metaDescription: string | null;
    }) => ({
      language: t.language,
      title: t.title,
      slug: t.slug,
      excerpt: t.excerpt,
      body: parseBody(t.body),
      metaTitle: t.metaTitle,
      metaDescription: t.metaDescription,
    }),
  );

  return {
    id: post.id,
    topic: post.topic,
    format: post.format,
    status: post.status,
    publishedAt: post.publishedAt,
    featuredImageUrl: post.featuredImageUrl,
    authorName: post.authorName,
    readTimeMinutes: post.readTimeMinutes,
    translations,
  };
}

export async function isBlogSlugUnique(
  slug: string,
  language: LanguageCode,
  excludePostId?: string,
): Promise<boolean> {
  let query = supabaseAdmin
    .from("BlogPostTranslation")
    .select("blogPostId")
    .eq("slug", slug)
    .eq("language", language);
  if (excludePostId) {
    query = query.neq("blogPostId", excludePostId);
  }
  const { data } = await query.maybeSingle();
  return !data;
}

export async function saveBlogPost(input: {
  id?: string;
  topic: string;
  format: string;
  status: string;
  featuredImageUrl?: string;
  authorName?: string;
  readTimeMinutes?: number;
  translations: {
    language: LanguageCode;
    title: string;
    slug: string;
    excerpt?: string;
    body: string[];
    metaTitle?: string;
    metaDescription?: string;
  }[];
}) {
  await checkAdmin();

  const publishedAt =
    input.status === "published" ? new Date().toISOString() : null;

  const postPayload = {
    topic: input.topic,
    format: input.format,
    status: input.status,
    featuredImageUrl: input.featuredImageUrl || null,
    authorName: input.authorName || null,
    readTimeMinutes: input.readTimeMinutes ?? 5,
    publishedAt,
  };

  let postId = input.id;

  if (postId) {
    const { error } = await supabaseAdmin
      .from("BlogPost")
      .update(postPayload)
      .eq("id", postId);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { data, error } = await supabaseAdmin
      .from("BlogPost")
      .insert(postPayload)
      .select("id")
      .single();
    if (error || !data)
      return { success: false as const, error: error?.message || "Insert failed" };
    postId = data.id;
  }

  await supabaseAdmin
    .from("BlogPostTranslation")
    .delete()
    .eq("blogPostId", postId);

  const { error: trError } = await supabaseAdmin.from("BlogPostTranslation").insert(
    input.translations.map((t) => ({
      blogPostId: postId,
      language: t.language,
      title: t.title,
      slug: t.slug,
      excerpt: t.excerpt || null,
      body: t.body,
      metaTitle: t.metaTitle || null,
      metaDescription: t.metaDescription || null,
    })),
  );

  if (trError) return { success: false as const, error: trError.message };

  revalidateTag(CACHE_TAGS.BLOG, "default");
  return { success: true as const, id: postId };
}

export async function deleteBlogPost(id: string) {
  await checkAdmin();
  const { error } = await supabaseAdmin.from("BlogPost").delete().eq("id", id);
  if (error) return { success: false as const, error: error.message };
  revalidateTag(CACHE_TAGS.BLOG, "default");
  return { success: true as const };
}
