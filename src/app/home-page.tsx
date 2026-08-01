import Link from "next/link";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";
import { DbErrorBanner } from "./components/db-error-banner";
import { WriteButton } from "./components/write-button";
import { QuickCapture } from "./components/quick-capture";
import { listContentItemsSafe } from "@/lib/content";
import { moodFor, NOTE_MOODS } from "@/lib/note-mood";
import { getHomePageData, getOnThisDayNotes } from "@/lib/notes";
import { listHomePhotos } from "@/lib/photos";

function daysAgo(date: Date): number {
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function writingStatus(latestNoteAt: Date | null, publishedCount: number): { text: string; tone: "fresh" | "warm" | "quiet" } {
  if (!latestNoteAt) return { text: publishedCount > 0 ? "继续写点什么吧" : "写下第一篇吧", tone: "quiet" };
  const days = daysAgo(latestNoteAt);
  if (days === 0) return { text: "今天写过了", tone: "fresh" };
  if (days === 1) return { text: "昨天刚写过", tone: "warm" };
  if (days <= 7) return { text: `上次落笔是 ${days} 天前`, tone: "warm" };
  return { text: `上一支笔，已经放下 ${days} 天`, tone: "quiet" };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date(date));
}

function yearLabel(date: Date): string {
  const yearDiff = new Date().getFullYear() - date.getFullYear();
  if (yearDiff === 1) return "一年前的今天";
  if (yearDiff === 2) return "两年前的今天";
  return `${yearDiff} 年前的今天`;
}

