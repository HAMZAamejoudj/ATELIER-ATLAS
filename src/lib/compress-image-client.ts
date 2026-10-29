const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_POST_BYTES = 4.5 * 1024 * 1024;
const TARGET_BYTES = 2 * 1024 * 1024;
const MAX_WIDTH = 2560;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function guessMimeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "";
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

async function compressWithCanvas(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    let width = bitmap.width;
    let height = bitmap.height;
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const baseName = file.name.replace(/\.[^.]+$/, "") || "upload";
    const qualities = [0.92, 0.85, 0.78];
    let lastBlob: Blob | null = null;

    for (const quality of qualities) {
      lastBlob = await canvasToBlob(canvas, "image/jpeg", quality);
      if (lastBlob.size <= TARGET_BYTES) break;
    }

    if (!lastBlob || lastBlob.size > MAX_POST_BYTES) {
      throw new Error("Image is too large after compression.");
    }

    return new File([lastBlob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.size) throw new Error("Empty file");
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Image exceeds 10 MB. Please choose a smaller photo.");
  }

  const type = file.type || guessMimeFromName(file.name);

  if (type === "image/heic" || type === "image/heif") {
    throw new Error("HEIC photos are not supported. Save or export the image as JPG or PNG.");
  }

  if (type === "image/gif") {
    if (file.size > MAX_POST_BYTES) {
      throw new Error("GIF is too large to upload. Please use JPG or PNG.");
    }
    return file;
  }

  if (type && !type.startsWith("image/")) {
    throw new Error("Please choose a JPG, PNG, or WebP image.");
  }

  if (file.size <= TARGET_BYTES && ALLOWED_MIME.has(type)) {
    return file;
  }

  try {
    return await compressWithCanvas(file);
  } catch (error) {
    if (file.size <= MAX_POST_BYTES && ALLOWED_MIME.has(type)) {
      return file;
    }
    if (error instanceof Error && error.message.includes("too large")) {
      throw error;
    }
    throw new Error(
      "This image could not be processed. Convert it to JPG or PNG and try again.",
    );
  }
}
