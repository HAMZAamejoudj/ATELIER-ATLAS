"use server";

import { checkAdmin } from "@/lib/auth-admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PRODUCT_BUCKET = "atlas-products";
const BLOG_BUCKET = "atlas-blog";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Upload failed";
}

export async function uploadProductImage(formData: FormData) {
  await checkAdmin();
  try {
    const file = formData.get("file") as File | null;
    if (!file) throw new Error("No file provided");
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Invalid file type");
    if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds 5MB limit");

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${file.name.split(".").pop() || "jpg"}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(PRODUCT_BUCKET)
      .upload(filename, buffer, { contentType: file.type, upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabaseAdmin.storage
      .from(PRODUCT_BUCKET)
      .getPublicUrl(filename);
    return { success: true as const, url: data.publicUrl };
  } catch (error: unknown) {
    return { success: false as const, error: getErrorMessage(error) };
  }
}

export async function uploadBlogImage(formData: FormData) {
  await checkAdmin();
  try {
    const file = formData.get("file") as File | null;
    if (!file) throw new Error("No file provided");
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Invalid file type");
    if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds 5MB limit");

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${file.name.split(".").pop() || "jpg"}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BLOG_BUCKET)
      .upload(filename, buffer, { contentType: file.type, upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabaseAdmin.storage.from(BLOG_BUCKET).getPublicUrl(filename);
    return { success: true as const, url: data.publicUrl };
  } catch (error: unknown) {
    return { success: false as const, error: getErrorMessage(error) };
  }
}
