import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";



import { SiteHeader } from "@/components/layout/site-header";

import { WishlistPageContent } from "@/components/wishlist/wishlist-page-content";



export async function generateMetadata(): Promise<Metadata> {

  const t = await getTranslations("seo");

  return {

    title: t("wishlist.title"),

    description: t("wishlist.description"),

  };

}



export default function WishlistPage() {

  return (

    <>

      <SiteHeader />

      <main>

        <WishlistPageContent />

      </main>

    </>

  );

}


