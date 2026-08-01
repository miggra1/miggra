import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeStatsFromNotes } from "@/lib/stats";
import { listNotesSafe, listRecentEditableNotes, listScheduledNotes } from "@/lib/notes";
import { listHomePhotos } from "@/lib/photos";

const quickActions = [
  { href: "/admin/notes/new", label: "写一篇记录", desc: "从一个标题或一句话开始", icon: "✎" },
  { href: "/admin/inspirations/new", label: "捕捉灵感", desc: "先放进来，稍后再整理", icon: "✦" },
  { href: "/admin/photos/new", label: "添加影像", desc: "保存今天看见的光", icon: "▧" },
];

export default async function AdminDashboard() {
  const { notes } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);
  const [recentEditable, scheduled, photos] = await Promise.all([
    listRecentEditableNotes().catch(() => notes),
    listScheduledNotes().catch(() => notes.filter((note) => note.status === "SCHEDULED")),
    listHomePhotos(1).catch(() => []),
  ]);
  const recentDrafts = recentEditable.filter((note) => note.status === "DRAFT").slice(0, 4);
  const recentPublished = recentEditable.filter((note) => note.status === "PUBLISHED").slice(0, 4);
  const recent = [...recentDrafts, ...recentPublished].slice(0, 6);
  const continueNote = recentDrafts[0] ?? recentEditable[0] ?? null;

  let contentCounts: Record<string, number> = {};
  try {
    const items = await prisma.contentItem.findMany({ select: { section: true } });
    contentCounts = items.reduce<Record<string, number>>((acc, item) => { acc[item.section] = (acc[item.section] || 0) + 1; return acc; }, {});
  } catch { /* Database may be asleep. */ }

  const heroImage = photos[0]?.url ?? "/uploads/forest-lake.jpg";

  return (
    <div className="studio-dashboard">
      <header className="studio-page-head">
        <div><p>Creative dashboard</p><h1>创作空间</h1></div>
        <Link href="/admin/notes/new" className="studio-head-action">新建记录 <span>↗</span></Link>
      </header>

      <section className="studio-hero">
        <img src={heroImage} alt="林间光影" />
        <div className="studio-hero-shade" />
        <div className="studio-hero-copy">
          <p>Keep making, keep noticing.</p>
          <h2>今天，想留下些什么？</h2>
          <span>不必完整，也不必正确。先把此刻的感受留在这里。</span>
          <Link href="/admin/notes/new">开始写作 <b aria-hidden="true">↗</b></Link>
        </div>
        <div className="studio-hero-status"><i />空间在线</div>
      </section>

      <section className="studio-dashboard-deck">
        <div className="studio-quick-grid">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href} className="studio-quick-card">
              <span>{item.icon}</span><h2>{item.label}</h2><p>{item.desc}</p><b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>

        <Link href={continueNote ? `/admin/notes/${continueNote.id}` : "/admin/notes/new"} className="studio-continue-card">
          <div><p>{continueNote?.status === "DRAFT" ? "Continue draft" : "Recent work"}</p><h2>{continueNote?.title ?? "从第一篇记录开始"}</h2><span>{continueNote ? `上次编辑于 ${new Date(continueNote.updatedAt).toLocaleDateString("zh-CN")}` : "为这个空间留下第一行文字。"}</span></div>
          <strong>继续编辑 <b aria-hidden="true">→</b></strong>
        </Link>
      </section>

      <section className="studio-stats" aria-label="内容统计">
        <div><strong>{stats.totalNotes}</strong><span>全部记录</span></div>
        <div><strong>{recentDrafts.length}</strong><span>待完成草稿</span></div>
        <div><strong>{contentCounts.INSPIRATION ?? 0}</strong><span>灵感收藏</span></div>
        <div><strong>{contentCounts.READING ?? 0}</strong><span>阅读条目</span></div>
      </section>

      <section className="studio-recent">
        <div className="studio-section-head"><div><p>Recent activity</p><h2>继续编辑</h2></div><Link href="/admin/notes">全部记录 ↗</Link></div>
        <div className="studio-recent-list">
          {scheduled.map((note) => (
            <Link key={note.id} href={`/admin/notes/${note.id}`}><i className="is-scheduled" /><div><h3>{note.title}</h3><p>定时发布 · {note.scheduledAt ? new Date(note.scheduledAt).toLocaleString("zh-CN") : "等待发布"}</p></div><span>→</span></Link>
          ))}
          {recent.map((note) => (
            <Link key={note.id} href={`/admin/notes/${note.id}`}><i className={note.status === "PUBLISHED" ? "is-published" : "is-draft"} /><div><h3>{note.title}</h3><p>{note.status === "DRAFT" ? "草稿" : "已发布"} · {new Date(note.updatedAt).toLocaleDateString("zh-CN")}</p></div><span>→</span></Link>
          ))}
          {recent.length === 0 && scheduled.length === 0 ? <div className="studio-empty">还没有内容。第一篇作品正等着你。</div> : null}
        </div>
      </section>
    </div>
  );
}
