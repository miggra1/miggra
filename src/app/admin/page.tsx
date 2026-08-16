import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { computeStatsFromNotes } from "@/lib/stats";
import { listNotesSafe, listRecentEditableNotes, listScheduledNotes } from "@/lib/notes";
import { listHomePhotos } from "@/lib/photos";
import { StudioIcon } from "./studio-icon";

const quickActions = [
  { href: "/admin/inspirations/new", label: "新建灵感", desc: "随时记录突如其来的想法", icon: "sparkle" as const, tone: "violet" },
  { href: "/admin/photos/new", label: "添加影像", desc: "用画面捕捉情绪与灵感", icon: "image" as const, tone: "green" },
  { href: "/admin/notes/new", label: "写一篇记录", desc: "让文字成为灵感的语言", icon: "file" as const, tone: "blue" },
  { href: "/admin/pages/new", label: "创作工具箱", desc: "建立页面，整理更多可能", icon: "grid" as const, tone: "purple" },
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

  const recentImage = photos[0]?.url ?? "/uploads/starry-night.jpg";
  const recentExcerpt = continueNote?.text?.replace(/\s+/g, " ").trim().slice(0, 54) || "雾散之后，山川会记得来过的风。";

  return (
    <div className="studio-dashboard">
      <section className="studio-hero">
        <Image src="/uploads/mountain-lake.jpg" alt="深夜云海与远山" fill sizes="(max-width: 840px) 100vw, (max-width: 1260px) calc(100vw - 260px), calc(100vw - 320px)" preload />
        <div className="studio-hero-shade" />
        <div className="studio-hero-copy">
          <p>Keep writing, keep noticing</p>
          <h1>今天，<br />想留下些什么？</h1>
          <span>每一个想法都值得被记录，<br />它们是未来作品的种子。</span>
          <Link href="/admin/notes/new"><StudioIcon name="sparkle" size={18} />开始创作</Link>
        </div>
        <div className="studio-scene-props" aria-hidden="true">
          <span className="studio-prop-book" />
          <span className="studio-prop-pen" />
          <span className="studio-prop-cup" />
          <span className="studio-lantern"><i className="studio-lantern-handle" /><i className="studio-lantern-cap" /><i className="studio-lantern-glass"><b /></i><i className="studio-lantern-base" /></span>
        </div>
      </section>

      <section className="studio-workbench">
        <h2>创作工作台</h2>
        <div className="studio-workbench-grid">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href} className={`studio-quick-card is-${item.tone}`}>
              <span><StudioIcon name={item.icon} size={22} /></span><h3>{item.label}</h3><p>{item.desc}</p><b aria-hidden="true"><StudioIcon name="arrow" size={22} /></b>
            </Link>
          ))}

          <article className="studio-continue-card">
            <h3>最近记录</h3>
            <div className="studio-continue-summary">
              <span className="studio-continue-thumb" style={{ backgroundImage: `url(${recentImage})` }} />
              <div><strong>{continueNote?.title ?? "深夜灵感"}</strong><time>{continueNote ? `上次编辑于 ${new Date(continueNote.updatedAt).toLocaleDateString("zh-CN")}` : "等待第一篇作品"}</time></div>
            </div>
            <p>“{recentExcerpt}{recentExcerpt.length >= 54 ? "…" : ""}”</p>
            <div className="studio-continue-actions">
              <Link href={continueNote ? `/admin/notes/${continueNote.id}` : "/admin/notes/new"}>继续编辑</Link>
              <Link href="/admin/notes" aria-label="查看全部记录">•••</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="studio-dashboard-lower">
        <div className="studio-stats" aria-label="内容统计">
          <div><strong>{stats.totalNotes}</strong><span>全部记录</span></div>
          <div><strong>{recentDrafts.length}</strong><span>待完成草稿</span></div>
          <div><strong>{contentCounts.INSPIRATION ?? 0}</strong><span>灵感收藏</span></div>
          <div><strong>{contentCounts.READING ?? 0}</strong><span>阅读条目</span></div>
        </div>

        <div className="studio-recent">
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
        </div>
      </section>
    </div>
  );
}
