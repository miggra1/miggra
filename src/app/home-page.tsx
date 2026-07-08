import Link from "next/link";
import { DbErrorBanner } from "./components/db-error-banner";
import { WriteButton } from "./components/write-button";
import { getHomePageData, getOnThisDayNotes } from "@/lib/notes";
import { listHomePhotos } from "@/lib/photos";
import { listContentItemsSafe } from "@/lib/content";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

function daysAgo(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function writingStatus(latestNoteAt: Date | null, publishedCount: number): { text: string; tone: "fresh" | "warm" | "quiet" } {
  if (!latestNoteAt) return { text: publishedCount > 0 ? "继续写点什么吧。" : "写下第一篇吧。", tone: "quiet" };
  const days = daysAgo(latestNoteAt);
  if (days === 0) return { text: "今天写过了", tone: "fresh" };
  if (days === 1) return { text: "昨天刚写过", tone: "warm" };
  if (days <= 7) return { text: `上次落笔是 ${days} 天前`, tone: "warm" };
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
  const photos = await listHomePhotos(5).catch(() => []);
  const onThisDayNotes = await getOnThisDayNotes().catch(() => []);
  const [now, wish, reading, inspirations] = await Promise.all([
    listContentItemsSafe("NOW"),
    listContentItemsSafe("WISH"),
    listContentItemsSafe("READING"),
    listContentItemsSafe("INSPIRATION"),
  ]);

  const published = notes.filter((note) => note.status === "PUBLISHED");
  const latest = published.slice(0, 3);
  const featured = published.find((note) => note.pinned) ?? latest[0] ?? null;
  const random = published.length ? published[new Date().getDate() % published.length] : null;
  const status = writingStatus(stats.latestNoteAt, published.length);
  const heroPhoto = photos[0] ?? null;

  const lifeModules = [
    { label: "Now", title: "当前状态", description: "最近在做什么、想什么、靠近什么。", href: "/now", count: now.items.length, latest: now.items[0]?.title },
    { label: "Wish", title: "愿望清单", description: "想完成、想体验、想慢慢抵达的事。", href: "/wish", count: wish.items.length, latest: wish.items[0]?.title },
    { label: "Reading", title: "书单", description: "在读、读过、想读的书和一点想法。", href: "/reading", count: reading.items.length, latest: reading.items[0]?.title },
    { label: "Ideas", title: "灵感墙", description: "还没长成文章的小点子和备忘。", href: "/inspirations", count: inspirations.items.length, latest: inspirations.items[0]?.title },
  ];

  return (
    <>
      {dbError ? <DbErrorBanner /> : null}
      <main className="relative min-h-screen w-full max-w-[100vw] overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,120,196,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.1),transparent_30%)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

        <section className="relative mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-6xl gap-10 px-5 pb-14 pt-14 sm:px-6 sm:py-16 lg:min-h-screen lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs text-[var(--muted)] backdrop-blur-xl sm:px-4 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
              一个安静但有光的地方
            </div>

            <div className="mt-8 space-y-4 sm:space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--subtle)] sm:text-sm sm:tracking-[0.35em]">Miggra Journal</p>
              <h1 className="max-w-full text-[2.55rem] font-semibold leading-[1.14] tracking-normal sm:max-w-4xl sm:text-6xl sm:leading-tight sm:tracking-tight sm:text-balance lg:text-7xl">
                <span className="block sm:hidden">
                  把日常、想法
                  <br />
                  和情绪，放进
                  <br />
                  一个很安静
                  <br />
                  但很有光的地方。
                </span>
                <span className="hidden sm:inline">把日常、想法和情绪，放进一个很安静但很有光的地方。</span>
              </h1>
              <p className="max-w-[21rem] text-[15px] leading-7 text-[var(--muted)] sm:max-w-2xl sm:text-lg sm:leading-8">
                这里没有算法，没有打扰。只有慢慢生长的文字、照片和一些生活切片。
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/notes" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90 sm:px-6">看碎碎念</Link>
              <Link href="/photos" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:bg-[var(--card-strong)] sm:px-6">看照片</Link>
              <Link href="/about" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:bg-[var(--card-strong)] sm:px-6">关于这里</Link>
            </div>
          </div>

          <div className="grid min-w-0 gap-4">
            {heroPhoto ? (
              <Link href="/photos" className="group overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/30">
                <img src={heroPhoto.url} alt={heroPhoto.caption ?? ""} className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:h-80 lg:h-96" />
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">Featured photo</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{heroPhoto.caption ?? "最近的一张照片"}</p>
                  </div>
                  <span className="text-sm text-[var(--subtle)] transition group-hover:text-[var(--fg)]">查看</span>
                </div>
              </Link>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 backdrop-blur-xl">
                <p className="text-sm text-[var(--subtle)]">当前状态</p>
                <p className={`mt-2 text-xl font-semibold leading-8 ${status.tone === "fresh" ? "text-emerald-400" : status.tone === "warm" ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>{status.text}</p>
                <p className="mt-1 text-xs text-[var(--subtle)]">共 {published.length} 篇碎碎念</p>
              </div>
              {random ? (
                <Link href={`/notes/${random.id}`} className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--card-strong)]">
                  <p className="text-sm text-[var(--subtle)]">随机一句</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-7 text-[var(--fg)]">{random.text.length > 110 ? `${random.text.slice(0, 110)}...` : random.text}</p>
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:px-10">
          {featured ? (
            <div className="mb-14 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">Featured</p>
                <h2 className="mt-2 text-3xl font-semibold">先从这一篇开始</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">如果只想短暂停一下，这篇是一个不错的入口。</p>
              </div>
              <Link href={`/notes/${featured.id}`} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
                {featured.coverImage ? (
                  <div className="mb-5 overflow-hidden rounded-2xl">
                    <img src={featured.coverImage} alt="" className="h-48 w-full object-cover" />
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--subtle)]">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1">{featured.tag}</span>
                  <time>{new Date(featured.createdAt).toISOString().slice(0, 10)}</time>
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{featured.title}</h3>
                <div className="mt-4 line-clamp-3">
                  <MarkdownRenderer preview>{featured.text}</MarkdownRenderer>
                </div>
              </Link>
            </div>
          ) : null}

          <div className="grid gap-12">
            <section>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">Latest notes</p>
                  <h2 className="mt-2 text-2xl font-semibold">最近写下的</h2>
                </div>
                <Link href="/notes" className="text-sm text-[var(--subtle)] transition hover:text-[var(--fg)]">全部</Link>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {latest.map((note) => (
                  <Link key={note.id} href={`/notes/${note.id}`} className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--card-strong)]">
                    <div className="flex items-center justify-between gap-3 text-xs text-[var(--subtle)]">
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">{note.tag}</span>
                      <time>{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
                    </div>
                    <h3 className="mt-4 text-xl font-medium">{note.title}</h3>
                    <div className="mt-3 line-clamp-3">
                      <MarkdownRenderer preview>{note.text}</MarkdownRenderer>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {photos.length > 1 ? (
              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">Photos</p>
                    <h2 className="mt-2 text-2xl font-semibold">最近看见的光</h2>
                  </div>
                  <Link href="/photos" className="text-sm text-[var(--subtle)] transition hover:text-[var(--fg)]">照片墙</Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photos.slice(1, 5).map((photo) => (
                    <Link key={photo.id} href="/photos" className="h-44 w-44 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] sm:h-52 sm:w-52">
                      <img src={photo.url} alt={photo.caption ?? ""} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">Life modules</p>
                  <h2 className="mt-2 text-2xl font-semibold">日常也有自己的栏目</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">Now、愿望、书单和灵感不再藏在一个入口里。它们各自独立，也可以在生活切片里一起看。</p>
                </div>
                <Link href="/life" className="text-sm text-[var(--subtle)] transition hover:text-[var(--fg)]">汇总页</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {lifeModules.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--card-strong)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--subtle)]">{item.label}</p>
                        <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
                      </div>
                      <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--subtle)]">{item.count}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                    {item.latest ? <p className="mt-4 line-clamp-1 text-sm text-[var(--fg)]">最近：{item.latest}</p> : null}
                  </Link>
                ))}
              </div>
            </section>

            {onThisDayNotes.length > 0 ? (
              <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--subtle)]">On this day</p>
                <h2 className="mt-2 text-2xl font-semibold">那年今日</h2>
                <div className="mt-4 grid gap-3">
                  {onThisDayNotes.slice(0, 3).map((note) => (
                    <Link key={note.id} href={`/notes/${note.id}`} className="rounded-2xl border border-[var(--border)] bg-black/10 p-4 transition hover:bg-black/20">
                      <span className="text-xs text-[var(--accent)]">{yearLabel(new Date(note.createdAt))}</span>
                      <h3 className="mt-1 text-sm font-medium">{note.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-4 md:grid-cols-3">
              <Link href="/timeline" className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">Timeline</p>
                <h2 className="mt-3 text-xl font-semibold">时间线</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">看这个空间和生活节点如何慢慢长出来。</p>
              </Link>
              <Link href="/guestbook" className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition hover:bg-[var(--card-strong)]">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">Guestbook</p>
                <h2 className="mt-3 text-xl font-semibold">留言板</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">如果路过，可以留下一个脚印。</p>
              </Link>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">Write</p>
                <h2 className="mt-3 text-xl font-semibold">继续记录</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">给自己留一个低成本的入口。</p>
                <div className="mt-5">
                  <WriteButton />
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