export async function HomePage() {
  const { notes, stats, dbError } = await getHomePageData();
  const [photos, onThisDayNotes, now, wish, reading, inspirations] = await Promise.all([
    listHomePhotos(5).catch(() => []),
    getOnThisDayNotes().catch(() => []),
    listContentItemsSafe("NOW"),
    listContentItemsSafe("WISH"),
    listContentItemsSafe("READING"),
    listContentItemsSafe("INSPIRATION"),
  ]);

  const published = notes.filter((note) => note.status === "PUBLISHED");
  const latest = published.slice(0, 4);
  const featured = published.find((note) => note.pinned) ?? latest[0] ?? null;
  const random = published.length ? published[new Date().getDate() % published.length] : null;
  const status = writingStatus(stats.latestNoteAt, published.length);
  const heroPhoto = photos[0] ?? null;
  const recentForMood = published.slice(0, 12);
  const moodSpectrum = NOTE_MOODS.map((mood) => ({
    ...mood,
    count: recentForMood.filter((note) => moodFor(note) === mood.value).length,
  })).filter((mood) => mood.count > 0);

  const modules = [
    { href: "/now", title: "此刻", count: now.items.length, latest: now.items[0]?.title },
    { href: "/wish", title: "愿望", count: wish.items.length, latest: wish.items[0]?.title },
    { href: "/reading", title: "阅读", count: reading.items.length, latest: reading.items[0]?.title },
    { href: "/inspirations", title: "灵感", count: inspirations.items.length, latest: inspirations.items[0]?.title },
  ];

  return (
    <>
      {dbError ? <DbErrorBanner /> : null}
      <main className="workspace">
        <div className="workspace-inner">
          <div className="workspace-kicker">
            <span>Personal studio / Miggra</span>
            <span>{new Intl.DateTimeFormat("zh-CN", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</span>
          </div>

          <section className="workspace-heading" aria-labelledby="workspace-title">
            <h1 id="workspace-title">把灵感，放到<br /><em>会生长的地方。</em></h1>
            <p className="workspace-heading-copy">一个留给自己，也欢迎偶尔路过的<strong>创作空间</strong>。在这里，把日常的观察、未完成的想法和那些还说不清的情绪，慢慢整理成形。</p>
          </section>

          <section className="workspace-grid" aria-label="创作工作台">
            <div className="workspace-main">
              <section className="workspace-panel workspace-panel--accent" aria-labelledby="capture-title">
                <div className="workspace-panel-header">
                  <span className="workspace-label">Quick capture</span>
                  <span className="workspace-command"><kbd>⌘</kbd><kbd>↵</kbd></span>
                </div>
                <QuickCapture />
              </section>

              {featured ? (
                <Link href={`/notes/${featured.id}`} className="workspace-panel workspace-note-feature">
                  <div className="workspace-note-feature-copy">
                    <div>
                      <div className="workspace-note-feature-meta">
                        <span>精选记录</span>
                        <span>{featured.tag}</span>
                        <time>{formatDate(featured.createdAt)}</time>
                      </div>
                      <h2 className="workspace-note-feature-title">{featured.title}</h2>
                      <div className="workspace-note-feature-excerpt line-clamp-3"><MarkdownRenderer preview>{featured.text}</MarkdownRenderer></div>
                    </div>
                    <span className="workspace-note-feature-link">打开这篇记录</span>
                  </div>
                  <div className="workspace-note-feature-media">
                    {featured.coverImage ? <img src={featured.coverImage} alt="" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(200,167,255,.42),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(240,160,126,.3),transparent_35%),var(--bg-surface)]" />}
                  </div>
                </Link>
              ) : (
                <section className="workspace-panel workspace-memory">
                  <span className="workspace-label">First note</span>
                  <h2>给这个空间留下第一笔。</h2>
                  <p>每个创作空间都从一句不完整的话开始。今天也可以只是一个标题，或者一段还没想明白的文字。</p>
                  <WriteButton variant="compact" />
                </section>
              )}

              <section className="workspace-panel" aria-labelledby="latest-title">
                <div className="workspace-panel-header">
                  <span id="latest-title" className="workspace-label">Recent notes</span>
                  <Link href="/notes" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">查看全部 ↗</Link>
                </div>
                <div className="workspace-list">
                  {latest.length > 0 ? latest.map((note, index) => (
                    <Link key={note.id} href={`/notes/${note.id}`} className="workspace-list-item">
                      <span className="workspace-list-index">0{index + 1}</span>
                      <div className="min-w-0">
                        <div className="workspace-list-title">{note.title}</div>
                        <div className="workspace-list-excerpt"><MarkdownRenderer preview>{note.text}</MarkdownRenderer></div>
                      </div>
                      <time className="workspace-list-date">{formatDate(note.createdAt)}</time>
                    </Link>
                  )) : (
                    <div className="py-8 text-sm text-[var(--muted)]">还没有公开的记录，写下第一篇吧。</div>
                  )}
                </div>
              </section>
            </div>

            <aside className="workspace-side">
              <section className="workspace-panel workspace-side-panel" aria-label="写作状态">
                <div className="workspace-label">Writing signal</div>
                <div className={`workspace-signal-value ${status.tone === "fresh" ? "text-emerald-300" : status.tone === "warm" ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>{status.text}</div>
                <p className="workspace-signal-copy">已积累 {published.length} 篇记录。保持一点节奏，比追求完整更重要。</p>
                {moodSpectrum.length > 0 ? (
                  <>
                    <div className="workspace-signal-bar" aria-label="近期情绪分布">
                      {moodSpectrum.map((mood) => <span key={mood.value} className={mood.barClass} style={{ flexGrow: mood.count }} />)}
                    </div>
                    <div className="workspace-signal-legend">
                      {moodSpectrum.slice(0, 4).map((mood) => <span key={mood.value}><i className={mood.dotClass} />{mood.label}</span>)}
                    </div>
                  </>
                ) : null}
              </section>

              {heroPhoto ? (
                <Link href="/photos" className="workspace-panel workspace-photo">
                  <img src={heroPhoto.url} alt={heroPhoto.caption ?? "最近的一张照片"} />
                  <div className="workspace-photo-caption"><span><strong>最近看见的光</strong><br />{heroPhoto.caption ?? "一张还留在记忆里的照片"}</span><span aria-hidden="true">↗</span></div>
                </Link>
              ) : null}

              <section className="workspace-panel workspace-modules" aria-labelledby="modules-title">
                <div id="modules-title" className="workspace-label">Your orbit</div>
                {modules.map((module) => (
                  <Link key={module.href} href={module.href} className="workspace-module">
                    <span className="workspace-module-copy"><i className="workspace-module-dot" /><span className="workspace-module-title">{module.latest ? `${module.title} · ${module.latest}` : module.title}</span></span>
                    <span className="workspace-module-count">{module.count}</span>
                  </Link>
                ))}
              </section>
            </aside>
          </section>

          <section className="workspace-bottom">
            {onThisDayNotes.length > 0 ? (
              <section className="workspace-panel workspace-memory">
                <span className="workspace-label">On this day</span>
                <h2>{yearLabel(new Date(onThisDayNotes[0].createdAt))}</h2>
                <p>{onThisDayNotes[0].title}。有些念头不会过期，只是在等下一次被想起。</p>
                <Link href={`/notes/${onThisDayNotes[0].id}`} className="workspace-memory-link">回到那一天 ↗</Link>
              </section>
            ) : random ? (
              <section className="workspace-panel workspace-memory">
                <span className="workspace-label">A random line</span>
                <h2>随手抽一条</h2>
                <p>“{random.text.length > 120 ? `${random.text.slice(0, 120)}…` : random.text}”</p>
                <Link href={`/notes/${random.id}`} className="workspace-memory-link">打开原文 ↗</Link>
              </section>
            ) : (
              <section className="workspace-panel workspace-memory"><span className="workspace-label">A small invitation</span><h2>留一点空白给自己。</h2><p>当没有灵感的时候，看看窗外也算创作的一部分。</p></section>
            )}

            {photos.length > 1 ? (
              <section className="workspace-panel workspace-side-panel">
                <div className="flex items-center justify-between gap-3"><span className="workspace-label">Visual notes</span><Link href="/photos" className="text-xs text-[var(--muted)] transition hover:text-[var(--fg)]">照片墙 ↗</Link></div>
                <div className="workspace-photo-strip mt-4">
                  {photos.slice(1, 4).map((photo) => <Link key={photo.id} href="/photos"><img src={photo.url} alt={photo.caption ?? ""} /></Link>)}
                </div>
              </section>
            ) : (
              <section className="workspace-panel workspace-memory"><span className="workspace-label">Visual notes</span><h2>把看到的也留下。</h2><p>照片、颜色、路边的一束光，都可以成为下一篇记录的起点。</p><Link href="/photos" className="workspace-memory-link">进入照片墙 ↗</Link></section>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
