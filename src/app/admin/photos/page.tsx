import { listPhotoFacets, listPhotos } from "@/lib/photos";
import { DeleteButton } from "./delete-button";
import Link from "next/link";

function hrefFor(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `/admin/photos?${query}` : "/admin/photos";
}

export default async function AdminPhotosList({ searchParams }: { searchParams?: Promise<{ album?: string; year?: string; status?: string; featured?: string }> }) {
  const params = await searchParams;
  const status = params?.status ?? "all";
  const photos = await listPhotos({
    includeInactive: true,
    album: params?.album,
    year: params?.year,
    featured: params?.featured === "1" ? true : undefined,
    active: status === "active" ? true : status === "hidden" ? false : undefined,
  }).catch(() => []);
  const facets = await listPhotoFacets({ includeInactive: true }).catch(() => ({ albums: [], years: [], tags: [] }));

  return (
    <div className="px-6 py-10 max-w-5xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#a855f7]">Photos</p>
          <h1 className="text-[28px] font-semibold mt-1 tracking-tight">照片墙</h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">{photos.length} 张</p>
        </div>
        <Link href="/admin/photos/new" className="btn btn-primary">+ 上传照片</Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={hrefFor({ album: params?.album, year: params?.year, featured: params?.featured })} className={`rounded-full border px-3 py-1.5 text-xs ${status === "all" ? "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10" : "border-[var(--border)] text-[var(--muted)]"}`}>全部状态</Link>
        <Link href={hrefFor({ album: params?.album, year: params?.year, featured: params?.featured, status: "active" })} className={`rounded-full border px-3 py-1.5 text-xs ${status === "active" ? "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10" : "border-[var(--border)] text-[var(--muted)]"}`}>启用</Link>
        <Link href={hrefFor({ album: params?.album, year: params?.year, featured: params?.featured, status: "hidden" })} className={`rounded-full border px-3 py-1.5 text-xs ${status === "hidden" ? "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10" : "border-[var(--border)] text-[var(--muted)]"}`}>隐藏</Link>
        <Link href={hrefFor({ album: params?.album, year: params?.year, status, featured: params?.featured === "1" ? undefined : "1" })} className={`rounded-full border px-3 py-1.5 text-xs ${params?.featured === "1" ? "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10" : "border-[var(--border)] text-[var(--muted)]"}`}>精选</Link>
        <Link href="/admin/photos" className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">清空筛选</Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {facets.albums.map((album) => (
          <Link key={album} href={hrefFor({ album, year: params?.year, status, featured: params?.featured })} className={`rounded-full border px-3 py-1.5 text-xs ${params?.album === album ? "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10" : "border-[var(--border)] text-[var(--muted)]"}`}>{album}</Link>
        ))}
        {facets.years.map((year) => (
          <Link key={year} href={hrefFor({ album: params?.album, year, status, featured: params?.featured })} className={`rounded-full border px-3 py-1.5 text-xs ${params?.year === year ? "border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10" : "border-[var(--border)] text-[var(--muted)]"}`}>{year}</Link>
        ))}
      </div>

      {photos.length === 0 ? (
        <p className="text-center py-20 text-[var(--muted)] text-sm">还没有照片，上传第一张吧</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="aspect-square overflow-hidden">
                <img src={photo.url} alt={photo.caption ?? ""} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium truncate">{photo.caption || "未命名照片"}</p>
                <p className="text-[11px] text-[var(--muted)] truncate">{photo.album || "未分相册"}{photo.takenAt ? ` · ${photo.takenAt.toISOString().slice(0, 10)}` : ""}</p>
                <div className="flex flex-wrap gap-1">
                  {photo.featured && <span className="rounded-full bg-purple-400/15 px-2 py-0.5 text-[10px] text-purple-300">精选</span>}
                  {!photo.active && <span className="rounded-full bg-slate-400/15 px-2 py-0.5 text-[10px] text-slate-300">隐藏</span>}
                  {photo.location && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-[var(--muted)]">{photo.location}</span>}
                </div>
              </div>
              <div className="absolute inset-x-0 top-0 flex justify-end gap-2 bg-gradient-to-b from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <Link href={`/admin/photos/${photo.id}`} className="text-[10px] text-white/90 hover:text-white">编辑</Link>
                <DeleteButton id={photo.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
