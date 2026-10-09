import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { formatBlogTopicDate, getBlogLatestPosts } from "@/lib/blog-data";
import { getLocale } from "@/lib/get-locale";

export async function BlogLatestGrid() {
  const locale = await getLocale();
  const t = await getTranslations("blog.list");
  const posts = getBlogLatestPosts(locale);

  return (
    <section
      className="bg-atlas-cream py-12 sm:py-14 lg:py-16"
      aria-labelledby="blog-latest-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <h2
          id="blog-latest-heading"
          className="font-serif text-xl font-semibold text-atlas-charcoal sm:text-2xl"
        >
          {t("latestHeading")}
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#f0ebe3]">
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <p className="mt-4 text-[10px] font-semibold tracking-[0.12em] text-atlas-charcoal/50">
                    {formatBlogTopicDate(post, locale)}
                  </p>
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-atlas-charcoal group-hover:opacity-80">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-atlas-charcoal/72">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal/70 group-hover:opacity-60">
                    {t("readMore")}
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
