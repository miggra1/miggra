"use client";

import { useState } from "react";

export type PhotoWallItem = {
  id: string;
  url: string;
  caption: string | null;
  album: string | null;
  takenAt: string | null;
  location: string | null;
  tags: string | null;
};

function splitTags(value: string | null) {
  return value?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function PhotoWall({ photos }: { photos: PhotoWallItem[] }) {
  const [lightbox, setLightbox] = useState<PhotoWallItem | null>(null);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div key={photo.id} className="break-inside-avoid group cursor-pointer" style={{ animationDelay: `${i * 50}ms` }} onClick={() => setLightbox(photo)}>
            <div className="overflow-hidden rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <img src={photo.url} alt={photo.caption ?? ""} loading="lazy" className="w-full h-auto block transition duration-500 group-hover:scale-[1.02]" />
              {(photo.caption || photo.album || photo.takenAt || photo.location || photo.tags) && (
                <div className="px-4 py-3 space-y-2">
                  {photo.caption && <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">{photo.caption}</p>}
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-[var(--muted)]">
                    {photo.album && <span className="rounded-full border border-[var(--border)] px-2 py-0.5">{photo.album}</span>}
                    {formatDate(photo.takenAt) && <span className="rounded-full border border-[var(--border)] px-2 py-0.5">{formatDate(photo.takenAt)}</span>}
                    {photo.location && <span className="rounded-full border border-[var(--border)] px-2 py-0.5">{photo.location}</span>}
                    {splitTags(photo.tags).map((tag) => <span key={tag} className="rounded-full border border-[var(--border)] px-2 py-0.5">#{tag}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center transition" onClick={() => setLightbox(null)}>
            ✕
          </button>
          <img src={lightbox.url} alt={lightbox.caption ?? ""} className="max-w-full max-h-[82vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          {(lightbox.caption || lightbox.album || lightbox.location || lightbox.takenAt) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[90vw] rounded-2xl bg-white/10 px-4 py-3 text-center text-white/80 backdrop-blur">
              {lightbox.caption && <p className="text-sm">{lightbox.caption}</p>}
              <p className="mt-1 text-xs text-white/55">
                {[lightbox.album, formatDate(lightbox.takenAt), lightbox.location].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
