'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, ImageIcon, Trash2, Upload, Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import {
  deleteLibraryImage,
  deleteLibraryImages,
  getLibraryImages,
} from '@/actions/library.actions';
import type { LibraryImage } from '@/types/library';
import { uploadImageFile } from '@/lib/client-library-upload';

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

interface Props {
  images: LibraryImage[];
  stats: { total: number; duplicates: number; totalSizeKb: number };
  initialLimit: number;
  loadError?: string;
}

export function LibraryAdminClient({ images: initialImages, stats, initialLimit, loadError }: Props) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [deleteLocal, setDeleteLocal] = useState(true);
  const [search, setSearch] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [fetchError, setFetchError] = useState(loadError || '');
  const [isPending, startTransition] = useTransition();
  const [isSearching, startSearchTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  useEffect(() => {
    if (!search.trim() && !showDuplicatesOnly) {
      setImages(initialImages);
      return;
    }

    const timer = setTimeout(() => {
      startSearchTransition(async () => {
        try {
          setFetchError('');
          const next = await getLibraryImages({
            search: search.trim() || undefined,
            duplicatesOnly: showDuplicatesOnly || undefined,
            limit: initialLimit,
          });
          setImages(next);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to load images';
          setFetchError(message);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, showDuplicatesOnly, initialLimit, initialImages]);

  const filtered = useMemo(() => images, [images]);
  const showingSubset = !search.trim() && !showDuplicatesOnly && stats.total > images.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelected(new Set(filtered.map((i) => i.id)));
  };

  const handleDeleteOne = (id: string) => {
    if (!confirm('Delete this image from library and storage?')) return;
    startTransition(async () => {
      await deleteLibraryImage(id, deleteLocal);
      setSelected((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
      router.refresh();
    });
  };

  const handleBulkDelete = () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} image(s)?${deleteLocal ? ' Local files in public/ will also be removed.' : ''}`)) return;
    startTransition(async () => {
      await deleteLibraryImages([...selected], deleteLocal);
      setSelected(new Set());
      router.refresh();
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError('');
    setUploadSuccess('');

    const fileList = Array.from(files);
    startTransition(async () => {
      let uploaded = 0;
      let lastError = '';

      for (const file of fileList) {
        try {
          const result = await uploadImageFile(file);
          if (result.success) {
            uploaded += 1;
          } else {
            lastError = result.error || 'Upload failed';
          }
        } catch {
          lastError = 'Failed to upload file';
        }
      }

      if (fileRef.current) fileRef.current.value = '';

      if (uploaded > 0) {
        setUploadSuccess(`${uploaded} image${uploaded > 1 ? 's' : ''} uploaded`);
        router.refresh();
      }
      if (lastError) {
        setUploadError(lastError);
      }
    });
  };

  return (
    <>
      <AdminHeader
        title="Media Library"
        description="Compressed images from your project — remove duplicates or unwanted files"
      />
      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Total images</p>
            <p className="text-2xl font-bold text-amber-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Duplicates flagged</p>
            <p className="text-2xl font-bold text-orange-600">{stats.duplicates}</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Library size (compressed)</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalSizeKb} KB</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
          <input
            type="search"
            placeholder="Search filename or path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDuplicatesOnly}
              onChange={(e) => setShowDuplicatesOnly(e.target.checked)}
            />
            Duplicates only
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={deleteLocal} onChange={(e) => setDeleteLocal(e.target.checked)} />
            Delete local file too
          </label>
          <Button type="button" variant="outline" size="sm" onClick={selectAllVisible}>
            Select visible
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            type="button"
            size="sm"
            className="bg-amber-800 hover:bg-amber-900"
            disabled={isPending}
            onClick={() => fileRef.current?.click()}
          >
            {isPending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-1 h-4 w-4" />
            )}
            Upload
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!selected.size || isPending}
            onClick={handleBulkDelete}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete ({selected.size})
          </Button>
        </div>

        {(uploadError || uploadSuccess || fetchError) && (
          <div
            className={`rounded-lg px-4 py-2 text-sm ${
              uploadError || fetchError
                ? 'border border-red-200 bg-red-50 text-red-700'
                : 'border border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {fetchError || uploadError || uploadSuccess}
          </div>
        )}

        {showingSubset && (
          <p className="text-sm text-slate-500">
            Showing latest {images.length} of {stats.total} images. Use search to find older files.
          </p>
        )}

        {isSearching && (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading images...
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white py-16 text-slate-500">
            <ImageIcon className="mb-3 h-12 w-12 opacity-40" />
            <p>No images in library yet.</p>
            <Button
              type="button"
              className="mt-4 bg-amber-800 hover:bg-amber-900"
              disabled={isPending}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload your first image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((img) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm ${
                  selected.has(img.id) ? 'ring-2 ring-amber-600' : ''
                } ${img.isDuplicate ? 'border-orange-300' : 'border-slate-200'}`}
              >
                <button
                  type="button"
                  className="absolute left-2 top-2 z-10 rounded bg-white/90 p-1 shadow"
                  onClick={() => toggleSelect(img.id)}
                >
                  <input type="checkbox" readOnly checked={selected.has(img.id)} className="h-4 w-4" />
                </button>
                {img.isDuplicate && (
                  <span className="absolute right-2 top-2 z-10 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    Dup
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.filename} className="aspect-square w-full object-cover" loading="lazy" decoding="async" />
                <div className="space-y-1 p-2 text-xs">
                  <p className="truncate font-medium text-slate-800" title={img.filename}>
                    {img.filename}
                  </p>
                  <p className="text-slate-500">
                    {formatKb(img.compressedSize)}
                    {img.originalSize > img.compressedSize && (
                      <span className="text-green-600"> ← {formatKb(img.originalSize)}</span>
                    )}
                  </p>
                  <div className="flex gap-1 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button type="button" size="sm" variant="outline" className="h-7 flex-1 px-1" onClick={() => copyUrl(img.url)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-7 flex-1 px-1"
                      disabled={isPending}
                      onClick={() => handleDeleteOne(img.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
