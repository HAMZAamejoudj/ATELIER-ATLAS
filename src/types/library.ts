export interface LibraryImage {
  id: string;
  storagePath: string;
  url: string;
  localPath: string | null;
  originalSize: number;
  compressedSize: number;
  contentHash: string;
  filename: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  isDuplicate: boolean;
  duplicateOfId: string | null;
  createdAt: string;
}
