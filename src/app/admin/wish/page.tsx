import { listContentItems } from "@/lib/content";
import Link from "next/link";

export default async function AdminWishList() {
  const items = await listContentItems("WISH").catch(() => []);

  return (
    <div className="px-6 py-10 max-w-4xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#8b5cf6]">Wish</p>
          <h1 className="text-[28px] font-semibold mt-1 tracking-tight">愿望清单</h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">{items.length} 个愿望</p>
        </div>
        <Link href="/admin/wish/new" className="btn btn-primary">+ 许愿</Link>
      </div>
      <div className="space-y-0.5">
        {items.length === 0 && <p className="text-center py-20 text-[var(--muted)] text-sm">写下第一个愿望吧</p>}
        {items.map((item, i) => (
          <Link key={item.id} href={`/admin/wish/${item.id}`} className="flex items-center gap-4 px-4 py-3 surface-hover rounded-lg" style={{ animationDelay: `${i * 30}ms` }}>
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.active ? "var(--green)" : "var(--subtle)" }} />
            <span className="text-[12px] text-[var(--muted)] w-20 truncate">{item.status || "—"}</span>
            <span className="flex-1 text-[15px] font-medium truncate">{item.title}</span>
            <span className="text-[var(--subtle)] text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
