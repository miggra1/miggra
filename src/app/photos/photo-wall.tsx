"use client";

import { useState, useEffect, useCallback } from "react";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const lightbox = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, [photos.length]);
  const copyPhotoLink = useCallback(async () => {
    if (!lightbox) return;
    const url = new URL(lightbox.url, window.location.origin).toString();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, [lightbox]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div key={photo.id} className="break-inside-avoid group cursor-pointer" style={{ animationDelay: `${i * 50}ms` }} onClick={() => setLightboxIndex(i)}>
            <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <img src={photo.url} alt={photo.caption ?? ""} loading="lazy" className="w-full h-auto block transition duration-500 group-hover:scale-[1.02]" />
              {photo.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                  <p className="text-sm text-white line-clamp-3 leading-relaxed">{photo.caption}</p>
                </div>
              )}
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in" onClick={closeLightbox}>
          <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60 backdrop-blur">
            {lightboxIndex! + 1} / {photos.length}
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/15 hover:text-white"
              onClick={(e) => { e.stopPropagation(); void copyPhotoLink(); }}
            >
              {copied ? "已复制" : "复制链接"}
            </button>
            <button className="text-white/60 hover:text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center transition bg-white/10 hover:bg-white/15" onClick={closeLightbox} aria-label="关闭">
              x
            </button>
          </div>

          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center transition bg-white/5 hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="上一张"
              >
                {"<"}
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-3xl w-12 h-12 rounded-full flex items-center justify-center transition bg-white/5 hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="下一张"
              >
                {">"}
              </button>
            </>
          )}

          <div className="flex max-h-[88vh] w-full max-w-6xl flex-col items-center gap-4 lg:flex-row lg:items-stretch" onClick={(e) => e.stopPropagation()}>
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <img src={lightbox.url} alt={lightbox.caption ?? ""} className="max-h-[72vh] max-w-full rounded-xl object-contain lg:max-h-[88vh]" />
            </div>
            {(lightbox.caption || lightbox.album || lightbox.location || lightbox.takenAt || lightbox.tags) && (
              <aside className="w-full rounded-2xl bg-white/10 p-5 text-white/80 backdrop-blur lg:w-72">
                {lightbox.caption && <p className="text-base leading-7 text-white">{lightbox.caption}</p>}
                <div className="mt-4 grid gap-2 text-sm text-white/65">
                  {lightbox.album && <p>相册：{lightbox.album}</p>}
                  {formatDate(lightbox.takenAt) && <p>时间：{formatDate(lightbox.takenAt)}</p>}
                  {lightbox.location && <p>地点：{lightbox.location}</p>}
                </div>
                {splitTags(lightbox.tags).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {splitTags(lightbox.tags).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/60">#{tag}</span>
                    ))}
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>
      )}
    </>
  );
}
