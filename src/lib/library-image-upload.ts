import "server-only";

import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { resolveMediaLibraryUrl } from "@/lib/media-library-url";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { LibraryImage } from "@/types/library";

const LIBRARY_BUCKET = "atlas-site";
const ALLOWED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_UPLOAD_BYTES = 150 * 1024;

function normalizeMime(mimeType: string): string {
  return mimeType === "image/jpg" ? "image/jpeg" : mimeType;
}

async function isDecodableImage(buffer: Buffer): Promise<boolean> {
  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(buffer).metadata();
    return Boolean(meta.width && meta.height);
  } catch {
    return false;
  }
}

async function compressToJpegMaxBytes(
  buffer: Buffer,
  maxBytes: number,
): Promise<{
  buffer: Buffer;
  mimeType: string;
  extension: string;
  width: number;
  height: number;
} | null> {
  const sharp = (await import("sharp")).default;
  const meta = await sharp(buffer).metadata();
  let width = Math.min(meta.width || 1200, 1200);
  let quality = 85;

  for (let i = 0; i < 20; i++) {
    const result = await sharp(buffer)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    if (
      result.data.length <= maxBytes &&
      (await isDecodableImage(result.data))
    ) {
      return {
        buffer: result.data,
        mimeType: "image/jpeg",
        extension: "jpg",
        width: result.info.width,
        height: result.info.height,
      };
    }

    if (quality > 40) {
      quality -= 10;
    } else if (width > 120) {
      width = Math.floor(width * 0.75);
      quality = 75;
    } else {
      break;
    }
  }

  return null;
}

function withResolvedUrl(image: LibraryImage): LibraryImage {
  return { ...image, url: resolveMediaLibraryUrl(image) };
}

export async function processAndUploadLibraryImage(
  original: Buffer,
  filename: string,
  mimeType: string,
): Promise<
  | { success: true; url: string; image: LibraryImage }
  | { success: false; error: string }
> {
  try {
    const crypto = await import("crypto");

    if (!original.length) throw new Error("Empty file");
    const normalizedMime = normalizeMime(mimeType);
    if (!ALLOWED_MIME.includes(normalizedMime)) {
      throw new Error("Invalid file type. Use JPG, PNG, WebP, or GIF.");
    }

    const hash = crypto.createHash("md5").update(original).digest("hex");

    let uploadBuffer: Buffer = original;
    let uploadMime = normalizedMime;
    let uploadExt = filename.split(".").pop()?.toLowerCase() || "jpg";
    let width: number | null = null;
    let height: number | null = null;

    const meta = await (await import("sharp")).default(original).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;

    const jpeg = await compressToJpegMaxBytes(original, MAX_UPLOAD_BYTES);
    if (jpeg) {
      uploadBuffer = jpeg.buffer;
      uploadMime = jpeg.mimeType;
      uploadExt = jpeg.extension;
      width = jpeg.width;
      height = jpeg.height;
    } else if (
      original.length <= MAX_UPLOAD_BYTES &&
      (await isDecodableImage(original))
    ) {
      uploadBuffer = original;
      uploadMime = normalizedMime;
      uploadExt = filename.split(".").pop()?.toLowerCase() || "jpg";
    } else {
      throw new Error(
        "Image is too large and could not be compressed below 150 KB",
      );
    }

    const baseName = filename
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    const storagePath = `library/${hash.slice(0, 10)}-${baseName}.${uploadExt}`;

    if (!(await isDecodableImage(uploadBuffer))) {
      throw new Error("Image file is invalid or could not be processed");
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from(LIBRARY_BUCKET)
      .upload(storagePath, new Uint8Array(uploadBuffer), {
        contentType: uploadMime,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const publicUrl = resolveMediaLibraryUrl({
      url: "",
      storagePath,
      localPath: null,
    });

    const { data: existing } = await supabaseAdmin
      .from("MediaLibrary")
      .select("id")
      .eq("contentHash", hash)
      .eq("isDuplicate", false)
      .maybeSingle();

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("MediaLibrary")
      .insert({
        storagePath,
        url: publicUrl,
        localPath: null,
        originalSize: original.length,
        compressedSize: uploadBuffer.length,
        contentHash: hash,
        filename,
        mimeType: uploadMime,
        width,
        height,
        isDuplicate: !!existing,
        duplicateOfId: existing?.id ?? null,
      })
      .select("*")
      .single();

    if (insErr) throw insErr;

    revalidateTag(CACHE_TAGS.LIBRARY, "default");
    const image = withResolvedUrl(inserted as LibraryImage);
    return { success: true, url: image.url, image };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return { success: false, error: message };
  }
}
