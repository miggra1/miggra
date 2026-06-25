import { listPhotos } from "@/lib/photos";
import { PhotoWall } from "./photo-wall";
import Link from "next/link";

export default async function PhotosPage() {
  const photos = await listPhotos().catch(() => []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#a855f7] mb-2">Photos</p>
            <h1 className="text-[36px] font-semibold tracking-tight">照片墙</h1>
            {photos.length > 0 && (
              <p className="text-sm text-[var(--fg-secondary)] mt-1">{photos.length} 张照片</p>
            )}
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-[var(--muted)]">还没有照片</p>
          </div>
        ) : (
          <PhotoWall photos={photos} />
        )}
      </div>
    </div>
  );
}
