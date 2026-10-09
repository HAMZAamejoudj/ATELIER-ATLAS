import { getCollections } from "@/actions/collection.actions";
import { getProducts } from "@/actions/product.actions";
import { ProductsPageClient } from "@/components/admin/ProductsPageClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let collections: Awaited<ReturnType<typeof getCollections>> = [];

  try {
    const [productResult, cols] = await Promise.all([
      getProducts({ limit: 500 }),
      getCollections("en"),
    ]);
    products = productResult.products;
    collections = cols;
  } catch {
    /* env */
  }

  return (
    <ProductsPageClient
      initialProducts={products}
      collections={collections}
    />
  );
}
