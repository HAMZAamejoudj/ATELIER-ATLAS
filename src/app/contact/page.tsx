import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactClient } from "@/components/contact/contact-client";
import { getContactSettings } from "@/actions/contact.actions";
import { getPageSeo } from "@/actions/static-page.actions";
import { getLocale } from "@/lib/get-locale";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("contact", locale);
  if (dbSeo?.title) {
    return {
      title: dbSeo.title,
      description: dbSeo.description || undefined,
    };
  }
  const t = await getTranslations("seo");

  return {
    title: t("contact.title"),
    description: t("contact.description"),
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const settings = await getContactSettings();

  return (
    <>
      <SiteHeader />
      <main id="form">
        <ContactHero />
        <ContactClient settings={settings} locale={locale} />
      </main>
    </>
  );
}
