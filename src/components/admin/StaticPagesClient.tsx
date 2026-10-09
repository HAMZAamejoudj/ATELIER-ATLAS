"use client";

import { useState, useTransition } from "react";

import { updateStaticPageTranslation } from "@/actions/static-page.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PageRow = {
  id: string;
  systemName: string;
  translations: {
    language: string;
    slug: string;
    h1: string | null;
    description: string | null;
    metaTitle: string | null;
    metaDesc: string | null;
  }[];
};

export function StaticPagesClient({ pages }: { pages: PageRow[] }) {
  const [selected, setSelected] = useState(pages[0]?.id ?? "");
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const page = pages.find((p) => p.id === selected);
  const tr = page?.translations.find((t) => t.language === lang);

  const [slug, setSlug] = useState(tr?.slug ?? "");
  const [h1, setH1] = useState(tr?.h1 ?? "");
  const [description, setDescription] = useState(tr?.description ?? "");
  const [metaTitle, setMetaTitle] = useState(tr?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(tr?.metaDesc ?? "");

  const selectPage = (id: string) => {
    setSelected(id);
    const p = pages.find((x) => x.id === id);
    const t = p?.translations.find((x) => x.language === lang);
    setSlug(t?.slug ?? "");
    setH1(t?.h1 ?? "");
    setDescription(t?.description ?? "");
    setMetaTitle(t?.metaTitle ?? "");
    setMetaDesc(t?.metaDesc ?? "");
  };

  const switchLang = (l: "en" | "ar") => {
    setLang(l);
    const p = pages.find((x) => x.id === selected);
    const t = p?.translations.find((x) => x.language === l);
    setSlug(t?.slug ?? "");
    setH1(t?.h1 ?? "");
    setDescription(t?.description ?? "");
    setMetaTitle(t?.metaTitle ?? "");
    setMetaDesc(t?.metaDesc ?? "");
  };

  const save = () => {
    if (!page) return;
    setMessage(null);
    startTransition(async () => {
      await updateStaticPageTranslation({
        staticPageId: page.id,
        language: lang,
        slug,
        h1,
        description,
        metaTitle,
        metaDesc,
      });
      setMessage("Saved");
    });
  };

  return (
    <>
      <AdminHeader title="Static pages" description="About, contact, sur-mesure SEO" />
      <div className="grid gap-6 p-8 lg:grid-cols-[220px_1fr]">
        <ul className="space-y-1">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => selectPage(p.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selected === p.id ? "bg-stone-900 text-white" : "hover:bg-stone-200"
                }`}
              >
                {p.systemName}
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={lang === "en" ? "default" : "outline"}
              onClick={() => switchLang("en")}
            >
              EN
            </Button>
            <Button
              type="button"
              size="sm"
              variant={lang === "ar" ? "default" : "outline"}
              onClick={() => switchLang("ar")}
            >
              AR
            </Button>
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div>
            <Label>H1</Label>
            <Input value={h1} onChange={(e) => setH1(e.target.value)} dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} dir={lang === "ar" ? "rtl" : "ltr"} />
          </div>
          <div>
            <Label>Meta title</Label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div>
            <Label>Meta description</Label>
            <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2} />
          </div>
          {message && <p className="text-sm text-stone-600">{message}</p>}
          <Button type="button" onClick={save} disabled={isPending}>
            Save translation
          </Button>
        </div>
      </div>
    </>
  );
}
