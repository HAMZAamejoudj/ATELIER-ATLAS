import { NextResponse } from "next/server";

import { checkAdmin } from "@/lib/auth-admin";
import { processAndUploadLibraryImage } from "@/lib/library-image-upload";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await checkAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { success: false, error: "File exceeds 10 MB limit" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await processAndUploadLibraryImage(
    buffer,
    file.name,
    file.type || "application/octet-stream",
  );

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    url: result.url,
    image: result.image,
  });
}
