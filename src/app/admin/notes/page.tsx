import Link from "next/link";
import { listNotesSafe } from "@/lib/notes";

export default async function AdminNotesList() {
  const { notes } = await listNotesSafe();

  return (
    <div className="studio-page-content">
      <header className="studio-page-head studio-page-head--content">
        <div><p>Writing archive</p><h1>你的记录</h1><span>{notes.length} 篇文字，组成这个空间的时间。</span></div>
        <Link href="/admin/notes/new" className="studio-head-action">写一篇 <b>↗</b></Link>
      </header>

      <section className="studio-record-list">
        <div className="studio-record-list-head"><span>Title</span><span>Status</span><span>Updated</span><span /></div>
        {notes.map((note, index) => (
          <Link key={note.id} href={`/admin/notes/${note.id}`} className="studio-record-row">
            <span className="studio-record-index">{String(index + 1).padStart(2, "0")}</span>
            <div><p>{note.tag}{note.pinned ? " · 置顶" : ""}</p><h2>{note.title}</h2></div>
            <span className={`studio-record-status is-${note.status.toLowerCase()}`}><i />{note.status === "DRAFT" ? "草稿" : note.status === "SCHEDULED" ? "定时" : "已发布"}</span>
            <time>{new Date(note.updatedAt).toLocaleDateString("zh-CN")}</time>
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
        {notes.length === 0 ? <div className="studio-empty studio-empty--large"><p>这里还没有文字。</p><Link href="/admin/notes/new">写下第一篇 ↗</Link></div> : null}
      </section>
    </div>
  );
}
