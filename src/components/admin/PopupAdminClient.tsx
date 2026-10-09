"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Save,
  Eye,
  Check,
  AlertCircle,
  Clock,
  Sliders,
  Layers,
  Globe,
  X,
  ArrowRight,
  Upload,
  ImagePlus,
  Trash2,
  Loader2,
} from "lucide-react";
import { savePopupConfig } from "@/actions/popup.actions";
import { uploadImageFile } from "@/lib/client-library-upload";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import type { PopupConfig } from "@/lib/popup-types";

interface PopupAdminClientProps {
  initialConfig: PopupConfig;
}

export function PopupAdminClient({ initialConfig }: PopupAdminClientProps) {
  const [config, setConfig] = useState<PopupConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "ar">("en");
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDirectUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    const file = files[0];
    setUploadingImage(true);
    try {
      const res = await uploadImageFile(file);
      if (res.success) {
        setConfig((prev) => ({ ...prev, image: res.url }));
        setStatusMessage({
          type: "success",
          text: "Image uploaded successfully!",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to upload image.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Error uploading image file.",
      });
    } finally {
      setUploadingImage(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await savePopupConfig(config);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "Popup settings saved successfully! Storefront updated.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to save popup settings.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while saving.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Live preview localized values
  const isPreviewAr = previewLanguage === "ar";
  const previewBadge = isPreviewAr
    ? config.badgeAr || config.badgeEn
    : config.badgeEn;
  const previewTitle = isPreviewAr
    ? config.titleAr || config.titleEn
    : config.titleEn;
  const previewDesc = isPreviewAr
    ? config.descriptionAr || config.descriptionEn
    : config.descriptionEn;
  const previewButton = isPreviewAr
    ? config.buttonTextAr || config.buttonTextEn
    : config.buttonTextEn;
  const previewDismiss = isPreviewAr
    ? config.dismissTextAr || config.dismissTextEn
    : config.dismissTextEn;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-300 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Promotional & Announcement Popup
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Control the luxury welcome modal and announcements on your storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Status Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              config.enabled
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-stone-200 text-stone-600 border border-stone-300"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                config.enabled ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
              }`}
            />
            {config.enabled ? "Active on Site" : "Disabled"}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-amber-500 disabled:opacity-50 transition-all active:scale-95"
          >
            <Save className="size-4" />
            {saving ? "Saving..." : "Save Popup"}
          </button>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-950/60 border-emerald-700/50 text-emerald-200"
              : "bg-red-950/60 border-red-700/50 text-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="size-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Form Left / Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Configuration Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* General & Behavior Card */}
          <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-5 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sliders className="size-4" />
              General Settings & Trigger Rules
            </h2>

            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900/80 border border-slate-700/80">
              <div>
                <label className="text-sm font-semibold text-white block">
                  Enable Popup on Storefront
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  When enabled, visitors will receive this modal according to your display rules.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="size-5 rounded border-slate-600 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delay seconds */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-amber-400" />
                  Trigger Delay (Seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={config.delaySeconds}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      delaySeconds: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Seconds to wait after page load before displaying.
                </p>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="size-3.5 text-amber-400" />
                  Display Frequency
                </label>
                <select
                  value={config.frequency}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      frequency: e.target.value as any,
                    }))
                  }
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="session">Once per Session (Recommended)</option>
                  <option value="weekly">Once every 7 days</option>
                  <option value="always">Always show (Testing only)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prevents annoying frequent visitors.
                </p>
              </div>
            </div>

            {/* Destination Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Button Destination Link
              </label>
              <input
                type="text"
                placeholder="/seating or /tables-consoles"
                value={config.buttonLink}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    buttonLink: e.target.value,
                  }))
                }
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              <label className="block text-xs font-semibold text-slate-300">
                Modal Image (Upload from PC or Select from Library)
              </label>

              {config.image ? (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                    <Image
                      src={config.image}
                      alt="Modal image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-medium truncate">
                      {config.image}
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">
                      ✓ Image ready for popup
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-600 transition-colors"
                    >
                      {uploadingImage ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Upload className="size-3.5" />
                      )}
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 text-xs font-medium text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 transition-colors"
                    >
                      <ImagePlus className="size-3.5" />
                      Library
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, image: "" }))}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-500 text-slate-400 hover:text-white transition-all cursor-pointer group"
                  >
                    {uploadingImage ? (
                      <Loader2 className="size-6 text-amber-400 animate-spin mb-2" />
                    ) : (
                      <Upload className="size-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-xs font-semibold text-slate-200">
                      {uploadingImage ? "Uploading..." : "Upload from Computer"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      PNG, JPG, WebP
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-500 text-slate-400 hover:text-white transition-all cursor-pointer group"
                  >
                    <ImagePlus className="size-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-200">
                      Choose from Media Library
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Browse studio assets
                    </span>
                  </button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleDirectUpload(e.target.files)}
              />
            </div>
          </div>

          {/* Bilingual Content Editor Card */}
          <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Globe className="size-4" />
                Popup Content & Translations
              </h2>

              {/* Lang Tabs */}
              <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === "en"
                      ? "bg-amber-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ar")}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    activeTab === "ar"
                      ? "bg-amber-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            {activeTab === "en" ? (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge / Eyebrow (English)
                  </label>
                  <input
                    type="text"
                    value={config.badgeEn}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        badgeEn: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={config.titleEn}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        titleEn: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description / Story (English)
                  </label>
                  <textarea
                    rows={3}
                    value={config.descriptionEn}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        descriptionEn: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Button Text (English)
                    </label>
                    <input
                      type="text"
                      value={config.buttonTextEn}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          buttonTextEn: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Dismiss Text (English)
                    </label>
                    <input
                      type="text"
                      value={config.dismissTextEn}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          dismissTextEn: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div dir="rtl" className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الشارة / النص العلوي (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={config.badgeAr}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        badgeAr: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    العنوان الرئيسي (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={config.titleAr}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        titleAr: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الوصف / نص العرض (بالعربية)
                  </label>
                  <textarea
                    rows={3}
                    value={config.descriptionAr}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        descriptionAr: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      نص الزر (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={config.buttonTextAr}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          buttonTextAr: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      نص الإغلاق / الرفض (بالعربية)
                    </label>
                    <input
                      type="text"
                      value={config.dismissTextAr}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          dismissTextAr: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Live Storefront Preview (5 Cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="size-3.5 text-amber-400" />
              Live Storefront Preview
            </h3>

            {/* Preview Language Toggle */}
            <div className="flex rounded-md bg-slate-800 p-0.5 border border-slate-700 text-[11px]">
              <button
                type="button"
                onClick={() => setPreviewLanguage("en")}
                className={`px-2 py-0.5 rounded transition-colors ${
                  previewLanguage === "en"
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setPreviewLanguage("ar")}
                className={`px-2 py-0.5 rounded transition-colors ${
                  previewLanguage === "ar"
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                AR
              </button>
            </div>
          </div>

          {/* Luxury Modal Mockup */}
          <div className="relative rounded-2xl bg-black/60 p-4 border border-slate-700 backdrop-blur shadow-2xl">
            <div
              dir={isPreviewAr ? "rtl" : "ltr"}
              className="relative w-full overflow-hidden rounded-xl bg-[#faf8f5] shadow-xl border border-black/10"
            >
              {/* Fake Close Button */}
              <div
                className={`absolute top-2.5 z-20 flex size-6 items-center justify-center rounded-full bg-white/90 text-atlas-charcoal shadow-sm ${
                  isPreviewAr ? "left-2.5" : "right-2.5"
                }`}
              >
                <X className="size-3" />
              </div>

              {/* Preview Image */}
              <div className="relative aspect-[16/9] w-full bg-[#eee7dd]">
                <Image
                  src={config.image || "/images/hero-home.png"}
                  alt="Preview"
                  fill
                  className="object-cover object-center"
                  sizes="400px"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {previewBadge && (
                  <div className="inline-flex items-center rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-900 mb-2 border border-amber-200/50">
                    <span>{previewBadge}</span>
                  </div>
                )}

                <h4 className="font-serif text-lg font-semibold leading-snug text-atlas-charcoal">
                  {previewTitle || "Your Popup Title"}
                </h4>

                <p className="mt-1.5 text-xs leading-relaxed text-atlas-charcoal/75">
                  {previewDesc || "Your promotional description and offer will appear here."}
                </p>

                <div className="mt-4 pt-1">
                  <div className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-atlas-charcoal px-3 py-2 text-xs font-semibold text-white shadow">
                    <span>{previewButton || "Shop Collection"}</span>
                    <ArrowRight className={`size-3 ${isPreviewAr ? "rotate-180" : ""}`} />
                  </div>

                  {previewDismiss && (
                    <span className="mt-2 block w-full text-center text-[10px] text-atlas-charcoal/60">
                      {previewDismiss}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => setConfig((prev) => ({ ...prev, image: url }))}
        title="Select Popup Modal Image"
      />
    </div>
  );
}
