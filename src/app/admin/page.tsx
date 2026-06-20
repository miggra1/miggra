import { listNotesSafe } from "@/lib/notes";
import { computeStatsFromNotes } from "@/lib/stats";
import Link from "next/link";
import { DbErrorBanner } from "../components/db-error-banner";

export default async function AdminDashboard() {
  const { notes, dbError } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);
  const pinned = notes.filter((n) => n.pinned).length;
  const drafts = notes.filter((n) => n.status === "DRAFT").length;

  const sections = [
    { href: "/admin/notes", label: "碎碎念", desc: "写日记、记录想法", stat: `${notes.length} 条`, color: "#e57c8a", icon: "✎" },
    { href: "/admin/now", label: "Now", desc: "更新当前状态", stat: "状态板", color: "#22c55e", icon: "▸" },
    { href: "/admin/wish", label: "愿望", desc: "管理愿望清单", stat: "许愿瓶", color: "#8b5cf6", icon: "✦" },
    { href: "/admin/reading", label: "书单", desc: "整理在读的书", stat: "书架", color: "#b8763b", icon: "▣" },
    { href: "/admin/inspirations", label: "灵感", desc: "收藏灵感碎片", stat: "便签墙", color: "#ec4899", icon: "◆" },
    { href: "/admin/timeline", label: "时间线", desc: "记录重要节点", stat: "相册", color: "#f59e0b", icon: "◷" },
    { href: "/admin/guestbook", label: "留言板", desc: "审核来访留言", stat: "信箱", color: "#3b82f6", icon: "✉" },
    { href: "/admin/modules", label: "首页模块", desc: "配置首页布局", stat: "控制", color: "#a3a3a3", icon: "⚙" },
  ];

  return (
    <div className="px-6 py-8">
      {dbError ? <DbErrorBanner /> : null}

      {/* 标题 + 统计摘要 */}
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">Dashboard</p>
        <h1 className="mt-2 font-serif text-3xl font-light tracking-wide">控制台</h1>
        <div className="mt-5 flex flex-wrap gap-4 font-mono text-xs text-zinc-500">
          <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5">
            总数 <strong className="text-zinc-200 ml-1">{stats.totalNotes}</strong>
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5">
            已发布 <strong className="text-emerald-400 ml-1">{stats.publishedNotes}</strong>
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5">
            草稿 <strong className="text-amber-400 ml-1">{drafts}</strong>
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5">
            置顶 <strong className="text-rose-400 ml-1">{pinned}</strong>
          </span>
        </div>
      </header>

      {/* 快捷入口卡片 */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 transition hover:border-white/[0.1] hover:bg-white/[0.025] hover:-translate-y-0.5"
          >
            {/* 彩色顶条 */}
            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60 transition group-hover:opacity-100" style={{ backgroundColor: item.color }} />
            <span className="text-2xl">{item.icon}</span>
            <h2 className="mt-4 font-serif text-lg font-medium">{item.label}</h2>
            <p className="mt-1 font-mono text-xs text-zinc-500">{item.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full border border-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] text-zinc-600">{item.stat}</span>
              <span className="font-mono text-xs text-zinc-700 transition group-hover:text-zinc-400">进入 →</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
