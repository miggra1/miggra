import { listContentItems } from "@/lib/content";
import Link from "next/link";

export default async function AdminReadingList() {
  const items = await listContentItems("READING").catch(() => []);

  return (
    <div className="px-6 py-10 max-w-4xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div><p className="text-[11px] uppercase tracking-widest text-[#f59e0b]">Reading</p><h1 className="text-[28px] font-semibold mt-1 tracking-tight">书单</h1><p className="text-sm text-[var(--fg-secondary)] mt-1">{items.length} 本书</p></div>
        <Link href="/admin/reading/new" className="btn btn-primary">+ 加书</Link>
      </div>
      <div className="space-y-0.5">
        {items.length === 0 && <p className="text-center py-20 text-[var(--muted)] text-sm">还没有书，加一本在读的吧</p>}
        {items.map((item, i) => (
          <Link key={item.id} href={`/admin/reading/${item.id}`} className="flex items-center gap-4 px-4 py-3 surface-hover rounded-lg" style={{ animationDelay: `${i * 30}ms` }}>
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.status === "已读完" ? "bg-[var(--green)]" : item.status === "在读" ? "bg-[var(--amber)]" : "bg-[var(--subtle)]"}`} />
            <span className="text-[12px] text-[var(--muted)] w-20 truncate">{item.status || "想读"}</span>
            <span className="flex-1 text-[15px] font-medium truncate">{item.title}</span>
            <span className="text-[var(--subtle)] text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
