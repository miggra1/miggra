import { listPhotos } from "@/lib/photos";
import { DeleteButton } from "./delete-button";
import Link from "next/link";

export default async function AdminPhotosList() {
  const photos = await listPhotos().catch(() => []);

  return (
    <div className="px-6 py-10 max-w-4xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#a855f7]">Photos</p>
          <h1 className="text-[28px] font-semibold mt-1 tracking-tight">照片墙</h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">{photos.length} 张</p>
        </div>
        <Link href="/admin/photos/new" className="btn btn-primary">+ 上传照片</Link>
      </div>

      {photos.length === 0 ? (
        <p className="text-center py-20 text-[var(--muted)] text-sm">还没有照片，上传第一张吧</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)]">
              <img
                src={photo.url}
                alt={photo.caption ?? ""}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end p-2">
                <DeleteButton id={photo.id} />
              </div>
              {photo.caption && (
                <p className="absolute bottom-0 inset-x-0 p-2 text-[10px] text-white bg-gradient-to-t from-black/60 to-transparent truncate">
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
