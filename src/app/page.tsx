import type { Metadata } from "next";

import { getPageSeo } from "@/actions/static-page.actions";
import { BestSellers } from "@/components/home/best-sellers";
import { BrandTestimonial } from "@/components/home/brand-testimonial";
import { CraftLegacyArchive } from "@/components/home/craft-legacy-archive";
import { HomeHero } from "@/components/home/home-hero";
import { MaterialLibrary } from "@/components/home/material-library";
import { RoomsWithPurpose } from "@/components/home/rooms-with-purpose";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { TradeAndJournal } from "@/components/home/trade-and-journal";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocale } from "@/lib/get-locale";
import type { LanguageCode } from "@/types/product";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as LanguageCode;
  const dbSeo = await getPageSeo("home", locale);

  return {
    title: dbSeo?.title || "ATELIER ATLAS — Handmade Moroccan Furniture",
    description:
      dbSeo?.description ||
      "Sculptural handmade Moroccan furniture in travertine, solid wood, and hammered metal — made to order in a Marrakech workshop.",
  };
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero />
        <ShopByCategory />
        <CraftLegacyArchive />
        <BestSellers />
        <RoomsWithPurpose />
        <MaterialLibrary />
        <BrandTestimonial />
        <TradeAndJournal />
      </main>
    </>
  );
}
