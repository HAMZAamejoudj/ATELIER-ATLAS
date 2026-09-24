import { BestSellers } from "@/components/home/best-sellers";
import { BrandTestimonial } from "@/components/home/brand-testimonial";
import { CraftLegacyArchive } from "@/components/home/craft-legacy-archive";
import { HomeHero } from "@/components/home/home-hero";
import { MaterialLibrary } from "@/components/home/material-library";
import { RoomsWithPurpose } from "@/components/home/rooms-with-purpose";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { TradeAndJournal } from "@/components/home/trade-and-journal";
import { SiteHeader } from "@/components/layout/site-header";

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
