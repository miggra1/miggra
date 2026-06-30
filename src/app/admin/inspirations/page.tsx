import { listContentItemsForAdmin } from "@/lib/content";
import Link from "next/link";

const statuses = ["待整理", "已整理", "已转化", "归档"];

export default async function AdminInspirationsList({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const activeStatus = params?.status ?? "待整理";
  const items = await listContentItemsForAdmin("INSPIRATION").catch(() => []);
  const filtered = activeStatus === "全部" ? items : items.filter((item) => (item.status ?? "待整理") === activeStatus);

  return (
    <div className="px-6 py-10 max-w-4xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-[#ec4899]">Inspiration Inbox</p>
          <h1 className="text-[28px] font-semibold mt-1 tracking-tight">灵感收集箱</h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">{filtered.length} 条 · 默认先看待整理</p>
        </div>
        <Link href="/admin/inspirations/new" className="btn btn-primary">+ 快速记录</Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["全部", ...statuses].map((status) => (
          <Link
            key={status}
            href={status === "待整理" ? "/admin/inspirations" : `/admin/inspirations?status=${encodeURIComponent(status)}`}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeStatus === status
                ? "border-[#ec4899] bg-[#ec4899]/10 text-[#ec4899]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <div className="space-y-0.5">
        {filtered.length === 0 && <p className="text-center py-20 text-[var(--muted)] text-sm">这个状态下还没有灵感。想到什么先丢进来吧。</p>}
        {filtered.map((item, i) => (
          <Link key={item.id} href={`/admin/inspirations/${item.id}`} className="flex items-center gap-4 px-4 py-3 surface-hover rounded-lg" style={{ animationDelay: `${i * 30}ms` }}>
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.status === "待整理" ? "#f59e0b" : item.status === "已整理" ? "#3b82f6" : item.status === "已转化" ? "#22c55e" : "#94a3b8" }} />
            <span className="text-[12px] text-[var(--muted)] w-20 truncate">{item.status ?? "待整理"}</span>
            <span className="flex-1 text-[15px] font-medium truncate">{item.title}</span>
            <span className="text-[12px] text-[var(--subtle)] w-20 truncate">{item.meta || "灵感"}</span>
            <span className="text-[var(--subtle)] text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
