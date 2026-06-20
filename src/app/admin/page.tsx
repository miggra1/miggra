import { listNotesSafe } from "@/lib/notes";
import { computeStatsFromNotes } from "@/lib/stats";
import Link from "next/link";

const sections = [
  { href: "/admin/notes", label: "碎碎念", desc: "写日记、记录想法", color: "#2997ff" },
  { href: "/admin/now", label: "Now", desc: "更新当前状态", color: "#30d158" },
  { href: "/admin/wish", label: "愿望", desc: "管理愿望清单", color: "#bf5af2" },
  { href: "/admin/reading", label: "书单", desc: "整理在读的书", color: "#ff9f0a" },
  { href: "/admin/inspirations", label: "灵感", desc: "收藏灵感碎片", color: "#ff375f" },
  { href: "/admin/timeline", label: "时间线", desc: "记录重要节点", color: "#ff9f0a" },
  { href: "/admin/guestbook", label: "留言板", desc: "审核来访留言", color: "#5ac8fa" },
  { href: "/admin/modules", label: "首页模块", desc: "配置首页布局", color: "#86868b" },
];

export default async function AdminDashboard() {
  const { notes } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);

  return (
    <div className="px-8 py-10 max-w-4xl animate-in">
      <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Dashboard</p>
      <h1 className="text-[28px] font-medium mt-2 mb-2">控制台</h1>
      <div className="flex gap-4 text-sm text-[var(--fg-secondary)] mb-10">
        <span>{stats.totalNotes} 条碎念</span>
        <span>·</span>
        <span>{stats.publishedNotes} 已发布</span>
        <span>·</span>
        <span>{stats.tagCount} 个标签</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition hover:bg-[var(--card-hover)]"
          >
            <span className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: s.color }}>
              {s.label[0]}
            </span>
            <div>
              <p className="text-[15px] font-medium">{s.label}</p>
              <p className="text-xs text-[var(--fg-secondary)]">{s.desc}</p>
            </div>
            <span className="ml-auto text-xs text-[var(--subtle)] opacity-0 transition group-hover:opacity-100">进入 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
