'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { ImagePlus, Loader2, Search, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLibraryImages } from '@/actions/library.actions';
import type { LibraryImage } from '@/types/library';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { resolveMediaLibraryUrl } from '@/lib/media-library-url';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaPickerModal({ open, onClose, onSelect, title = 'Choose Image' }: Props) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const data = await getLibraryImages({
        excludeDuplicates: true,
        search: q || undefined,
        limit: 120,
      });
      setImages(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelectedUrl(null);
    setSearch('');
    setUploadError('');
    loadImages();
  }, [open, loadImages]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => loadImages(search), 300);
    return () => clearTimeout(timer);
  }, [search, open, loadImages]);

  const handleUpload = (files: FileList | null) => {
    if (!files?.[0]) return;
    const file = files[0];
    setUploadError('');
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const pendingUrl = `pending-upload:${encodeURIComponent(file.name)}:${file.type}:${base64}`;
      setSelectedUrl(pendingUrl);
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.onerror = () => {
      setUploadError('Failed to read file');
    };
  };

  const handleConfirm = () => {
    if (!selectedUrl) return;
    onSelect(selectedUrl);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-amber-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <Tabs defaultValue="library" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-slate-100 px-6 pt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="library" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                Media Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-amber-800 data-[state=active]:text-white">
                Upload New
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="mt-0 flex min-h-0 flex-1 flex-col px-6 pb-2">
            <div className="relative my-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-700/30"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pb-4">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                </div>
              ) : images.length === 0 ? (
                <div className="py-16 text-center text-slate-500">No images found. Upload a new one.</div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {images.map((img) => {
                    const isSelected = selectedUrl === img.url;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedUrl(img.url)}
                        className={cn(
                          'group relative overflow-hidden rounded-lg border-2 text-left transition-all hover:border-amber-400',
                          isSelected ? 'border-amber-800 ring-2 ring-amber-800/20' : 'border-slate-200'
                        )}
                      >
                        {/* Checkbox / Selection badge */}
                        <div className={cn(
                          "absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border shadow transition-all duration-200",
                          isSelected 
                            ? "bg-amber-800 border-amber-800 text-white scale-100 animate-scaleIn" 
                            : "bg-white/80 border-slate-300 text-transparent scale-90 group-hover:scale-100 group-hover:bg-white"
                        )}>
                          <Check className={cn("h-3 w-3 stroke-[3] transition-opacity", isSelected ? "opacity-100" : "opacity-0")} />
                        </div>

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.url} 
                          alt={img.filename} 
                          className={cn(
                            "aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-102",
                            isSelected ? "brightness-95" : ""
                          )} 
                          loading="eager"
                          decoding="async"
                        />
                        <p className="truncate px-1.5 py-1 text-[10px] text-slate-600">{img.filename}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0 flex-1 px-6 py-6">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
            <button
              type="button"
              disabled={isPending}
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 py-16 text-slate-500 transition-colors hover:border-amber-700 hover:text-amber-800"
            >
              {isPending ? (
                <Loader2 className="mb-3 h-10 w-10 animate-spin" />
              ) : (
                <Upload className="mb-3 h-10 w-10" />
              )}
              <span className="text-sm font-medium">{isPending ? 'Uploading...' : 'Click to upload from your PC'}</span>
              <span className="mt-1 text-xs text-slate-400">JPG, PNG, WebP — max 10MB</span>
            </button>
            {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
            {selectedUrl && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="mb-2 text-sm font-medium text-green-800">File loaded — click &quot;Use selected&quot; below</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveMediaLibraryUrl({ url: selectedUrl, storagePath: selectedUrl })} alt="" className="mx-auto max-h-40 rounded object-contain" />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {selectedUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveMediaLibraryUrl({ url: selectedUrl, storagePath: selectedUrl })} alt="" className="h-10 w-10 rounded object-cover" />
                <span>Image selected</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                <span>Select an image from library or upload new</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="button"
              className="bg-amber-800 hover:bg-amber-900"
              disabled={!selectedUrl}
              onClick={handleConfirm}
            >
              Use selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
