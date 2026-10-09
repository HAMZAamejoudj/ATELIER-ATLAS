import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getLocale } from "@/lib/get-locale";

export async function MirrorsJournal() {
  const locale = await getLocale();
  const t = await getTranslations("mirrors.journal");
  const articles = getAllBlogPosts(locale).slice(0, 3);

  return (
    <section
      className="border-t border-atlas-charcoal/10 bg-[#f9f8f3] py-12 sm:py-14 lg:py-16"
      aria-labelledby="mirrors-journal-heading"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="mirrors-journal-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-atlas-charcoal"
            >
              {t("heading")}
            </h2>
            <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-atlas-charcoal/85">
              {t("description")}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-charcoal transition-opacity hover:opacity-60"
          >
            {t("cta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {articles.map((article) => (
            <li key={article.slug}>
              <BlogPostCard post={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
