import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AboutHero } from "@/components/about/about-hero";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutLegacy } from "@/components/about/about-legacy";
import { AboutMaterials } from "@/components/about/about-materials";
import { AboutProcess } from "@/components/about/about-process";
import { AboutSustainability } from "@/components/about/about-sustainability";
import { AboutValuesCta } from "@/components/about/about-values-cta";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocale } from "@/lib/get-locale";
import { getPageSeo } from "@/actions/static-page.actions";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("about", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");

  return {
    title: t("about.title"),
    description: t("about.description"),
  };
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <AboutHero />
        <AboutIntro />
        <AboutProcess />
        <AboutLegacy />
        <AboutMaterials />
        <AboutSustainability />
        <AboutValuesCta />
      </main>
    </>
  );
}


