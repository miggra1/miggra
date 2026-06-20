import { listNotesSafe } from "@/lib/notes";
import { computeStatsFromNotes } from "@/lib/stats";
import Link from "next/link";

const sections = [
  { href: "/admin/notes", label: "碎碎念", desc: "写日记、记录想法和情绪", color: "#3b82f6", bg: "rgba(59,130,246,0.06)", icon: "✎" },
  { href: "/admin/now", label: "Now", desc: "更新当前在做什么、学什么", color: "#22c55e", bg: "rgba(34,197,94,0.06)", icon: "▸" },
  { href: "/admin/wish", label: "愿望清单", desc: "写下想去的地方、想做的事", color: "#8b5cf6", bg: "rgba(139,92,246,0.06)", icon: "✦" },
  { href: "/admin/reading", label: "书单", desc: "整理正在读和想读的书", color: "#f59e0b", bg: "rgba(245,158,11,0.06)", icon: "▣" },
  { href: "/admin/inspirations", label: "灵感", desc: "收集忽然冒出来的点子", color: "#ec4899", bg: "rgba(236,72,153,0.06)", icon: "◆" },
  { href: "/admin/timeline", label: "时间线", desc: "记录人生和站点的节点", color: "#06b6d4", bg: "rgba(6,182,212,0.06)", icon: "◷" },
  { href: "/admin/guestbook", label: "留言板", desc: "审核路过留下的足迹", color: "#f97316", bg: "rgba(249,115,22,0.06)", icon: "✉" },
  { href: "/admin/modules", label: "首页模块", desc: "配置前台展示哪些内容", color: "#6b7280", bg: "rgba(107,114,128,0.05)", icon: "⚙" },
];

export default async function AdminDashboard() {
  const { notes } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);

  return (
    <div className="px-6 py-10 max-w-5xl animate-in">
      {/* Greeting */}
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-widest text-[var(--muted)]">创作空间</p>
        <h1 className="text-[32px] font-semibold mt-2 tracking-tight">今天想写点什么？</h1>
        <p className="text-[var(--fg-secondary)] mt-2 text-sm">{stats.totalNotes} 条碎念 · {stats.publishedNotes} 已发布 · {stats.tagCount} 个标签</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        {[
          { label: "总计", value: stats.totalNotes, color: "#3b82f6" },
          { label: "已发布", value: stats.publishedNotes, color: "#22c55e" },
          { label: "草稿", value: stats.draftNotes, color: "#f59e0b" },
          { label: "置顶", value: stats.pinnedNotes, color: "#ec4899" },
        ].map((s) => (
          <div key={s.label} className="surface-raised p-4 text-center">
            <div className="text-[28px] font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] text-[var(--muted)] mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="group card flex items-center gap-4 px-5 py-4 relative overflow-hidden"
            style={{ borderLeft: `2px solid ${s.color}20` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300" style={{ background: s.bg }} />
            <span className="relative shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-medium"
              style={{ backgroundColor: s.bg, color: s.color }}>
              {s.icon}
            </span>
            <div className="relative flex-1 min-w-0">
              <p className="text-[15px] font-semibold">{s.label}</p>
              <p className="text-[12px] text-[var(--muted)] mt-0.5">{s.desc}</p>
            </div>
            <span className="relative text-[var(--subtle)] text-xs opacity-0 group-hover:opacity-100 transition">进入 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
