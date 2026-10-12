import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProducts } from "@/actions/product.actions";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocale } from "@/lib/get-locale";
import { isLocale, type Locale } from "@/lib/locale";
import {
  resolveProductDetail,
  resolveRelatedProducts,
} from "@/lib/resolve-product-detail";
import { getAllStaticProductSlugs } from "@/lib/storefront-product-registry";

type ProductPageProps = PageProps<"/products/[slug]">;

export async function generateStaticParams() {
  const staticSlugs = getAllStaticProductSlugs();
  const { products } = await getProducts({ limit: 500 });
  const slugs = new Set<string>(staticSlugs);
  for (const product of products) {
    if (product.slug) slugs.add(product.slug);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await resolveProductDetail(slug, locale);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const rawLocale = await getLocale();
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  const product = await resolveProductDetail(slug, locale);
  if (!product) {
    notFound();
  }

  const related = await resolveRelatedProducts(product, locale);

  return (
    <>
      <SiteHeader />
      <main>
        <ProductDetailView
          product={product}
          related={related}
          locale={locale}
        />
      </main>
    </>
  );
}
