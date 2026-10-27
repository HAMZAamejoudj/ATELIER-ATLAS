import { NextResponse } from "next/server";

import { checkAdmin } from "@/lib/auth-admin";
import { processAndUploadLibraryImage } from "@/lib/library-image-upload";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function sniffMime(buffer: Buffer, fallback: string): string {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  ) {
    return "image/gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return fallback === "image/jpg" ? "image/jpeg" : fallback;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  try {
    await checkAdmin();
  } catch {
    return jsonError("Unauthorized", 401);
  }

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("Invalid form data", 400);
    }

    const file = formData.get("file");
    if (!(file instanceof Blob) || file.size === 0) {
      return jsonError("No file provided", 400);
    }

    if (file.size > MAX_FILE_BYTES) {
      return jsonError("File exceeds 10 MB limit", 400);
    }

    const filename =
      "name" in file && typeof file.name === "string" && file.name
        ? file.name
        : "upload.jpg";
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = sniffMime(
      buffer,
      file.type || "application/octet-stream",
    );

    const result = await processAndUploadLibraryImage(
      buffer,
      filename,
      mimeType,
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      image: result.image,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return jsonError(message, 500);
  }
}
