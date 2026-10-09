"use client";

import { useState, useTransition } from "react";

import { updateSEOSettings } from "@/actions/seo.actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SeoPayload = {
  setting: {
    id: string;
    ogImage: string | null;
    twitterHandle: string | null;
    facebookPage: string | null;
  };
  translations: {
    language: "en" | "ar";
    siteName: string | null;
    titleSuffix: string | null;
    defaultMetaDesc: string | null;
    defaultKeywords: string | null;
  }[];
};

export function SEOAdminClient({ initial }: { initial: SeoPayload | null }) {
  const [ogImage, setOgImage] = useState(initial?.setting.ogImage ?? "");
  const [twitter, setTwitter] = useState(initial?.setting.twitterHandle ?? "");
  const [facebook, setFacebook] = useState(initial?.setting.facebookPage ?? "");

  const en = initial?.translations.find((t) => t.language === "en");
  const ar = initial?.translations.find((t) => t.language === "ar");

  const [siteNameEn, setSiteNameEn] = useState(en?.siteName ?? "ATELIER ATLAS");
  const [suffixEn, setSuffixEn] = useState(en?.titleSuffix ?? "");
  const [descEn, setDescEn] = useState(en?.defaultMetaDesc ?? "");
  const [keywordsEn, setKeywordsEn] = useState(en?.defaultKeywords ?? "");

  const [siteNameAr, setSiteNameAr] = useState(ar?.siteName ?? "");
  const [suffixAr, setSuffixAr] = useState(ar?.titleSuffix ?? "");
  const [descAr, setDescAr] = useState(ar?.defaultMetaDesc ?? "");
  const [keywordsAr, setKeywordsAr] = useState(ar?.defaultKeywords ?? "");

  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateSEOSettings({
        ogImage,
        twitterHandle: twitter,
        facebookPage: facebook,
        translations: [
          {
            language: "en",
            siteName: siteNameEn,
            titleSuffix: suffixEn,
            defaultMetaDesc: descEn,
            defaultKeywords: keywordsEn,
          },
          {
            language: "ar",
            siteName: siteNameAr,
            titleSuffix: suffixAr,
            defaultMetaDesc: descAr,
            defaultKeywords: keywordsAr,
          },
        ],
      });
      setMessage(result.success ? "Saved" : result.error || "Error");
    });
  };

  return (
    <>
      <AdminHeader title="SEO settings" description="Global defaults EN / AR" />
      <div className="max-w-3xl space-y-6 p-8">
        <div className="rounded-xl border bg-white p-6 space-y-3">
          <Label>Default OG image URL</Label>
          <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
          <Label>Twitter handle</Label>
          <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          <Label>Facebook page</Label>
          <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 space-y-3">
            <h3 className="font-semibold">English</h3>
            <Input placeholder="Site name" value={siteNameEn} onChange={(e) => setSiteNameEn(e.target.value)} />
            <Input placeholder="Title suffix" value={suffixEn} onChange={(e) => setSuffixEn(e.target.value)} />
            <Textarea placeholder="Default meta description" value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={3} />
            <Input placeholder="Keywords" value={keywordsEn} onChange={(e) => setKeywordsEn(e.target.value)} />
          </div>
          <div className="rounded-xl border bg-white p-6 space-y-3" dir="rtl">
            <h3 className="font-semibold">Arabic</h3>
            <Input value={siteNameAr} onChange={(e) => setSiteNameAr(e.target.value)} />
            <Input value={suffixAr} onChange={(e) => setSuffixAr(e.target.value)} />
            <Textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={3} />
            <Input value={keywordsAr} onChange={(e) => setKeywordsAr(e.target.value)} />
          </div>
        </div>

        {message && <p className="text-sm text-stone-600">{message}</p>}
        <Button type="button" onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : "Save SEO"}
        </Button>
      </div>
    </>
  );
}
