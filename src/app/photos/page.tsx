import { listPhotoFacets, listPhotos } from "@/lib/photos";
import { PhotoWall, type PhotoWallItem } from "./photo-wall";
import Link from "next/link";

function hrefFor(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `/photos?${query}` : "/photos";
}

function serializePhoto(photo: Awaited<ReturnType<typeof listPhotos>>[number]): PhotoWallItem {
  return {
    id: photo.id,
    url: photo.url,
    caption: photo.caption,
    album: photo.album,
    takenAt: photo.takenAt?.toISOString() ?? null,
    location: photo.location,
    tags: photo.tags,
  };
}

export default async function PhotosPage({ searchParams }: { searchParams?: Promise<{ album?: string; year?: string; tag?: string }> }) {
  const params = await searchParams;
  const photos = await listPhotos({ album: params?.album, year: params?.year, tag: params?.tag }).catch(() => []);
  const facets = await listPhotoFacets().catch(() => ({ albums: [], years: [], tags: [] }));
  const selected = [params?.album, params?.year, params?.tag].filter(Boolean).join(" / ");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#a855f7] mb-2">Photos</p>
            <h1 className="text-[36px] font-semibold tracking-tight">照片墙</h1>
            {photos.length > 0 && <p className="text-sm text-[var(--fg-secondary)] mt-1">{photos.length} 张照片{selected ? ` · ${selected}` : ""}</p>}
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Link href="/photos" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--fg)]">全部照片</Link>
            {facets.albums.map((album) => (
              <Link key={album} href={hrefFor({ album, year: params?.year, tag: params?.tag })} className={`rounded-full border px-3 py-1.5 text-xs ${params?.album === album ? "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>{album}</Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {facets.years.map((year) => (
              <Link key={year} href={hrefFor({ album: params?.album, year, tag: params?.tag })} className={`rounded-full border px-3 py-1.5 text-xs ${params?.year === year ? "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>{year}</Link>
            ))}
            {facets.tags.map((tag) => (
              <Link key={tag} href={hrefFor({ album: params?.album, year: params?.year, tag })} className={`rounded-full border px-3 py-1.5 text-xs ${params?.tag === tag ? "border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7]" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>#{tag}</Link>
            ))}
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-[var(--muted)]">{selected ? "当前筛选下还没有照片" : "还没有照片"}</p>
          </div>
        ) : (
          <PhotoWall photos={photos.map(serializePhoto)} />
        )}
      </div>
    </div>
  );
}
