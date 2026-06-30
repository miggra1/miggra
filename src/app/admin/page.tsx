import { listNotesSafe, listRecentEditableNotes, listScheduledNotes } from "@/lib/notes";
import { computeStatsFromNotes } from "@/lib/stats";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const sections = [
  { href: "/admin/notes/new", label: "写碎碎念", desc: "记录想法和情绪", color: "#3b82f6", icon: "✎" },
  { href: "/admin/now/new", label: "更新 Now", desc: "此刻在做什么", color: "#22c55e", icon: "▸" },
  { href: "/admin/wish/new", label: "许个愿望", desc: "想去的地方、想做的事", color: "#8b5cf6", icon: "✦" },
  { href: "/admin/reading/new", label: "加一本书", desc: "在读、读过、想读", color: "#f59e0b", icon: "▣" },
  { href: "/admin/inspirations/new", label: "记灵感", desc: "先放进待整理收集箱", color: "#ec4899", icon: "◆" },
  { href: "/admin/timeline/new", label: "加节点", desc: "人生和站点的变化", color: "#06b6d4", icon: "◷" },
];

export default async function AdminDashboard() {
  const { notes } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);

  // 最近草稿 & 定时发布
  const recentEditable = await listRecentEditableNotes().catch(() => notes);
  const scheduled = await listScheduledNotes().catch(() => notes.filter((n) => n.status === "SCHEDULED"));
  const recentDrafts = recentEditable.filter((n) => n.status === "DRAFT").slice(0, 4);
  const recentPublished = recentEditable.filter((n) => n.status === "PUBLISHED").slice(0, 4);
  const all = [...recentDrafts, ...recentPublished].slice(0, 6);

  // 获取各专区计数
  let contentCounts: Record<string, number> = {};
  try {
    const items = await prisma.contentItem.findMany({ select: { section: true } });
    contentCounts = items.reduce<Record<string, number>>((acc, i) => { acc[i.section] = (acc[i.section] || 0) + 1; return acc; }, {});
  } catch { /* DB may be asleep */ }

  return (
    <div className="px-6 py-10 max-w-5xl animate-in">
      {/* ── 问候 ── */}
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-widest text-[var(--muted)]">创作空间</p>
        <h1 className="text-[32px] font-semibold mt-2 tracking-tight">今天想写点什么？</h1>
      </div>

      {/* ── 快捷新建 ── */}
      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)] mb-4">快速开始</p>
        <div className="grid gap-3 md:grid-cols-3">
          {sections.map((s) => (
            <Link key={s.href} href={s.href}
              className="flex items-center gap-3 px-5 py-4 rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:bg-[var(--card-strong)] hover:-translate-y-0.5"
            >
              <span className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${s.color}15`, color: s.color }}>{s.icon}</span>
              <div>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-[11px] text-[var(--muted)]">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 统计 ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {[
          { label: "碎念", value: stats.totalNotes, color: "#3b82f6" },
          { label: "Now", value: contentCounts["NOW"] ?? 0, color: "#22c55e" },
          { label: "愿望", value: contentCounts["WISH"] ?? 0, color: "#8b5cf6" },
          { label: "书单", value: contentCounts["READING"] ?? 0, color: "#f59e0b" },
          { label: "灵感", value: contentCounts["INSPIRATION"] ?? 0, color: "#ec4899" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
            <div className="text-2xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] text-[var(--muted)] mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── 最近编辑 ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">继续编辑</p>
          <Link href="/admin/notes" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition">全部 →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {all.length === 0 && scheduled.length === 0 && (
            <p className="text-sm text-[var(--muted)] col-span-full py-4">还没有内容，点上方按钮开始写吧 ✎</p>
          )}
          {scheduled.map((note) => (
            <Link key={note.id} href={`/admin/notes/${note.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-purple-400/20 bg-purple-400/5 transition hover:bg-purple-400/10"
            >
              <span className="h-2 w-2 rounded-full shrink-0 bg-[var(--purple)]" />
              <span className="text-sm font-medium truncate flex-1">{note.title}</span>
              <span className="text-[11px] text-[var(--muted)]">⏳ {note.scheduledAt ? new Date(note.scheduledAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "定时"}</span>
            </Link>
          ))}
          {all.map((note) => (
            <Link key={note.id} href={`/admin/notes/${note.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:bg-[var(--card-strong)]"
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: note.status === "PUBLISHED" ? "var(--green)" : note.status === "SCHEDULED" ? "var(--purple)" : "var(--amber)" }} />
              <span className="text-sm font-medium truncate flex-1">{note.title}</span>
              <span className="text-[11px] text-[var(--muted)]">{note.status === "DRAFT" ? `草稿 · ${new Date(note.updatedAt).toLocaleDateString("zh-CN")}` : note.status === "SCHEDULED" ? "⏳ 定时" : "已发布"}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
