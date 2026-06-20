import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTimelineList() {
  const items = await prisma.timelineMilestone.findMany({ orderBy: [{ kind: "asc" }, { order: "asc" }] }).catch(() => []);

  return (
    <div className="px-8 py-10 max-w-4xl animate-in">
      <div className="flex items-center justify-between mb-8">
        <div><p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Timeline</p><h1 className="text-[28px] font-medium mt-1">时间线</h1><p className="text-sm text-[var(--fg-secondary)] mt-1">{items.length} 个节点</p></div>
        <Link href="/admin/timeline/new" className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--accent)] rounded-full transition hover:opacity-90">+ 新建</Link>
      </div>
      <div className="space-y-px">
        {items.map((item: any) => (
          <Link key={item.id} href={`/admin/timeline/${item.id}`} className="flex items-center gap-4 px-4 py-3 rounded-lg transition hover:bg-[var(--card)] group">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.active ? "var(--green)" : "var(--subtle)" }} />
            <span className="text-xs text-[var(--fg-secondary)] min-w-[60px]">{item.year}</span>
            <span className="text-xs text-[var(--fg-secondary)] min-w-[80px]">{item.kind === "PERSONAL" ? "个人" : "站点"}</span>
            <span className="flex-1 text-[15px] truncate">{item.title}</span>
            <span className="text-xs text-[var(--subtle)] opacity-0 group-hover:opacity-100 transition">编辑 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
