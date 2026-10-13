'use client';

import React from 'react';
import { ImagePlus, Trash2, CheckCircle2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface AdminImagePickerProps {
  value?: string | null;
  onChange: (url: string) => void;
  onOpenPicker: () => void;
  label?: string;
  description?: string;
  placeholder?: string;
  aspect?: 'video' | 'square' | 'banner' | 'auto';
  variant?: 'card' | 'compact' | 'banner';
  disabled?: boolean;
  className?: string;
  dir?: 'ltr' | 'rtl';
}

/**
 * Resolves preview URL including base64 pending uploads and relative paths
 */
function getDisplayUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('pending-upload:')) {
    const parts = trimmed.split(':');
    const mime = parts[2] || 'image/jpeg';
    const base64 = parts.slice(3).join(':');
    return `data:${mime};base64,${base64}`;
  }
  return trimmed;
}

/**
 * Extracts a human-friendly filename from a URL or pending upload string
 */
function getCleanFileName(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('pending-upload:')) {
    const parts = url.split(':');
    try {
      return decodeURIComponent(parts[1] || 'New upload');
    } catch {
      return parts[1] || 'New upload';
    }
  }
  const parts = url.split('/');
  const last = parts[parts.length - 1];
  return last ? last.split('?')[0] : url;
}

export function AdminImagePicker({
  value,
  onChange,
  onOpenPicker,
  label,
  description,
  placeholder = 'Select image',
  aspect = 'video',
  variant = 'card',
  disabled = false,
  className,
  dir = 'ltr',
}: AdminImagePickerProps) {
  const displayUrl = getDisplayUrl(value);
  const fileName = getCleanFileName(value);
  const hasImage = Boolean(displayUrl);

  const aspectClass =
    aspect === 'banner'
      ? 'aspect-[21/9] min-h-[160px]'
      : aspect === 'video'
        ? 'aspect-[16/9]'
        : aspect === 'square'
          ? 'aspect-square'
          : 'aspect-video';

  // Compact Variant (used in tight grids like Subcategory Chips)
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-1.5', className)} dir={dir}>
        {label && <Label className="text-[11px] font-semibold text-slate-700">{label}</Label>}
        {description && <p className="text-[10px] text-slate-500">{description}</p>}

        {hasImage ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2 shadow-xs transition-all hover:border-amber-600/40">
            <div
              onClick={onOpenPicker}
              className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
              title="Click to change image"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt={fileName || 'Thumbnail preview'}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <ImagePlus className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-800" title={fileName}>
                {fileName}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>Selected</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={onOpenPicker}
                className="h-7 text-xs border-slate-200 hover:border-amber-700 hover:text-amber-800"
              >
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={disabled}
                onClick={() => onChange('')}
                className="h-7 w-7 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                title="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={onOpenPicker}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-3 text-slate-600 transition-all hover:border-amber-700 hover:bg-amber-50/30 hover:text-amber-900 cursor-pointer"
          >
            <ImagePlus className="h-4 w-4 text-amber-800" />
            <span className="text-xs font-semibold">{placeholder}</span>
          </button>
        )}
      </div>
    );
  }

  // Card & Banner Variants
  return (
    <div className={cn('space-y-1.5', className)} dir={dir}>
      {label && <Label className="text-xs font-semibold text-slate-700">{label}</Label>}
      {description && <p className="text-[11px] text-slate-500">{description}</p>}

      {hasImage ? (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 shadow-xs transition-all hover:border-amber-700/60">
          {/* Main Image Display */}
          <div
            onClick={onOpenPicker}
            className={cn('relative w-full cursor-pointer overflow-hidden bg-stone-100', aspectClass)}
            title="Click to select another image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt={fileName || 'Image preview'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-md">
                <ImagePlus className="h-3.5 w-3.5 text-amber-800" />
                Change Image
              </span>
            </div>
          </div>

          {/* Footer Bar with info & quick actions */}
          <div className="flex items-center justify-between border-t border-slate-200/80 bg-white px-3 py-2">
            <div className="min-w-0 flex-1 pr-2">
              <p className="truncate text-xs font-medium text-slate-700" title={fileName}>
                {fileName}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>Selected</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={onOpenPicker}
                className="h-8 gap-1 text-xs border-slate-200 hover:border-amber-700 hover:text-amber-800"
              >
                <ImagePlus className="h-3.5 w-3.5 text-amber-800" />
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => onChange('')}
                className="h-8 gap-1 text-xs border-slate-200 text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                title="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={onOpenPicker}
          className={cn(
            'group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center transition-all hover:border-amber-700 hover:bg-amber-50/30 cursor-pointer',
            aspectClass
          )}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100/70 text-amber-800 transition-transform duration-200 group-hover:scale-110">
            <UploadCloud className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">
            {placeholder}
          </span>
          <span className="mt-0.5 text-[11px] text-slate-400">
            Click to browse Media Library or upload
          </span>
        </button>
      )}
    </div>
  );
}
