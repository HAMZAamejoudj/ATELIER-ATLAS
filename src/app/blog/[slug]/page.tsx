import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/blog/blog-article";
import { SiteHeader } from "@/components/layout/site-header";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
} from "@/lib/blog-data";
import { getLocale } from "@/lib/get-locale";

type BlogPostPageProps = PageProps<"/blog/[slug]">;

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getBlogPostBySlug(slug, locale);
  if (!post) {
    return { title: "Article not found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getBlogPostBySlug(slug, locale);
  if (!post) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main>
        <BlogArticle post={post} />
      </main>
    </>
  );
}
