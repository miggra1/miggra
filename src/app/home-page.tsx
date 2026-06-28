import Link from "next/link";
import { getHomePageData, getOnThisDayNotes } from "@/lib/notes";
import { DbErrorBanner } from "./components/db-error-banner";
import { FeatureHub } from "./components/feature-hub";
import { getHomepageModulesSafe } from "@/lib/homepage";
import { listPhotos } from "@/lib/photos";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

const fallbackFeatureCards = [
  { href: "/now", label: "Now", title: "当前状态", description: "记录最近在做什么、在学什么。", count: "3" },
  { href: "/wish", label: "Wish", title: "愿望清单", description: "把想做的事先放在这里。", count: "4" },
  { href: "/reading", label: "Reading", title: "书单", description: "整理正在读和想读的书。", count: "3" },
  { href: "/inspirations", label: "Idea", title: "灵感收集", description: "把点子、备忘和小想法存起来。", count: "3" },
  { href: "/timeline", label: "Timeline", title: "人生节点", description: "看见这个站是怎么长出来的。", count: "3" },
  { href: "/photos", label: "Photos", title: "照片墙", description: "用照片记录生活里的光。", count: "0" },
];

function daysAgo(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function writingStatus(latestNoteAt: Date | null, publishedCount: number): { text: string; tone: "fresh" | "warm" | "quiet" } {
  if (!latestNoteAt) return { text: "写下第一篇吧。", tone: "quiet" };
  const days = daysAgo(latestNoteAt);
  if (days === 0) return { text: "今天写过了 ✨", tone: "fresh" };
  if (days === 1) return { text: "昨天刚写过，今天还想写吗？", tone: "warm" };
  if (days <= 3) return { text: `上次写作是 ${days} 天前`, tone: "warm" };
  if (days <= 7) return { text: `已经 ${days} 天没写了`, tone: "quiet" };
  if (days <= 30) return { text: `上次写东西是 ${days} 天前了`, tone: "quiet" };
  return { text: `上一次落笔，已经过去了 ${days} 天`, tone: "quiet" };
}

function yearLabel(date: Date): string {
  const yearDiff = new Date().getFullYear() - date.getFullYear();
  if (yearDiff === 1) return "一年前的今天";
  if (yearDiff === 2) return "两年前的今天";
  return `${yearDiff} 年前的今天`;
}

export async function HomePage() {
  const { notes, stats, dbError } = await getHomePageData();
  const { modules, dbError: modulesDbError } = await getHomepageModulesSafe();
  const photos = await listPhotos().catch(() => []);
  const onThisDayNotes = await getOnThisDayNotes().catch(() => []);
  const published = notes.filter((note) => note.status === "PUBLISHED");
  const latest = published.slice(0, 6);
  const pinned = published.find((note) => note.pinned);
  const random = published[Math.floor(Math.random() * Math.max(published.length, 1))] ?? null;

  const tags = Array.from(new Set(published.map((note) => note.tag))).slice(0, 6);
  const featureCards = (modules.length ? modules : fallbackFeatureCards)
    .map((item) =>
      "key" in item
        ? { href: `/${item.key}`, label: item.title, title: item.title, description: item.title, count: "1" }
        : item,
    )
    .filter((item) => !("enabled" in item) || item.enabled !== false);

  const status = writingStatus(stats.latestNoteAt, published.length);

  return (
    <>
      {dbError || modulesDbError ? <DbErrorBanner /> : null}
      <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,120,196,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.14),transparent_30%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        {/* ── Hero ── */}
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
              一个安静但有光的地方
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--subtle)]">Miggra Journal</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
                把日常、想法和情绪，放进一个很安静但很有光的地方。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                这里没有算法，没有打扰。只有慢慢生长的文字、灵感和生活碎片。
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/admin/notes/new" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:scale-[1.02] hover:opacity-90">
                写点东西
              </Link>
              <a href="#notes" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:bg-[var(--card-strong)]">
                查看碎碎念
              </a>
              <Link href="/now" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:bg-[var(--card-strong)]">
                看看 Now
              </Link>
            </div>
          </div>

          {/* ── Hero 右侧：写作状态 + 随机一句 ── */}
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--subtle)]">当前状态</p>
                <p className={`mt-2 text-2xl font-semibold ${
                  status.tone === "fresh" ? "text-emerald-400" :
                  status.tone === "warm" ? "text-[var(--fg)]" :
                  "text-[var(--muted)]"
                }`}>
                  {status.text}
                </p>
                {published.length > 0 && (
                  <p className="mt-1 text-xs text-[var(--subtle)]">
                    共 {published.length} 篇碎碎念
                  </p>
                )}
              </div>

              <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                <p className="text-sm text-[var(--subtle)]">随机一句</p>
                {random ? (
                  <a href={`/notes/${random.id}`} className="block mt-3 text-lg leading-8 text-[var(--fg)] hover:text-[var(--accent)] transition">
                    {random.text.length > 80 ? random.text.slice(0, 80) + "…" : random.text}
                  </a>
                ) : (
                  <p className="mt-3 text-lg leading-8 text-[var(--muted)]">还没有内容，先写一条吧。</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 功能入口 ── */}
        <div className="mt-16">
          <FeatureHub items={featureCards} />
        </div>

        {/* ── 那年今日 ── */}
        {onThisDayNotes.length > 0 && (
          <section className="mt-16 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">On this day</p>
            <h2 className="mt-2 text-2xl font-semibold mb-4">那年今日</h2>
            <div className="space-y-3">
              {onThisDayNotes.slice(0, 3).map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:bg-[var(--card-strong)]"
                >
                  <span className="text-xs text-[var(--accent)]">{yearLabel(new Date(note.createdAt))}</span>
                  <h3 className="mt-1 text-sm font-medium">{note.title}</h3>
                  <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">
                    {note.text.length > 100 ? note.text.slice(0, 100) + "…" : note.text}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 置顶精选 ── */}
        {pinned ? (
          <section className="mt-16 rounded-[1.75rem] border border-amber-300/25 bg-amber-300/8 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-100/70">Pinned</p>
            <h2 className="mt-2 text-2xl font-semibold">置顶精选</h2>
            <a href={`/notes/${pinned.id}`} className="mt-4 block rounded-2xl border border-amber-300/20 bg-black/15 p-5 transition hover:bg-black/25">
              {pinned.coverImage && (
                <div className="mb-4 -mx-1 -mt-1 overflow-hidden rounded-xl">
                  <img src={pinned.coverImage} alt="" className="w-full h-40 object-cover" />
                </div>
              )}
              <h3 className="text-xl font-medium">{pinned.title}</h3>
              <div className="mt-3 line-clamp-3 text-white/70">
                <MarkdownRenderer preview>{pinned.text}</MarkdownRenderer>
              </div>
            </a>
          </section>
        ) : null}

        {/* ── 最新碎碎念 ── */}
        <section id="notes" className="mt-16 grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Latest notes</p>
              <h2 className="mt-2 text-2xl font-semibold">最新碎碎念</h2>
            </div>
            <Link href="/notes" className="text-sm text-[var(--subtle)] hover:text-[var(--fg)] transition">查看全部 →</Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {latest.map((note) => (
              <a key={note.id} href={`/notes/${note.id}`} className="group rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:bg-[var(--card-strong)]">
                {note.coverImage && (
                  <div className="mb-4 -mx-2 -mt-2 overflow-hidden rounded-2xl">
                    <img src={note.coverImage} alt="" className="w-full h-36 object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 text-xs text-[var(--subtle)]">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">
                    {note.tag}
                  </span>
                  <time>{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
                </div>
                <h3 className="mt-5 text-xl font-medium">{note.title}</h3>
                <div className="mt-4 line-clamp-4">
                  <MarkdownRenderer preview>{note.text}</MarkdownRenderer>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 照片墙预览 ── */}
        {photos.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Photos</p>
                <h2 className="mt-2 text-2xl font-semibold">照片墙</h2>
              </div>
              <Link href="/photos" className="text-sm text-[var(--subtle)] hover:text-[var(--fg)] transition">查看全部 →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory">
              {photos.slice(0, 6).map((photo) => (
                <Link
                  key={photo.id}
                  href="/photos"
                  className="shrink-0 w-44 h-44 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-elevated)] snap-start group cursor-pointer transition hover:shadow-lg hover:-translate-y-0.5"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption ?? ""}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── About + 可点击标签 ── */}
        <section className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">About</p>
            <h2 className="mt-3 text-2xl font-semibold">这个站要做什么</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              用来记录碎碎念、灵感、观察和情绪。后端已经接到 MySQL，可以继续加登录、管理后台、标签和搜索。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/reading" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">书单</Link>
              <Link href="/wish" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">愿望清单</Link>
              <Link href="/timeline" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">时间线</Link>
              <Link href="/guestbook" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">留言</Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Tags</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)] hover:border-[var(--accent)]">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 底部 ── */}
        <footer className="mt-24 pt-8 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--subtle)]">
          <span>Miggra Journal</span>
          <Link href="/admin" className="hover:text-[var(--fg)] transition">后台入口</Link>
        </footer>
      </section>
    </main>
    </>
  );
}
