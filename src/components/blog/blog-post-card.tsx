"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  formatBlogDate,
  translateBlogTopic,
  type BlogPost,
} from "@/lib/blog-data";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type BlogPostCardProps = {
  post: BlogPost;
  variant?: "featured" | "grid" | "related";
  priority?: boolean;
};

export function BlogPostCard({
  post,
  variant = "grid",
  priority = false,
}: BlogPostCardProps) {
  const locale = useLocale() as Locale;
  const tList = useTranslations("blog.list");
  const tArticle = useTranslations("blog.article");

  const topicLabel = translateBlogTopic(post.topic, locale);
  const minRead = tArticle("minRead", { minutes: post.readTimeMinutes });

  if (variant === "featured") {
    return (
      <article className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <Link
          href={`/blog/${post.slug}`}
          className="group grid overflow-hidden border border-atlas-charcoal/12 bg-white lg:grid-cols-12"
        >
          <div className="relative aspect-[16/10] bg-[#f0ebe3] lg:col-span-7 lg:aspect-auto lg:min-h-[26rem] xl:min-h-[30rem]">
            <Image
              src={post.image}
              alt={post.alt}
              fill
              priority={priority}
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
          <div className="flex flex-col justify-center bg-atlas-cream px-6 py-10 sm:px-10 sm:py-12 lg:col-span-5 lg:px-12 lg:py-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal/55">
              {tList("featuredEyebrow")}
            </p>
            <span className="mt-4 inline-flex w-fit border border-atlas-charcoal/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-atlas-charcoal">
              {topicLabel}
            </span>
            <h2 className="mt-5 font-serif text-[1.75rem] font-semibold leading-[1.12] text-atlas-charcoal transition-opacity group-hover:opacity-80 sm:text-[2rem] lg:text-[2.15rem]">
              {post.title}
            </h2>
            <p className="mt-4 font-serif text-base leading-relaxed text-atlas-charcoal/80">
              {post.excerpt}
            </p>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-atlas-charcoal/50">
              {formatBlogDate(post.date, locale)} · {minRead}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-atlas-charcoal">
              {tList("readStory")}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "related") {
    return (
      <article className="h-full">
        <Link
          href={`/blog/${post.slug}`}
          className="group flex h-full flex-col overflow-hidden border border-atlas-charcoal/10 bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(26,22,20,0.06)]"
        >
          <div className="relative aspect-[5/4] shrink-0 overflow-hidden bg-[#f0ebe3]">
            <Image
              src={post.image}
              alt={post.alt}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal/50">
              {topicLabel}
            </span>
            <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-atlas-charcoal group-hover:opacity-80">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-atlas-charcoal/70">
              {post.excerpt}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group flex h-full flex-col overflow-hidden border border-atlas-charcoal/10 bg-white",
          "transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(26,22,20,0.08)]",
        )}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ebe3] sm:aspect-[3/4]">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
        </div>
        <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal/55">
              {topicLabel}
            </span>
            <span className="shrink-0 text-[10px] font-medium tabular-nums text-atlas-charcoal/45">
              {minRead}
            </span>
          </div>
          <h2 className="mt-3 font-serif text-xl font-semibold leading-[1.2] text-atlas-charcoal transition-opacity group-hover:opacity-75 sm:text-[1.35rem]">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 flex-1 font-serif text-sm leading-relaxed text-atlas-charcoal/72">
            {post.excerpt}
          </p>
          <p className="mt-5 border-t border-atlas-charcoal/10 pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal/45">
            {formatBlogDate(post.date, locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}
