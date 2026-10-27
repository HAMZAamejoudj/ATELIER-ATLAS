import { prepareImageForUpload } from "@/lib/compress-image-client";

export type LibraryUploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

function errorFromBody(error: unknown, fallback: string): string {
  return typeof error === "string" && error.trim() ? error : fallback;
}

export async function uploadImageFile(
  file: File,
): Promise<LibraryUploadResult> {
  let prepared: File;
  try {
    prepared = await prepareImageForUpload(file);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not prepare image",
    };
  }

  const formData = new FormData();
  formData.append("file", prepared);

  let response: Response;
  try {
    response = await fetch("/api/admin/library/upload", {
      method: "POST",
      body: formData,
    });
  } catch {
    return {
      success: false,
      error: "Network error. Check your connection and try again.",
    };
  }

  const text = await response.text();
  let data: { success?: boolean; url?: string; error?: string };
  try {
    data = JSON.parse(text) as {
      success?: boolean;
      url?: string;
      error?: string;
    };
  } catch {
    if (response.status === 413) {
      return {
        success: false,
        error: "Image is too large for the server. Use a smaller JPG or PNG.",
      };
    }
    if (response.status === 401) {
      return { success: false, error: "Please sign in again." };
    }
    if (response.status === 502 || response.status === 504) {
      return {
        success: false,
        error: "Upload timed out. Try a smaller image.",
      };
    }
    return {
      success: false,
      error: `Upload failed (HTTP ${response.status || "unknown"}). Try a smaller JPG or PNG.`,
    };
  }

  if (!response.ok || !data.success || !data.url) {
    return {
      success: false,
      error: errorFromBody(data.error, "Upload failed"),
    };
  }

  return { success: true, url: data.url };
}

export function pendingUploadToFile(pendingUrl: string): File {
  const parts = pendingUrl.split(":");
  const filename = parts[1] ?? "upload.jpg";
  const mimeType = parts[2] ?? "image/jpeg";
  const base64 = parts.slice(3).join(":");
  const decodedFilename = decodeURIComponent(filename);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], decodedFilename, { type: mimeType });
}

export async function uploadPendingImageIfNeeded(
  url: string | null | undefined,
): Promise<string> {
  if (!url) return "";
  if (!url.startsWith("pending-upload:")) return url;

  const file = pendingUploadToFile(url);
  const result = await uploadImageFile(file);
  if (!result.success) {
    throw new Error(result.error || `Failed to upload ${file.name}`);
  }
  return result.url;
}
