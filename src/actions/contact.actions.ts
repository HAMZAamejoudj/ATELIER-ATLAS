"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { checkAdmin } from "@/lib/auth-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_CONTACT_SETTINGS,
  INITIAL_INQUIRIES,
  type ContactInquiry,
  type ContactSettings,
  type InquiryStatus,
  type InquiryType,
} from "@/lib/contact-types";

const CONTACT_SETTINGS_PAGE_ID = "sp_contact_settings";
const CONTACT_INQUIRIES_PAGE_ID = "sp_contact_inquiries";

const LEGACY_CONTACT_EMAIL_PATTERN = /@atelier-atlas\.(com|order)$/i;

function normalizeContactSettings(
  settings: ContactSettings,
): ContactSettings {
  const conciergeEmail = settings.conciergeEmail?.trim();
  const tradeEmail = settings.tradeEmail?.trim();

  return {
    ...settings,
    conciergeEmail:
      !conciergeEmail || LEGACY_CONTACT_EMAIL_PATTERN.test(conciergeEmail)
        ? DEFAULT_CONTACT_SETTINGS.conciergeEmail
        : conciergeEmail,
    tradeEmail:
      !tradeEmail || LEGACY_CONTACT_EMAIL_PATTERN.test(tradeEmail)
        ? DEFAULT_CONTACT_SETTINGS.tradeEmail
        : tradeEmail,
  };
}

// ==========================================
// CONTACT SETTINGS
// ==========================================

export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const { data } = await supabase
      .from("StaticPage")
      .select("*, translations:StaticPageTranslation(*)")
      .eq("systemName", "contact_settings")
      .maybeSingle();

    if (!data) return DEFAULT_CONTACT_SETTINGS;

    const row = data as any;
    const en = row.translations?.find((t: any) => t.language === "en");
    if (!en || !en.description) return DEFAULT_CONTACT_SETTINGS;

    const parsed = JSON.parse(en.description) as Partial<ContactSettings>;
    return normalizeContactSettings({
      ...DEFAULT_CONTACT_SETTINGS,
      ...parsed,
    });
  } catch (e) {
    console.error("Failed to fetch contact settings:", e);
    return DEFAULT_CONTACT_SETTINGS;
  }
}

export async function saveContactSettings(settings: ContactSettings) {
  try {
    await checkAdmin();

    const { data: page } = await supabaseAdmin
      .from("StaticPage")
      .select("id")
      .eq("systemName", "contact_settings")
      .maybeSingle();

    let pageId = page?.id;

    if (!pageId) {
      const { data: created, error } = await supabaseAdmin
        .from("StaticPage")
        .insert({
          id: CONTACT_SETTINGS_PAGE_ID,
          systemName: "contact_settings",
        })
        .select("id")
        .single();

      if (error) throw error;
      pageId = created.id;
    }

    const payload = JSON.stringify(settings);
    const languages = ["en", "ar"] as const;

    for (const lang of languages) {
      const { data: existingTr } = await supabaseAdmin
        .from("StaticPageTranslation")
        .select("id")
        .eq("staticPageId", pageId)
        .eq("language", lang)
        .maybeSingle();

      const trData = {
        staticPageId: pageId,
        language: lang,
        slug: "contact-settings",
        h1: "Studio Contact Settings",
        description: payload,
        metaTitle: "Studio Contact Settings",
        metaDesc: "Studio Contact Settings",
      };

      if (existingTr) {
        await supabaseAdmin
          .from("StaticPageTranslation")
          .update(trData)
          .eq("id", existingTr.id);
      } else {
        await supabaseAdmin.from("StaticPageTranslation").insert(trData);
      }
    }

    revalidateTag(CACHE_TAGS.STATIC_PAGES, "default");
    revalidatePath("/contact");
    revalidatePath("/atlasadmin/contact");

    return { success: true as const };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to save contact settings";
    return { success: false as const, error: message };
  }
}

// ==========================================
// CONTACT INQUIRIES
// ==========================================

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  try {
    const { data } = await supabase
      .from("StaticPage")
      .select("*, translations:StaticPageTranslation(*)")
      .eq("systemName", "contact_inquiries")
      .maybeSingle();

    if (!data) return INITIAL_INQUIRIES;

    const row = data as any;
    const en = row.translations?.find((t: any) => t.language === "en");
    if (!en || !en.description) return INITIAL_INQUIRIES;

    const parsed: ContactInquiry[] = JSON.parse(en.description);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_INQUIRIES;
    }

    return parsed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (e) {
    console.error("Failed to fetch contact inquiries:", e);
    return INITIAL_INQUIRIES;
  }
}

async function persistInquiries(inquiries: ContactInquiry[]) {
  const { data: page } = await supabaseAdmin
    .from("StaticPage")
    .select("id")
    .eq("systemName", "contact_inquiries")
    .maybeSingle();

  let pageId = page?.id;

  if (!pageId) {
    const { data: created, error } = await supabaseAdmin
      .from("StaticPage")
      .insert({
        id: CONTACT_INQUIRIES_PAGE_ID,
        systemName: "contact_inquiries",
      })
      .select("id")
      .single();

    if (error) throw error;
    pageId = created.id;
  }

  const payload = JSON.stringify(inquiries);
  const languages = ["en", "ar"] as const;

  for (const lang of languages) {
    const { data: existingTr } = await supabaseAdmin
      .from("StaticPageTranslation")
      .select("id")
      .eq("staticPageId", pageId)
      .eq("language", lang)
      .maybeSingle();

    const trData = {
      staticPageId: pageId,
      language: lang,
      slug: "contact-inquiries",
      h1: "Contact Inquiries Repository",
      description: payload,
      metaTitle: "Contact Inquiries",
      metaDesc: "Contact Inquiries",
    };

    if (existingTr) {
      await supabaseAdmin
        .from("StaticPageTranslation")
        .update(trData)
        .eq("id", existingTr.id);
    } else {
      await supabaseAdmin.from("StaticPageTranslation").insert(trData);
    }
  }

  revalidatePath("/atlasadmin/contact");
}

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  type: InquiryType;
  subject: string;
  message: string;
}) {
  try {
    if (!data.name || !data.email || !data.message) {
      return {
        success: false as const,
        error: "Please fill in all required fields (Name, Email, Message).",
      };
    }

    const currentInquiries = await getContactInquiries();
    const newInquiry: ContactInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      type: data.type || "general",
      subject: data.subject.trim() || "Workshop Inquiry",
      message: data.message.trim(),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...currentInquiries];
    await persistInquiries(updated);

    return {
      success: true as const,
      message: "Thank you. Your message has been received by our Marrakech atelier concierge.",
    };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to send message. Please try again.";
    return { success: false as const, error: message };
  }
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  notes?: string
) {
  try {
    await checkAdmin();
    const currentInquiries = await getContactInquiries();
    const updated = currentInquiries.map((inq) => {
      if (inq.id === id) {
        return {
          ...inq,
          status,
          ...(notes !== undefined ? { notes } : {}),
        };
      }
      return inq;
    });

    await persistInquiries(updated);
    return { success: true as const };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to update inquiry";
    return { success: false as const, error: message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await checkAdmin();
    const currentInquiries = await getContactInquiries();
    const updated = currentInquiries.filter((inq) => inq.id !== id);
    await persistInquiries(updated);
    return { success: true as const };
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to delete inquiry";
    return { success: false as const, error: message };
  }
}
