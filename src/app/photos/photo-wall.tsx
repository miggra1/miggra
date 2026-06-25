"use client";

import { useState } from "react";
import type { Photo } from "@prisma/client";

export function PhotoWall({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="break-inside-avoid group cursor-pointer"
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={() => setLightbox(photo)}
          >
            <div className="overflow-hidden rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <img
                src={photo.url}
                alt={photo.caption ?? ""}
                loading="lazy"
                className="w-full h-auto block transition duration-500 group-hover:scale-[1.02]"
              />
              {photo.caption && (
                <p className="px-4 py-3 text-sm text-[var(--fg-secondary)] leading-relaxed">
                  {photo.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center transition"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.caption ?? ""}
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
