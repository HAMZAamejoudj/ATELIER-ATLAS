"use client";

import { useState, useTransition } from "react";
import { FolderTree, ImagePlus, Loader2, Save, Sparkles } from "lucide-react";

import { updateCollection } from "@/actions/collection.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { uploadPendingImageIfNeeded } from "@/lib/client-library-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CollectionDetailDB, LanguageCode } from "@/types/product";

interface Props {
  collections: CollectionDetailDB[];
}

export function CategoriesAdminClient({ collections }: Props) {
  const [selectedId, setSelectedId] = useState<string>(
    collections[0]?.id ?? "",
  );
  const [lang, setLang] = useState<LanguageCode>("en");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"en" | "ar">("en");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openImagePicker = (target: "en" | "ar") => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const selectedCol = collections.find((c) => c.id === selectedId);

  // Form State
  const [systemSlug, setSystemSlug] = useState(
    selectedCol?.systemSlug ?? "",
  );
  const [sortOrder, setSortOrder] = useState(selectedCol?.sortOrder ?? 0);

  const enTr = selectedCol?.translations.find((t) => t.language === "en");
  const arTr = selectedCol?.translations.find((t) => t.language === "ar");

  const [nameEn, setNameEn] = useState(enTr?.name ?? "");
  const [slugEn, setSlugEn] = useState(enTr?.slug ?? "");
  const [h1En, setH1En] = useState(enTr?.h1 ?? "");
  const [descEn, setDescEn] = useState(enTr?.description ?? "");
  const [metaTitleEn, setMetaTitleEn] = useState(enTr?.metaTitle ?? "");
  const [metaDescEn, setMetaDescEn] = useState(enTr?.metaDesc ?? "");
  const [keywordsEn, setKeywordsEn] = useState(enTr?.keywords ?? "");
  const [ogImageEn, setOgImageEn] = useState(enTr?.ogImage ?? "");

  const [nameAr, setNameAr] = useState(arTr?.name ?? "");
  const [slugAr, setSlugAr] = useState(arTr?.slug ?? "");
  const [h1Ar, setH1Ar] = useState(arTr?.h1 ?? "");
  const [descAr, setDescAr] = useState(arTr?.description ?? "");
  const [metaTitleAr, setMetaTitleAr] = useState(arTr?.metaTitle ?? "");
  const [metaDescAr, setMetaDescAr] = useState(arTr?.metaDesc ?? "");
  const [keywordsAr, setKeywordsAr] = useState(arTr?.keywords ?? "");
  const [ogImageAr, setOgImageAr] = useState(arTr?.ogImage ?? "");

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMessage(null);
    const col = collections.find((c) => c.id === id);
    if (!col) return;

    setSystemSlug(col.systemSlug);
    setSortOrder(col.sortOrder);

    const en = col.translations.find((t) => t.language === "en");
    const ar = col.translations.find((t) => t.language === "ar");

    setNameEn(en?.name ?? "");
    setSlugEn(en?.slug ?? col.systemSlug);
    setH1En(en?.h1 ?? "");
    setDescEn(en?.description ?? "");
    setMetaTitleEn(en?.metaTitle ?? "");
    setMetaDescEn(en?.metaDesc ?? "");
    setKeywordsEn(en?.keywords ?? "");
    setOgImageEn(en?.ogImage ?? "");

    setNameAr(ar?.name ?? "");
    setSlugAr(ar?.slug ?? col.systemSlug);
    setH1Ar(ar?.h1 ?? "");
    setDescAr(ar?.description ?? "");
    setMetaTitleAr(ar?.metaTitle ?? "");
    setMetaDescAr(ar?.metaDesc ?? "");
    setKeywordsAr(ar?.keywords ?? "");
    setOgImageAr(ar?.ogImage ?? "");
  };

  const handleSave = () => {
    if (!selectedId) return;
    setMessage(null);
    startTransition(async () => {
      try {
        const resolvedOgEn = ogImageEn
          ? await uploadPendingImageIfNeeded(ogImageEn)
          : null;
        const resolvedOgAr = ogImageAr
          ? await uploadPendingImageIfNeeded(ogImageAr)
          : null;

        if (resolvedOgEn !== ogImageEn) setOgImageEn(resolvedOgEn || "");
        if (resolvedOgAr !== ogImageAr) setOgImageAr(resolvedOgAr || "");

        const res = await updateCollection(selectedId, {
          systemSlug,
          sortOrder: Number(sortOrder),
          translations: [
            {
              language: "en",
              name: nameEn,
              slug: slugEn || systemSlug,
              h1: h1En || null,
              description: descEn || null,
              metaTitle: metaTitleEn || null,
              metaDesc: metaDescEn || null,
              keywords: keywordsEn || null,
              ogImage: resolvedOgEn,
            },
            {
              language: "ar",
              name: nameAr || nameEn,
              slug: slugAr || systemSlug,
              h1: h1Ar || null,
              description: descAr || null,
              metaTitle: metaTitleAr || null,
              metaDesc: metaDescAr || null,
              keywords: keywordsAr || null,
              ogImage: resolvedOgAr,
            },
          ],
        });

        if (res.success) {
          setMessage("Category and SEO settings saved successfully!");
        } else {
          setMessage(res.error || "Failed to save category");
        }
      } catch (err: any) {
        setMessage(err?.message || "Failed to save category");
      }
    });
  };

  return (
    <>
      <AdminHeader
        title="Categories & Collections"
        description="Manage main shop categories, titles, descriptions, and per-category SEO (EN / AR)"
      />

      <div className="p-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Categories Sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Shop Categories
            </h3>
            <div className="space-y-1.5">
              {collections.map((col) => {
                const en = col.translations.find((t) => t.language === "en");
                const ar = col.translations.find((t) => t.language === "ar");
                const isSelected = col.id === selectedId;

                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleSelect(col.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-amber-600 bg-amber-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {en?.name || col.systemSlug}
                      </p>
                      <p className="text-xs text-slate-500" dir="rtl">
                        {ar?.name}
                      </p>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600">
                      /{col.systemSlug}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  Editing {enTr?.name || systemSlug}
                </h2>
                <p className="text-xs text-slate-500">
                  Update category info, headings, descriptions, and SEO metadata
                </p>
              </div>

              {/* Language Switcher */}
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

            {/* General Settings */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
              <div>
                <Label className="text-xs">System Route / Slug</Label>
                <Input
                  value={systemSlug}
                  onChange={(e) => setSystemSlug(e.target.value)}
                  placeholder="e.g. seating, lighting"
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label className="text-xs">Display Order</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="mt-1 bg-white"
                />
              </div>
            </div>

            {/* Localized Content */}
            {lang === "en" ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>English Content & SEO</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category Display Name</Label>
                    <Input
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Seating"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Category H1 Title</Label>
                    <Input
                      value={h1En}
                      onChange={(e) => setH1En(e.target.value)}
                      placeholder="e.g. Handmade Moroccan Seating"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Category Description</Label>
                  <Textarea
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    rows={3}
                    placeholder="Short description shown at top of catalog or in metadata"
                    className="mt-1"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    SEO & Social Sharing (EN)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>SEO Meta Title</Label>
                      <Input
                        value={metaTitleEn}
                        onChange={(e) => setMetaTitleEn(e.target.value)}
                        placeholder="Page title for Google"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Keywords (comma separated)</Label>
                      <Input
                        value={keywordsEn}
                        onChange={(e) => setKeywordsEn(e.target.value)}
                        placeholder="moroccan seating, handmade stools"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>SEO Meta Description</Label>
                    <Textarea
                      value={metaDescEn}
                      onChange={(e) => setMetaDescEn(e.target.value)}
                      rows={2}
                      placeholder="Google search results snippet"
                      className="mt-1"
                    />
                  </div>
                  <AdminImagePicker
                    label="OG Social Share Image"
                    description="Preview image when this category link is shared on social platforms"
                    value={ogImageEn}
                    onChange={setOgImageEn}
                    onOpenPicker={() => openImagePicker("en")}
                    aspect="video"
                    placeholder="Select OG share image (EN)"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4" dir="rtl">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>المحتوى والـ SEO بالعربية</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>اسم القسم المعروض</Label>
                    <Input
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="مثلاً: المقاعد"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>عنوان H1 للقسم</Label>
                    <Input
                      value={h1Ar}
                      onChange={(e) => setH1Ar(e.target.value)}
                      placeholder="مثلاً: مقاعد وأرائك مغربية يدوية"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>وصف القسم</Label>
                  <Textarea
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    rows={3}
                    placeholder="وصف مختصر للقسم يظهر في الواجهة أو محركات البحث"
                    className="mt-1"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    تهيئة محركات البحث ومواقع التواصل (AR)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>عنوان الـ SEO (Meta Title)</Label>
                      <Input
                        value={metaTitleAr}
                        onChange={(e) => setMetaTitleAr(e.target.value)}
                        placeholder="عنوان الصفحة لمحركات البحث"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>الكلمات المفتاحية (مفصولة بفواصل)</Label>
                      <Input
                        value={keywordsAr}
                        onChange={(e) => setKeywordsAr(e.target.value)}
                        placeholder="أثاث مغربي, كراسي ترافرتين"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>وصف الـ SEO (Meta Description)</Label>
                    <Textarea
                      value={metaDescAr}
                      onChange={(e) => setMetaDescAr(e.target.value)}
                      rows={2}
                      placeholder="الوصف الذي يظهر في نتائج بحث جوجل"
                      className="mt-1"
                    />
                  </div>
                  <AdminImagePicker
                    label="صورة المشاركة لمواقع التواصل (OG Image)"
                    description="الصورة التي تظهر عند مشاركة رابط هذا القسم على منصات التواصل"
                    value={ogImageAr}
                    onChange={setOgImageAr}
                    onOpenPicker={() => openImagePicker("ar")}
                    aspect="video"
                    placeholder="اختيار صورة المشاركة (بالعربية)"
                    dir="rtl"
                  />
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

            {/* Action Buttons */}
            <div className="flex justify-end border-t border-slate-100 pt-5">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="bg-amber-700 hover:bg-amber-800 text-white gap-2 px-6"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Category & SEO
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          if (pickerTarget === "en") setOgImageEn(url);
          else setOgImageAr(url);
        }}
        title={pickerTarget === "en" ? "Select Category OG Image (EN)" : "اختيار صورة المشاركة (بالعربية)"}
      />
    </>
  );
}
