import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTimelineList() {
  const items = await prisma.timelineMilestone.findMany({ orderBy: [{ kind: "asc" }, { order: "asc" }] }).catch(() => []);

  return (
    <div className="px-6 py-10 max-w-4xl animate-in">
      <div className="flex items-end justify-between mb-8">
        <div><p className="text-[11px] uppercase tracking-widest text-[#06b6d4]">Timeline</p><h1 className="text-[28px] font-semibold mt-1 tracking-tight">时间线</h1><p className="text-sm text-[var(--fg-secondary)] mt-1">{items.length} 个节点</p></div>
        <Link href="/admin/timeline/new" className="btn btn-primary">+ 新节点</Link>
      </div>
      <div className="space-y-0.5">
        {items.length === 0 && <p className="text-center py-20 text-[var(--muted)] text-sm">还没有节点，记下第一个吧</p>}
        {items.map((item: any, i: number) => (
          <Link key={item.id} href={`/admin/timeline/${item.id}`} className="flex items-center gap-4 px-4 py-3 surface-hover rounded-lg" style={{ animationDelay: `${i * 30}ms` }}>
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.kind === "PERSONAL" ? "var(--purple)" : "var(--cyan)" }} />
            <span className="text-[12px] text-[var(--muted)] w-12">{item.year}</span>
            <span className="text-[12px] text-[var(--muted)] w-16">{item.kind === "PERSONAL" ? "个人" : "站点"}</span>
            <span className="flex-1 text-[15px] font-medium truncate">{item.title}</span>
            <span className="text-[var(--subtle)] text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
