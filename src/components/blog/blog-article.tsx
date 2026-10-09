import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { isHtmlBlogBody } from "@/lib/blog-body";
import {
  formatBlogDate,
  formatBlogKicker,
  getAllBlogPosts,
  type BlogPost,
} from "@/lib/blog-data";
import { getLocale } from "@/lib/get-locale";

import { BlogPostCard } from "./blog-post-card";

type BlogArticleProps = {
  post: BlogPost;
};

export async function BlogArticle({ post }: BlogArticleProps) {
  const locale = await getLocale();
  const t = await getTranslations("blog.article");

  const related = getAllBlogPosts(locale)
    .filter((p) => p.slug !== post.slug && p.topic === post.topic)
    .slice(0, 3);
  const fallbackRelated = getAllBlogPosts(locale)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  const relatedPosts = related.length >= 2 ? related : fallbackRelated;

  const [lead, ...restBody] = post.body;
  const htmlBody = isHtmlBlogBody(post.body) ? post.body[0] : null;

  return (
    <article>
      <header className="relative min-h-[32rem] overflow-hidden sm:min-h-[36rem] lg:min-h-[42rem]">
        <Image
          src={post.image}
          alt={post.alt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[inherit] max-w-[1600px] flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3 opacity-50" aria-hidden />
                <Link href="/blog" className="hover:text-white">
                  {t("breadcrumbJournal")}
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3 opacity-50" aria-hidden />
                <span className="line-clamp-1 font-medium text-white" aria-current="page">
                  {post.title}
                </span>
              </li>
            </ol>
          </nav>

          <span className="inline-flex w-fit border border-white/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/95">
            {formatBlogKicker(post, locale)}
          </span>
          <h1 className="mt-5 max-w-4xl font-serif text-[2rem] font-semibold leading-[1.08] text-white sm:text-[2.65rem] lg:text-[3.15rem]">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-white/90 sm:text-xl">
            {post.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            <span>{formatBlogDate(post.date, locale)}</span>
            <span aria-hidden>·</span>
            <span>{t("minRead", { minutes: post.readTimeMinutes })}</span>
            <span aria-hidden>·</span>
            <span className="normal-case tracking-normal">
              {t("byAuthor", { author: post.author })}
            </span>
          </div>
        </div>
      </header>

      <div className="bg-atlas-cream">
        <div className="mx-auto max-w-[42rem] px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
          {htmlBody ? (
            <div
              className="prose prose-stone max-w-none font-serif text-atlas-charcoal/88 prose-p:leading-[1.85] prose-headings:font-serif"
              dangerouslySetInnerHTML={{ __html: htmlBody }}
            />
          ) : (
            <>
              {lead ? (
                <p className="font-serif text-xl leading-[1.65] text-atlas-charcoal sm:text-[1.35rem]">
                  {lead}
                </p>
              ) : null}
              <div className="mt-8 space-y-6 border-t border-atlas-charcoal/10 pt-8 font-serif text-base leading-[1.85] text-atlas-charcoal/88 sm:text-[17px]">
                {restBody.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </>
          )}

          <div className="mt-14 flex flex-col gap-6 border-t border-atlas-charcoal/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-atlas-charcoal transition-opacity hover:opacity-60"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              {t("backToJournal")}
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-atlas-charcoal/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-colors hover:bg-atlas-charcoal/5"
            >
              {t("moreStories")}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 ? (
        <aside
          className="border-t border-atlas-charcoal/10 bg-[#f9f8f3] py-12 sm:py-14 lg:py-16"
          aria-labelledby="related-posts-heading"
        >
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2
                id="related-posts-heading"
                className="font-serif text-xl font-semibold text-atlas-charcoal sm:text-2xl"
              >
                {t("continueReading")}
              </h2>
              <Link
                href="/blog"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal/60 hover:text-atlas-charcoal"
              >
                {t("viewAll")}
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {relatedPosts.map((relatedPost) => (
                <li key={relatedPost.slug}>
                  <BlogPostCard post={relatedPost} variant="related" />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </article>
  );
}
