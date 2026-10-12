"use client";

import { cn } from "cn";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  createProduct,
  isSlugUnique,
  updateProduct,
} from "@/actions/product.actions";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFilterFacetsForCollection } from "@/lib/admin-filter-facets";
import { uploadPendingImageIfNeeded } from "@/lib/client-library-upload";
import { formatMadPreview, formatUsd } from "@/lib/format-admin";
import {
  MAX_PRODUCT_IMAGES,
  productToImageSlots,
} from "@/lib/admin-product-images";
import {
  colorVariantsToSwatches,
  swatchesToColorVariants,
  type ProductColorVariant,
} from "@/lib/product-color-variants";
import { slugify } from "@/lib/slugify";
import type {
  CollectionDB,
  CreateProductInput,
  ProductBadge,
  ShopProductDB,
} from "@/types/product";

type LangTab = "en" | "ar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: ShopProductDB | null;
  collections: CollectionDB[];
  onSaved?: () => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  collections,
  onSaved,
}: Props) {
  const [tab, setTab] = useState<LangTab>("en");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerKind, setPickerKind] = useState<"gallery" | "variant">("gallery");
  const [pickerIndex, setPickerIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [collectionId, setCollectionId] = useState(
    product?.collectionId || collections[0]?.id || "",
  );
  const [priceUsd, setPriceUsd] = useState(product?.priceUsd ?? 0);
  const [sku, setSku] = useState(product?.sku ?? "");
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [material, setMaterial] = useState(product?.material ?? "");
  const [colorVariants, setColorVariants] = useState<ProductColorVariant[]>(
    () =>
      product?.colorVariants?.length
        ? product.colorVariants
        : product?.swatches?.length
          ? swatchesToColorVariants(product.swatches, product.image)
          : [],
  );
  const [badge, setBadge] = useState<ProductBadge | "">(product?.badge ?? "");
  const [filterFacets, setFilterFacets] = useState<Record<string, string>>(
    product?.filterFacets ?? {},
  );
  const [isFeatured, setIsFeatured] = useState(product?.featured ?? false);
  const [isAvailable, setIsAvailable] = useState<boolean>(
    product?.isAvailable ?? true,
  );
  const [productImages, setProductImages] = useState<string[]>(() =>
    productToImageSlots(product),
  );

  const [nameEn, setNameEn] = useState(product?.title ?? "");
  const [slugEn, setSlugEn] = useState(product?.slug ?? "");
  const [shortEn, setShortEn] = useState(product?.shortDescription ?? "");
  const [descEn, setDescEn] = useState(product?.description ?? "");
  const [metaTitleEn, setMetaTitleEn] = useState(product?.metaTitle ?? "");
  const [metaDescEn, setMetaDescEn] = useState(product?.metaDesc ?? "");

  const [nameAr, setNameAr] = useState(product?.nameAr ?? "");
  const [slugAr, setSlugAr] = useState(product?.slugAr ?? "");
  const [shortAr, setShortAr] = useState(product?.shortDescriptionAr ?? "");
  const [descAr, setDescAr] = useState(product?.descriptionAr ?? "");
  const [metaTitleAr, setMetaTitleAr] = useState(product?.metaTitleAr ?? "");
  const [metaDescAr, setMetaDescAr] = useState(product?.metaDescAr ?? "");

  const collectionSlug = useMemo(
    () => collections.find((c) => c.id === collectionId)?.systemSlug ?? "",
    [collections, collectionId],
  );

  const facetFields = useMemo(
    () => getFilterFacetsForCollection(collectionSlug),
    [collectionSlug],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (!product && nameEn && !slugEn) {
      setSlugEn(slugify(nameEn));
    }
  }, [isOpen, nameEn, product, slugEn]);

  useEffect(() => {
    if (!isOpen) return;
    setProductImages(productToImageSlots(product));
    setColorVariants(
      product?.colorVariants?.length
        ? product.colorVariants
        : product?.swatches?.length
          ? swatchesToColorVariants(product.swatches, product.image)
          : [],
    );
  }, [isOpen, product]);

  if (!isOpen) return null;

  const openGalleryPicker = (index: number) => {
    setPickerKind("gallery");
    setPickerIndex(index);
    setPickerOpen(true);
  };

  const openVariantPicker = (index: number) => {
    setPickerKind("variant");
    setPickerIndex(index);
    setPickerOpen(true);
  };

  const applyImage = (url: string) => {
    if (pickerKind === "gallery") {
      setProductImages((prev) => {
        const next = [...prev];
        next[pickerIndex] = url;
        return next;
      });
      return;
    }
    setColorVariants((prev) => {
      const next = [...prev];
      next[pickerIndex] = { ...next[pickerIndex], image: url };
      return next;
    });
  };

  const addColorVariant = () => {
    const fallback =
      productImages.find(Boolean) || product?.image || "";
    setColorVariants((prev) => [
      ...prev,
      { name: "", hex: "#E8E4DF", image: fallback },
    ]);
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        const uploadedImages = await Promise.all(
          productImages.map((url) =>
            url ? uploadPendingImageIfNeeded(url) : Promise.resolve(""),
          ),
        );
        const uploadedColorVariants = await Promise.all(
          colorVariants.map(async (variant) => ({
            ...variant,
            image: variant.image
              ? await uploadPendingImageIfNeeded(variant.image)
              : uploadedImages[0] || "",
          })),
        );
        const swatches = colorVariantsToSwatches(uploadedColorVariants);

        const finalSlugEn = slugEn || slugify(nameEn);
        const finalSlugAr = slugAr || slugify(nameAr || nameEn);

        if (!(await isSlugUnique(finalSlugEn, "en", product?.id))) {
          setError("English slug already in use");
          return;
        }
        if (!(await isSlugUnique(finalSlugAr, "ar", product?.id))) {
          setError("Arabic slug already in use");
          return;
        }

        const input: CreateProductInput = {
          collectionId,
          priceUsd: Number(priceUsd),
          sku,
          stock: Number(stock),
          material,
          swatches,
          attributes: { colorVariants: uploadedColorVariants },
          badge: badge || null,
          filterFacets,
          isFeatured,
          isAvailable,
          productImages: uploadedImages.map((url) => url || null),
          mainImage: uploadedImages[0] || undefined,
          detailImage1: uploadedImages[1] || null,
          detailImage2: uploadedImages[2] || null,
          detailImage3: uploadedImages[3] || null,
          translations: [
            {
              language: "en",
              name: nameEn,
              slug: finalSlugEn,
              shortDescription: shortEn,
              description: descEn,
              metaTitle: metaTitleEn,
              metaDesc: metaDescEn,
            },
            {
              language: "ar",
              name: nameAr || nameEn,
              slug: finalSlugAr,
              shortDescription: shortAr,
              description: descAr,
              metaTitle: metaTitleAr,
              metaDesc: metaDescAr,
            },
          ],
        };

        const result = product
          ? await updateProduct(product.id, input)
          : await createProduct(input);

        if (!result.success) {
          setError(result.error || "Save failed");
          return;
        }
        onSaved?.();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  const showBadge =
    collectionSlug === "seating" || collectionSlug === "tables-consoles";

  return (
    <>
      <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
        <div className="mb-10 w-full max-w-4xl rounded-xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="font-serif text-xl">
              {product ? "Edit product" : "New product"}
            </h2>
            <button type="button" onClick={onClose} aria-label="Close">
              <X size={22} />
            </button>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Collection</Label>
                <select
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(Number(e.target.value))}
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    {formatUsd(priceUsd)} · AR: {formatMadPreview(priceUsd)}
                  </p>
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Material</Label>
                  <Input
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Travertine +2"
                  />
                </div>
              </div>

              {showBadge && (
                <div>
                  <Label>Badge</Label>
                  <select
                    className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                    value={badge}
                    onChange={(e) =>
                      setBadge(e.target.value as ProductBadge | "")
                    }
                  >
                    <option value="">None</option>
                    <option value="BEST_SELLER">Best seller</option>
                    <option value="NEW">New</option>
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <Label>Color options (swatch → image)</Label>
                    <p className="mt-0.5 text-xs text-stone-500">
                      Like Darzen: each color shows its own photo on the
                      storefront when clicked.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addColorVariant}
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add color
                  </Button>
                </div>
                <div className="mt-3 space-y-2">
                  {colorVariants.map((variant, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-2 rounded-lg border p-2"
                    >
                      <input
                        type="color"
                        value={variant.hex}
                        onChange={(e) => {
                          const next = [...colorVariants];
                          next[i] = { ...next[i], hex: e.target.value };
                          setColorVariants(next);
                        }}
                        className="h-9 w-10 shrink-0 cursor-pointer rounded border"
                        aria-label={`Color ${i + 1}`}
                      />
                      <Input
                        placeholder="Name (e.g. Beige)"
                        value={variant.name}
                        onChange={(e) => {
                          const next = [...colorVariants];
                          next[i] = { ...next[i], name: e.target.value };
                          setColorVariants(next);
                        }}
                        className="min-w-[7rem] flex-1"
                      />
                      {variant.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={variant.image}
                          alt=""
                          className="h-10 w-10 rounded object-cover bg-stone-100"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-stone-100 text-stone-400">
                          <ImagePlus size={16} />
                        </div>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openVariantPicker(i)}
                      >
                        Photo
                      </Button>
                      <button
                        type="button"
                        onClick={() =>
                          setColorVariants(colorVariants.filter((_, j) => j !== i))
                        }
                        className="text-stone-400 hover:text-red-600"
                        aria-label="Remove color"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {facetFields.length > 0 && (
                <div className="space-y-2 rounded-lg border border-stone-100 bg-stone-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Catalog filters
                  </p>
                  {facetFields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-xs">{field.label}</Label>
                      <select
                        className="mt-0.5 w-full rounded-lg border border-stone-200 px-2 py-1.5 text-sm"
                        value={filterFacets[field.key] ?? ""}
                        onChange={(e) =>
                          setFilterFacets({
                            ...filterFacets,
                            [field.key]: e.target.value,
                          })
                        }
                      >
                        <option value="">—</option>
                        {field.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                  />
                  Available
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 border-b border-stone-100 pb-2">
                {(["en", "ar"] as LangTab[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setTab(l)}
                    className={cn(
                      "rounded-md px-3 py-1 text-sm font-medium",
                      tab === l
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:bg-stone-100",
                    )}
                  >
                    {l === "en" ? "English" : "Arabic"}
                  </button>
                ))}
              </div>

              {tab === "en" ? (
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={slugEn}
                      onChange={(e) => setSlugEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Short description</Label>
                    <Textarea
                      value={shortEn}
                      onChange={(e) => setShortEn(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Meta title</Label>
                    <Input
                      value={metaTitleEn}
                      onChange={(e) => setMetaTitleEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Meta description</Label>
                    <Textarea
                      value={metaDescEn}
                      onChange={(e) => setMetaDescEn(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3" dir="rtl">
                  <div>
                    <Label>الاسم</Label>
                    <Input
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={slugAr}
                      onChange={(e) => setSlugAr(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label>وصف قصير</Label>
                    <Textarea
                      value={shortAr}
                      onChange={(e) => setShortAr(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={descAr}
                      onChange={(e) => setDescAr(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Meta title</Label>
                    <Input
                      value={metaTitleAr}
                      onChange={(e) => setMetaTitleAr(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Meta description</Label>
                    <Textarea
                      value={metaDescAr}
                      onChange={(e) => setMetaDescAr(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t pt-4">
                <Label>Images ({MAX_PRODUCT_IMAGES} max)</Label>
                <p className="text-xs text-stone-500">
                  Image 1 is the main catalog photo. Additional images appear on
                  the product page gallery.
                </p>
                {productImages.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border p-2"
                  >
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          url.startsWith("pending-upload:")
                            ? `data:image/jpeg;base64,`
                            : url
                        }
                        alt=""
                        className="h-12 w-12 rounded object-cover bg-stone-100"
                        onError={(e) => {
                          if (url.startsWith("pending-upload:")) {
                            const file = url.split(":").slice(3).join(":");
                            (e.target as HTMLImageElement).src = `data:image/jpeg;base64,${file}`;
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-stone-100 text-stone-400">
                        <ImagePlus size={18} />
                      </div>
                    )}
                    <span className="flex-1 text-sm text-stone-600">
                      {index === 0 ? "Main" : `Image ${index + 1}`}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openGalleryPicker(index)}
                    >
                      Choose
                    </Button>
                    {url ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-stone-500"
                        onClick={() =>
                          setProductImages((prev) => {
                            const next = [...prev];
                            next[index] = "";
                            return next;
                          })
                        }
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="px-6 pb-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save product"
              )}
            </Button>
          </div>
        </div>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={applyImage}
      />
    </>
  );
}
