"use client";

import { cn } from "cn";
import { ImagePlus, Loader2, Plus, Trash2, Wand2, X } from "lucide-react";
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
import {
  generateCombinations,
  generatePriceRowsFromGroups,
  type ProductOptionGroup,
  type ProductOptionsConfig,
  type ProductPriceRow,
} from "@/lib/product-options";
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
  const [optionGroups, setOptionGroups] = useState<ProductOptionGroup[]>(() => {
    if (product?.productOptions?.groups?.length) {
      return product.productOptions.groups;
    }
    return [
      {
        id: "group-1",
        name: "Save On Bundle",
        options: [],
      },
    ];
  });
  const [priceRows, setPriceRows] = useState<ProductPriceRow[]>(() => {
    if (product?.productOptions?.priceRows?.length) {
      return product.productOptions.priceRows;
    }
    return [];
  });
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

  const allAvailableOptions = useMemo(() => {
    return generateCombinations(optionGroups);
  }, [optionGroups]);

  const addOptionGroup = () => {
    setOptionGroups((prev) => [
      ...prev,
      {
        id: `group-${Date.now()}`,
        name: "",
        options: [],
      },
    ]);
  };

  const removeOptionGroup = (groupId: string) => {
    setOptionGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateGroupName = (groupId: string, name: string) => {
    setOptionGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name } : g)),
    );
  };

  const addOption = (groupId: string) => {
    setOptionGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, ""] } : g,
      ),
    );
  };

  const updateOption = (groupId: string, optIndex: number, value: string) => {
    setOptionGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const nextOpts = [...g.options];
        nextOpts[optIndex] = value;
        return { ...g, options: nextOpts };
      }),
    );
  };

  const removeOption = (groupId: string, optIndex: number) => {
    setOptionGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          options: g.options.filter((_, i) => i !== optIndex),
        };
      }),
    );
  };

  const handleGeneratePriceRows = () => {
    const generated = generatePriceRowsFromGroups(
      optionGroups,
      priceRows,
      priceUsd,
      stock,
      sku || "VAR",
    );
    if (generated.length === 0) {
      alert("Please add at least one option label before generating price rows.");
      return;
    }
    setPriceRows(generated);
  };

  const addPriceRow = () => {
    const fallbackOption = allAvailableOptions[0] || "";
    setPriceRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length}`,
        option: fallbackOption,
        priceUsd: Number(priceUsd) || 0,
        salePriceUsd: null,
        stock: Number(stock) || 0,
        sku: `${sku || "VAR"}-b${prev.length + 1}`,
      },
    ]);
  };

  const updatePriceRow = (
    index: number,
    field: keyof ProductPriceRow,
    value: unknown,
  ) => {
    setPriceRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removePriceRow = (index: number) => {
    setPriceRows((prev) => prev.filter((_, i) => i !== index));
  };

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
    setOptionGroups(
      product?.productOptions?.groups?.length
        ? product.productOptions.groups
        : [
            {
              id: "group-1",
              name: "Save On Bundle",
              options: [],
            },
          ],
    );
    setPriceRows(product?.productOptions?.priceRows || []);
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

        const hasOptions =
          optionGroups.some((g) => g.options.some((o) => o.trim().length > 0)) ||
          priceRows.length > 0;

        const productOptionsPayload: ProductOptionsConfig | null = hasOptions
          ? {
              groups: optionGroups
                .map((g) => ({
                  ...g,
                  name: g.name.trim(),
                  options: g.options.map((o) => o.trim()).filter(Boolean),
                }))
                .filter((g) => g.name || g.options.length > 0),
              priceRows: priceRows
                .map((r, i) => ({
                  id: r.id || `row-${i}`,
                  option: r.option.trim(),
                  priceUsd: Number(r.priceUsd) || 0,
                  salePriceUsd:
                    r.salePriceUsd != null && r.salePriceUsd !== ("" as unknown)
                      ? Number(r.salePriceUsd)
                      : null,
                  stock: Number(r.stock) || 0,
                  sku: (r.sku || "").trim(),
                }))
                .filter((r) => r.option.length > 0),
            }
          : null;

        const input: CreateProductInput = {
          collectionId,
          priceUsd: Number(priceUsd),
          sku,
          stock: Number(stock),
          material,
          swatches,
          attributes: {
            ...((product?.attributes as Record<string, unknown>) || {}),
            colorVariants: uploadedColorVariants,
            productOptions: productOptionsPayload,
          },
          productOptions: productOptionsPayload,
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
        <div className="mb-10 w-full max-w-5xl rounded-xl bg-white shadow-2xl">
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
                          src={
                            variant.image.startsWith("pending-upload:")
                              ? `data:${variant.image.split(":")[2] || "image/jpeg"};base64,${variant.image.split(":").slice(3).join(":")}`
                              : variant.image
                          }
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
                            ? `data:${url.split(":")[2] || "image/jpeg"};base64,${url.split(":").slice(3).join(":")}`
                            : url
                        }
                        alt=""
                        className="h-12 w-12 rounded object-cover bg-stone-100"
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

          {/* PRODUCT OPTIONS & BUNDLES */}
          <div className="border-t border-stone-200 px-6 py-6">
            <div className="rounded-2xl border border-[#96532b]/40 bg-[#fdfcfb] p-6 shadow-sm">
              {/* Header Badge */}
              <div className="inline-flex items-center rounded-full border border-[#96532b] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#96532b]">
                Product Options & Bundles
              </div>

              <p className="mt-2.5 text-xs text-stone-600">
                Configure Body Size and Save On Bundle dropdowns. Add option labels, generate combinations, then set a price for each row.
              </p>

              {/* Option Group Cards */}
              <div className="mt-5 space-y-4">
                {optionGroups.map((group, groupIdx) => (
                  <div
                    key={group.id || groupIdx}
                    className="rounded-xl border border-stone-200/90 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <Label className="text-xs font-semibold text-stone-700 min-w-[3.5rem]">
                        Label
                      </Label>
                      <Input
                        value={group.name}
                        onChange={(e) => updateGroupName(group.id, e.target.value)}
                        placeholder="e.g. Save On Bundle or Dimensions"
                        className="h-9 max-w-xs text-sm"
                      />
                      {optionGroups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOptionGroup(group.id)}
                          className="ml-auto inline-flex items-center gap-1 text-xs text-stone-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Remove group
                        </button>
                      )}
                    </div>

                    <p className="mt-4 mb-2 text-xs text-stone-500">
                      Options (shown as dropdown choices on product page)
                    </p>

                    <div className="space-y-2 max-w-md">
                      {group.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <Input
                            value={opt}
                            onChange={(e) =>
                              updateOption(group.id, optIdx, e.target.value)
                            }
                            placeholder="e.g. Faucet Only or 60 x 80 cm"
                            className="h-9 text-sm flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(group.id, optIdx)}
                            className="p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded hover:bg-stone-50"
                            title="Remove option"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(group.id)}
                        className="h-8 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        <Plus size={14} className="mr-1.5" /> Add option
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addOptionGroup}
                    className="h-8 text-xs text-stone-600 hover:text-stone-900"
                  >
                    <Plus size={14} className="mr-1.5" /> Add another option group (e.g. Body Size)
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-stone-200/60 pt-4">
                <button
                  type="button"
                  onClick={handleGeneratePriceRows}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#96532b] hover:text-[#743c1b] transition-colors"
                >
                  <Wand2 size={15} /> Generate bundle prices
                </button>
                <button
                  type="button"
                  onClick={addPriceRow}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#96532b] hover:text-[#743c1b] transition-colors"
                >
                  <Plus size={15} /> Add price row
                </button>
              </div>

              <p className="mt-3 text-xs text-stone-500">
                Set a price for each bundle row below, then save the product. Customers will see the bundle price on the shop page.
              </p>

              {/* Price Rows Table */}
              {priceRows.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-stone-200 bg-[#f8fafc] font-bold uppercase tracking-wider text-stone-600">
                        <tr>
                          <th className="px-4 py-3">BUNDLE</th>
                          <th className="px-4 py-3">PRICE (USD)</th>
                          <th className="px-4 py-3">SALE</th>
                          <th className="px-4 py-3">STOCK</th>
                          <th className="px-4 py-3">SKU</th>
                          <th className="w-12 px-3 py-3 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-sans">
                        {priceRows.map((row, idx) => (
                          <tr key={row.id || idx} className="hover:bg-stone-50/60 transition-colors">
                            <td className="p-3 min-w-[14rem]">
                              {allAvailableOptions.length > 0 ? (
                                <select
                                  value={row.option}
                                  onChange={(e) =>
                                    updatePriceRow(idx, "option", e.target.value)
                                  }
                                  className="h-9 w-full rounded-md border border-stone-200 bg-white px-2.5 text-xs focus:border-stone-400 focus:outline-none"
                                >
                                  {allAvailableOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                  {!allAvailableOptions.includes(row.option) && row.option && (
                                    <option value={row.option}>{row.option}</option>
                                  )}
                                </select>
                              ) : (
                                <Input
                                  value={row.option}
                                  onChange={(e) =>
                                    updatePriceRow(idx, "option", e.target.value)
                                  }
                                  placeholder="Option name"
                                  className="h-9 text-xs"
                                />
                              )}
                            </td>
                            <td className="p-3 w-32">
                              <Input
                                type="number"
                                min={0}
                                step="any"
                                value={row.priceUsd}
                                onChange={(e) =>
                                  updatePriceRow(
                                    idx,
                                    "priceUsd",
                                    Number(e.target.value),
                                  )
                                }
                                className="h-9 text-xs"
                              />
                            </td>
                            <td className="p-3 w-32">
                              <Input
                                type="number"
                                min={0}
                                step="any"
                                value={row.salePriceUsd ?? ""}
                                onChange={(e) =>
                                  updatePriceRow(
                                    idx,
                                    "salePriceUsd",
                                    e.target.value === ""
                                      ? null
                                      : Number(e.target.value),
                                  )
                                }
                                placeholder="—"
                                className="h-9 text-xs"
                              />
                            </td>
                            <td className="p-3 w-28">
                              <Input
                                type="number"
                                min={0}
                                value={row.stock}
                                onChange={(e) =>
                                  updatePriceRow(
                                    idx,
                                    "stock",
                                    Number(e.target.value),
                                  )
                                }
                                className="h-9 text-xs"
                              />
                            </td>
                            <td className="p-3 min-w-[9rem]">
                              <Input
                                value={row.sku}
                                onChange={(e) =>
                                  updatePriceRow(idx, "sku", e.target.value)
                                }
                                placeholder="VAR-b1"
                                className="h-9 text-xs"
                              />
                            </td>
                            <td className="p-3 text-center w-12">
                              <button
                                type="button"
                                onClick={() => removePriceRow(idx)}
                                className="p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded hover:bg-stone-100"
                                title="Delete row"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-stone-300 p-6 text-center text-xs text-stone-400">
                  No bundle or option price rows generated yet. Add options above and click &quot;Generate bundle prices&quot; or &quot;Add price row&quot;.
                </div>
              )}
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
