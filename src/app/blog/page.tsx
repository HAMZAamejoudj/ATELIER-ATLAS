import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BlogFeaturedHero } from "@/components/blog/blog-featured-hero";
import { BlogFilterBar } from "@/components/blog/blog-filter-bar";
import { BlogLatestGrid } from "@/components/blog/blog-latest-grid";
import { BlogMakers } from "@/components/blog/blog-makers";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";
import { BlogSpotlight } from "@/components/blog/blog-spotlight";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("blog", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");

  return {
    title: t("blog.title"),
    description: t("blog.description"),
  };
}

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <BlogFeaturedHero />
        <BlogFilterBar />
        <BlogLatestGrid />
        <BlogMakers />
        <BlogSpotlight />
        <BlogNewsletter />
      </main>
    </>
  );
}


