"use client";

import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import {
  getBlogPostById,
  isBlogSlugUnique,
  saveBlogPost,
} from "@/actions/blog.actions";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { SimpleTiptapEditor } from "@/components/admin/SimpleTiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BlogPostFormat, BlogTopic } from "@/lib/blog-data";
import {
  bodyBlocksToEditorHtml,
  editorHtmlToBodyBlocks,
} from "@/lib/blog-body";
import { uploadPendingImageIfNeeded } from "@/lib/client-library-upload";
import { resolveMediaLibraryUrl } from "@/lib/media-library-url";
import { slugify } from "@/lib/utils";

const TOPICS: BlogTopic[] = [
  "Craft",
  "Materials",
  "Spaces",
  "People",
  "Ideas",
  "Travel",
  "Interiors",
];
const FORMATS: BlogPostFormat[] = ["Story", "Interview", "Essay"];

const UKFlag = () => (
  <svg
    viewBox="0 0 60 30"
    className="mr-2 inline h-3.5 w-5 shrink-0 rounded border border-slate-200 shadow-sm"
  >
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const ARFlag = () => (
  <svg
    viewBox="0 0 3 2"
    className="mr-2 inline h-3.5 w-5 shrink-0 rounded border border-slate-200 shadow-sm"
  >
    <rect width="3" height="2" fill="#C1272D" />
    <polygon points="1.5,0.35 1.62,0.75 2.05,0.75 1.72,1 1.85,1.42 1.5,1.15 1.15,1.42 1.28,1 0.95,0.75 1.38,0.75" fill="#006233" />
  </svg>
);

function getCounterStyle(current: number, min: number, max: number) {
  if (current === 0) return "text-slate-400";
  if (current > max) return "text-red-500 font-semibold";
  if (current >= min && current <= max) return "text-emerald-600 font-semibold";
  return "text-amber-600";
}

export function BlogPostForm({
  postId,
  onClose,
  onSaved,
}: {
  postId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);

  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [format, setFormat] = useState<string>(FORMATS[0]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("ATELIER ATLAS");
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);

  const [titleEn, setTitleEn] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [metaTitleEn, setMetaTitleEn] = useState("");
  const [metaDescEn, setMetaDescEn] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [slugAr, setSlugAr] = useState("");
  const [excerptAr, setExcerptAr] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [metaTitleAr, setMetaTitleAr] = useState("");
  const [metaDescAr, setMetaDescAr] = useState("");

  const [slugEnStatus, setSlugEnStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >(postId ? "valid" : "idle");
  const [slugArStatus, setSlugArStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >(postId ? "valid" : "idle");

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const post = await getBlogPostById(postId);
      if (!post) {
        setError("Post not found");
        setLoading(false);
        return;
      }
      setTopic(post.topic);
      setFormat(post.format);
      setFeaturedImageUrl(post.featuredImageUrl || "");
      setAuthorName(post.authorName || "ATELIER ATLAS");
      setReadTimeMinutes(post.readTimeMinutes);
      const en = post.translations.find((t) => t.language === "en");
      const ar = post.translations.find((t) => t.language === "ar");
      if (en) {
        setTitleEn(en.title);
        setSlugEn(en.slug);
        setExcerptEn(en.excerpt || "");
        setContentEn(bodyBlocksToEditorHtml(en.body));
        setMetaTitleEn(en.metaTitle || "");
        setMetaDescEn(en.metaDescription || "");
      }
      if (ar) {
        setTitleAr(ar.title);
        setSlugAr(ar.slug);
        setExcerptAr(ar.excerpt || "");
        setContentAr(bodyBlocksToEditorHtml(ar.body));
        setMetaTitleAr(ar.metaTitle || "");
        setMetaDescAr(ar.metaDescription || "");
      }
      setLoading(false);
    })();
  }, [postId]);

  const checkSlug = async (slug: string, lang: "en" | "ar") => {
    if (!slug || slug.length < 2) {
      if (lang === "ar") setSlugArStatus("idle");
      else setSlugEnStatus("idle");
      return;
    }
    if (lang === "ar") setSlugArStatus("checking");
    else setSlugEnStatus("checking");

    const ok = await isBlogSlugUnique(slug, lang, postId ?? undefined);
    if (lang === "ar") setSlugArStatus(ok ? "valid" : "invalid");
    else setSlugEnStatus(ok ? "valid" : "invalid");
  };

  const handleSave = (status: "draft" | "published") => {
    if (slugEnStatus === "invalid" || slugArStatus === "invalid") {
      setError("One of the web URLs (slugs) is already in use.");
      return;
    }
    if (!titleEn.trim()) {
      setError("English title is required.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const image = await uploadPendingImageIfNeeded(featuredImageUrl);
        const enSlug = slugEn || slugify(titleEn);
        const arSlug = slugAr || slugify(titleAr || titleEn);
        const result = await saveBlogPost({
          id: postId || undefined,
          topic,
          format,
          status,
          featuredImageUrl: image,
          authorName,
          readTimeMinutes,
          translations: [
            {
              language: "en",
              title: titleEn,
              slug: enSlug,
              excerpt: excerptEn,
              body: editorHtmlToBodyBlocks(contentEn),
              metaTitle: metaTitleEn,
              metaDescription: metaDescEn,
            },
            {
              language: "ar",
              title: titleAr || titleEn,
              slug: arSlug,
              excerpt: excerptAr,
              body: editorHtmlToBodyBlocks(contentAr),
              metaTitle: metaTitleAr,
              metaDescription: metaDescAr,
            },
          ],
        });
        if (!result.success) {
          setError(result.error || "Save failed");
          return;
        }
        onSaved();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  const previewSrc = featuredImageUrl
    ? resolveMediaLibraryUrl({
        url: featuredImageUrl,
        storagePath: featuredImageUrl,
      })
    : "";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-xl font-bold text-amber-900">
            {postId ? "Edit Blog Post" : "New Blog Post"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleSave("draft")}
            className="border-slate-200 hover:bg-slate-50"
          >
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button
            type="button"
            className="bg-amber-800 text-white hover:bg-amber-900"
            disabled={isPending}
            onClick={() => handleSave("published")}
          >
            {isPending ? "Saving…" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <div className="flex-1 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Tabs defaultValue="en">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-lg border border-slate-200 bg-white p-1">
              <TabsTrigger
                value="en"
                className="flex items-center justify-center rounded-md font-semibold text-slate-600 transition-all duration-200 data-[state=active]:bg-amber-800 data-[state=active]:text-white"
              >
                <UKFlag /> English Content
              </TabsTrigger>
              <TabsTrigger
                value="ar"
                className="flex items-center justify-center rounded-md font-semibold text-slate-600 transition-all duration-200 data-[state=active]:bg-amber-800 data-[state=active]:text-white"
              >
                <ARFlag /> المحتوى العربي
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="en"
              className="mt-4 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <Label className="text-sm font-semibold text-slate-800">Post Title</Label>
                <Input
                  className="mt-1.5 focus-visible:border-amber-600 focus-visible:ring-amber-600"
                  placeholder="e.g. Heirloom craft in a slower world"
                  value={titleEn}
                  onChange={(e) => {
                    const title = e.target.value;
                    setTitleEn(title);
                    const slugVal = slugEn || slugify(title);
                    if (!slugEn) setSlugEn(slugVal);
                    checkSlug(slugEn || slugVal, "en");
                  }}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-800">Web Address (Slug)</Label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={slugEn}
                      onChange={(e) => {
                        const slug = slugify(e.target.value);
                        setSlugEn(slug);
                        checkSlug(slug, "en");
                      }}
                      placeholder="heirloom-craft-slower-world"
                      className={`focus-visible:ring-amber-600 ${
                        slugEnStatus === "valid"
                          ? "border-green-500"
                          : slugEnStatus === "invalid"
                            ? "border-red-500"
                            : ""
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {slugEnStatus === "checking" && (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      )}
                      {slugEnStatus === "valid" && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    title="Regenerate slug from title"
                    className="border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      const slug = slugify(titleEn);
                      setSlugEn(slug);
                      checkSlug(slug, "en");
                    }}
                  >
                    <Wand2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-800">Short Summary / Excerpt</Label>
                <textarea
                  className="mt-1.5 h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="Brief preview for listing cards…"
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-800">Article Content</Label>
                <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-200">
                  <SimpleTiptapEditor
                    content={contentEn}
                    onChange={setContentEn}
                    minHeight={280}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="ar"
              dir="rtl"
              className="mt-4 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <Label className="text-sm font-semibold text-slate-800">عنوان المقال</Label>
                <Input
                  className="mt-1.5 focus-visible:border-amber-600 focus-visible:ring-amber-600"
                  placeholder="عنوان بالعربية"
                  value={titleAr}
                  onChange={(e) => {
                    const title = e.target.value;
                    setTitleAr(title);
                    const slugVal = slugAr || slugify(title);
                    if (!slugAr && title) setSlugAr(slugVal);
                    if (slugAr || title) checkSlug(slugAr || slugVal, "ar");
                  }}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-800">رابط المقال (Slug)</Label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      dir="ltr"
                      className={`focus-visible:ring-amber-600 ${
                        slugArStatus === "valid"
                          ? "border-green-500"
                          : slugArStatus === "invalid"
                            ? "border-red-500"
                            : ""
                      }`}
                      value={slugAr}
                      onChange={(e) => {
                        const slug = slugify(e.target.value);
                        setSlugAr(slug);
                        checkSlug(slug, "ar");
                      }}
                      placeholder="slug-ar"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {slugArStatus === "checking" && (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      )}
                      {slugArStatus === "valid" && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    title="Regenerate from Arabic title"
                    className="border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      const slug = slugify(titleAr || titleEn);
                      setSlugAr(slug);
                      checkSlug(slug, "ar");
                    }}
                  >
                    <Wand2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-800">مقتطف قصير</Label>
                <textarea
                  className="mt-1.5 h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  value={excerptAr}
                  onChange={(e) => setExcerptAr(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-800">محتوى المقال</Label>
                <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-200">
                  <SimpleTiptapEditor
                    content={contentAr}
                    onChange={setContentAr}
                    minHeight={280}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-slate-800">Post settings</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-600">Topic</Label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Format</Label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Author</Label>
                <Input
                  className="mt-1 text-sm"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Read time (minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  className="mt-1 text-sm"
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(Number(e.target.value) || 5)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-bold text-slate-800">Featured Image</h3>
            <p className="mb-3 text-xs text-slate-400">Main cover image for the post.</p>
            {previewSrc ? (
              <div className="group relative mb-3 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="aspect-video w-full object-cover"
                />
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => setFeaturedImageUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-500 shadow transition-all hover:bg-white hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-6 text-slate-500 transition-all duration-200 hover:border-amber-800 hover:bg-amber-50/10 hover:text-amber-800"
            >
              <ImagePlus className="mb-1.5 h-6 w-6 stroke-1.5" />
              <span className="text-xs font-semibold">
                {featuredImageUrl ? "Change Image" : "Select Image"}
              </span>
            </button>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <UKFlag /> SEO (English)
              </h3>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">Search Title</Label>
                <span className={`text-[10px] ${getCounterStyle(metaTitleEn.length, 50, 60)}`}>
                  {metaTitleEn.length}/60
                </span>
              </div>
              <Input
                className="text-xs focus-visible:border-amber-600 focus-visible:ring-amber-600"
                value={metaTitleEn}
                onChange={(e) => setMetaTitleEn(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">Search Description</Label>
                <span className={`text-[10px] ${getCounterStyle(metaDescEn.length, 120, 160)}`}>
                  {metaDescEn.length}/160
                </span>
              </div>
              <textarea
                className="h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                value={metaDescEn}
                onChange={(e) => setMetaDescEn(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <ARFlag /> SEO (Arabic)
              </h3>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">عنوان البحث</Label>
                <span className={`text-[10px] ${getCounterStyle(metaTitleAr.length, 50, 60)}`}>
                  {metaTitleAr.length}/60
                </span>
              </div>
              <Input
                className="text-xs focus-visible:border-amber-600 focus-visible:ring-amber-600"
                value={metaTitleAr}
                onChange={(e) => setMetaTitleAr(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">وصف البحث</Label>
                <span className={`text-[10px] ${getCounterStyle(metaDescAr.length, 120, 160)}`}>
                  {metaDescAr.length}/160
                </span>
              </div>
              <textarea
                className="h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                value={metaDescAr}
                onChange={(e) => setMetaDescAr(e.target.value)}
              />
            </div>
          </div>
        </aside>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setFeaturedImageUrl}
        title="Choose featured image"
      />
    </div>
  );
}
