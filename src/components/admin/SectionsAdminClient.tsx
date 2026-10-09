"use client";

import { useState, useTransition } from "react";
import {
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Sliders,
  Sparkles,
  Trash2,
  Tv,
} from "lucide-react";

import { saveSectionsConfig } from "@/actions/sections.actions";
import type {
  AllSectionsConfig,
  HeroSlideItem,
  SubcategoryItem,
} from "@/lib/sections-helpers";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SectionTab =
  | "home"
  | "seating"
  | "tables"
  | "lighting"
  | "mirrors"
  | "decor";

interface Props {
  initialConfig: AllSectionsConfig;
}

export function SectionsAdminClient({ initialConfig }: Props) {
  const [activeTab, setActiveTab] = useState<SectionTab>("home");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [config, setConfig] = useState<AllSectionsConfig>(initialConfig);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<
    ((url: string) => void) | null
  >(null);

  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openPicker = (cb: (url: string) => void) => {
    setPickerCallback(() => cb);
    setPickerOpen(true);
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await saveSectionsConfig(config);
      if (res.success) {
        setMessage("Sections and hero sliders saved successfully!");
      } else {
        setMessage(res.error || "Failed to save sections");
      }
    });
  };

  // Helper mutators for category sections
  const updateSlide = (
    cat: "seating" | "tables" | "lighting" | "mirrors" | "decor",
    index: number,
    field: keyof HeroSlideItem,
    value: any,
  ) => {
    setConfig((prev) => {
      const slides = [...prev[cat].heroSlides];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, [cat]: { ...prev[cat], heroSlides: slides } };
    });
  };

  const addSlide = (
    cat: "seating" | "tables" | "lighting" | "mirrors" | "decor",
  ) => {
    const newSlide: HeroSlideItem = {
      name: "New Featured Piece",
      priceUsd: 1200,
      image: "/images/products/product-lenoir-sofa.png",
      heroImage: "/images/hero-home.png",
      altEn: "Featured product",
      altAr: "منتج مميز",
      descriptionEn: "Handcrafted piece shaped with care.",
      descriptionAr: "قطعة مصنوعة يدوياً بعناية فائقة.",
    };
    setConfig((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        heroSlides: [...prev[cat].heroSlides, newSlide],
      },
    }));
  };

  const removeSlide = (
    cat: "seating" | "tables" | "lighting" | "mirrors" | "decor",
    index: number,
  ) => {
    setConfig((prev) => {
      const slides = prev[cat].heroSlides.filter((_, i) => i !== index);
      return { ...prev, [cat]: { ...prev[cat], heroSlides: slides } };
    });
  };

  const updateSubcategory = (
    cat: "seating" | "tables" | "lighting" | "mirrors" | "decor",
    index: number,
    field: keyof SubcategoryItem,
    value: any,
  ) => {
    setConfig((prev) => {
      const items = [...prev[cat].subcategories];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [cat]: { ...prev[cat], subcategories: items } };
    });
  };

  const addSubcategory = (
    cat: "seating" | "tables" | "lighting" | "mirrors" | "decor",
  ) => {
    const newItem: SubcategoryItem = {
      href: `/${cat}#new-type`,
      labelEn: "New Type",
      labelAr: "نوع جديد",
      image: "/images/products/product-vale-chair.png",
      altEn: "Subcategory item",
      altAr: "عنصر فرعي",
    };
    setConfig((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        subcategories: [...prev[cat].subcategories, newItem],
      },
    }));
  };

  const removeSubcategory = (
    cat: "seating" | "tables" | "lighting" | "mirrors" | "decor",
    index: number,
  ) => {
    setConfig((prev) => {
      const items = prev[cat].subcategories.filter((_, i) => i !== index);
      return { ...prev, [cat]: { ...prev[cat], subcategories: items } };
    });
  };

  return (
    <>
      <AdminHeader
        title="Hero Sections & Sliders"
        description="Manage the main homepage hero banner, category carousels, and subcategory navigation chips"
      />

      <div className="p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "home", label: "Home Hero" },
              { id: "seating", label: "Seating Hero & Types" },
              { id: "tables", label: "Tables Hero & Types" },
              { id: "lighting", label: "Lighting Hero & Types" },
              { id: "mirrors", label: "Mirrors Hero & Types" },
              { id: "decor", label: "Decor Hero & Types" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SectionTab)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                lang === "en"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                lang === "ar"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              العربية (AR)
            </button>
          </div>
        </div>

        {/* Home Hero Tab */}
        {activeTab === "home" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Homepage Hero Banner
              </h3>
              <p className="text-xs text-slate-500">
                The primary banner shown at the top of the homepage
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {lang === "en" ? (
                  <>
                    <div>
                      <Label>Hero Headline Title (EN)</Label>
                      <Input
                        value={config.homeHero.titleEn}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            homeHero: {
                              ...prev.homeHero,
                              titleEn: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Call to Action Button Text (EN)</Label>
                      <Input
                        value={config.homeHero.ctaTextEn}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            homeHero: {
                              ...prev.homeHero,
                              ctaTextEn: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Image Alt Text (EN)</Label>
                      <Input
                        value={config.homeHero.imageAltEn}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            homeHero: {
                              ...prev.homeHero,
                              imageAltEn: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4" dir="rtl">
                    <div>
                      <Label>عنوان البانر الرئيسي (AR)</Label>
                      <Input
                        value={config.homeHero.titleAr}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            homeHero: {
                              ...prev.homeHero,
                              titleAr: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>نص زر التفاعل CTA (AR)</Label>
                      <Input
                        value={config.homeHero.ctaTextAr}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            homeHero: {
                              ...prev.homeHero,
                              ctaTextAr: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>النص البديل للصورة (AR)</Label>
                      <Input
                        value={config.homeHero.imageAltAr}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            homeHero: {
                              ...prev.homeHero,
                              imageAltAr: e.target.value,
                            },
                          }))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Button Destination URL</Label>
                  <Input
                    value={config.homeHero.ctaLink}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        homeHero: {
                          ...prev.homeHero,
                          ctaLink: e.target.value,
                        },
                      }))
                    }
                    className="mt-1"
                    placeholder="/seating"
                  />
                </div>
              </div>

              {/* Background Image */}
              <div className="space-y-3">
                <Label>Hero Background Image</Label>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.homeHero.image}
                    alt="Hero background preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={config.homeHero.image}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        homeHero: {
                          ...prev.homeHero,
                          image: e.target.value,
                        },
                      }))
                    }
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openPicker((url) =>
                        setConfig((prev) => ({
                          ...prev,
                          homeHero: { ...prev.homeHero, image: url },
                        })),
                      )
                    }
                  >
                    <ImagePlus size={16} className="mr-1" /> Choose
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Hero & Subcategories Tabs */}
        {activeTab !== "home" && (
          <div className="space-y-8">
            {/* Featured Hero Carousel Slides */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Category Hero Carousel Slides ({activeTab.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Featured products shown in the auto-playing top slider on
                    the /{activeTab} page
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSlide(activeTab)}
                  className="gap-1.5"
                >
                  <Plus size={16} /> Add Slide
                </Button>
              </div>

              <div className="space-y-6">
                {config[activeTab].heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                        Slide #{idx + 1}: {slide.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSlide(activeTab, idx)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Slide"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-xs">Product Name</Label>
                        <Input
                          value={slide.name}
                          onChange={(e) =>
                            updateSlide(activeTab, idx, "name", e.target.value)
                          }
                          className="mt-1 bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price (USD)</Label>
                        <Input
                          type="number"
                          value={slide.priceUsd}
                          onChange={(e) =>
                            updateSlide(
                              activeTab,
                              idx,
                              "priceUsd",
                              Number(e.target.value),
                            )
                          }
                          className="mt-1 bg-white"
                        />
                      </div>
                    </div>

                    {lang === "en" ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">
                            Description Paragraph (EN)
                          </Label>
                          <Textarea
                            value={slide.descriptionEn}
                            onChange={(e) =>
                              updateSlide(
                                activeTab,
                                idx,
                                "descriptionEn",
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="mt-1 bg-white text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Image Alt (EN)</Label>
                          <Input
                            value={slide.altEn}
                            onChange={(e) =>
                              updateSlide(
                                activeTab,
                                idx,
                                "altEn",
                                e.target.value,
                              )
                            }
                            className="mt-1 bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3" dir="rtl">
                        <div>
                          <Label className="text-xs">
                            وصف السلايد بالعربية (AR)
                          </Label>
                          <Textarea
                            value={slide.descriptionAr}
                            onChange={(e) =>
                              updateSlide(
                                activeTab,
                                idx,
                                "descriptionAr",
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="mt-1 bg-white text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">
                            النص البديل للصورة (AR)
                          </Label>
                          <Input
                            value={slide.altAr}
                            onChange={(e) =>
                              updateSlide(
                                activeTab,
                                idx,
                                "altAr",
                                e.target.value,
                              )
                            }
                            className="mt-1 bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Images */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200/60">
                      <div>
                        <Label className="text-xs">
                          Hero Large Background Image
                        </Label>
                        <div className="mt-1 flex gap-2 items-center">
                          <Input
                            value={slide.heroImage}
                            onChange={(e) =>
                              updateSlide(
                                activeTab,
                                idx,
                                "heroImage",
                                e.target.value,
                              )
                            }
                            className="bg-white text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              openPicker((url) =>
                                updateSlide(activeTab, idx, "heroImage", url),
                              )
                            }
                          >
                            Choose
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">
                          Bottom Thumbnail Image
                        </Label>
                        <div className="mt-1 flex gap-2 items-center">
                          <Input
                            value={slide.image}
                            onChange={(e) =>
                              updateSlide(
                                activeTab,
                                idx,
                                "image",
                                e.target.value,
                              )
                            }
                            className="bg-white text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              openPicker((url) =>
                                updateSlide(activeTab, idx, "image", url),
                              )
                            }
                          >
                            Choose
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcategories (Product Types) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Subcategories / Types Chips ({activeTab.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Navigation cards for subcategories (e.g. Sofas, Loveseats,
                    Pendants, Arched Mirrors...)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSubcategory(activeTab)}
                  className="gap-1.5"
                >
                  <Plus size={16} /> Add Subcategory
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {config[activeTab].subcategories.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        #{idx + 1} {item.labelEn}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubcategory(activeTab, idx)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[11px]">Label (EN)</Label>
                        <Input
                          value={item.labelEn}
                          onChange={(e) =>
                            updateSubcategory(
                              activeTab,
                              idx,
                              "labelEn",
                              e.target.value,
                            )
                          }
                          className="bg-white text-xs"
                        />
                      </div>
                      <div dir="rtl">
                        <Label className="text-[11px]">الاسم (AR)</Label>
                        <Input
                          value={item.labelAr}
                          onChange={(e) =>
                            updateSubcategory(
                              activeTab,
                              idx,
                              "labelAr",
                              e.target.value,
                            )
                          }
                          className="bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[11px]">Link (href)</Label>
                      <Input
                        value={item.href}
                        onChange={(e) =>
                          updateSubcategory(
                            activeTab,
                            idx,
                            "href",
                            e.target.value,
                          )
                        }
                        className="bg-white text-xs"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px]">Image URL</Label>
                      <div className="flex gap-1.5 mt-1 items-center">
                        <Input
                          value={item.image}
                          onChange={(e) =>
                            updateSubcategory(
                              activeTab,
                              idx,
                              "image",
                              e.target.value,
                            )
                          }
                          className="bg-white text-xs"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openPicker((url) =>
                              updateSubcategory(
                                activeTab,
                                idx,
                                "image",
                                url,
                              ),
                            )
                          }
                        >
                          Choose
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Alert */}
        {message && (
          <div
            className={`rounded-xl p-4 text-sm font-medium ${
              message.includes("success")
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Sticky Save Bar */}
        <div className="sticky bottom-6 z-40 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Changes will be reflected immediately across the storefront.
          </p>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="bg-amber-700 hover:bg-amber-800 text-white gap-2 px-6"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={16} /> Save All Sections & Sliders
              </>
            )}
          </Button>
        </div>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setPickerCallback(null);
        }}
        onSelect={(url) => {
          if (pickerCallback) pickerCallback(url);
        }}
      />
    </>
  );
}
