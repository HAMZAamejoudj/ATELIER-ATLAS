export type LibraryUploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadImageFile(
  file: File,
): Promise<LibraryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/library/upload", {
    method: "POST",
    body: formData,
  });

  let data: { success?: boolean; url?: string; error?: string };
  try {
    data = await response.json();
  } catch {
    return {
      success: false,
      error:
        response.status === 401
          ? "Please sign in again."
          : "Upload failed — invalid server response.",
    };
  }

  if (!response.ok || !data.success || !data.url) {
    return { success: false, error: data.error || "Upload failed" };
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
