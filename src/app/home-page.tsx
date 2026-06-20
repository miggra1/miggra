import Link from "next/link";
import { getHomePageData } from "@/lib/notes";
import { DbErrorBanner } from "./components/db-error-banner";
import { StatsPanel } from "./components/stats-panel";
import { FeatureHub } from "./components/feature-hub";
import { getHomepageModulesSafe } from "@/lib/homepage";

const fallbackFeatureCards = [
  { href: "/now", label: "Now", title: "此刻状态", description: "记录最近在做什么、在学什么、在想什么。", count: "3" },
  { href: "/wish", label: "Wish", title: "愿望清单", description: "把想去的地方、想做的事先放在这里。", count: "4" },
  { href: "/reading", label: "Reading", title: "正在读", description: "书不需要读完才值得被记下来。", count: "3" },
  { href: "/inspirations", label: "Idea", title: "灵感便签", description: "脑子里忽然冒出来的东西，趁热存下来。", count: "3" },
  { href: "/timeline", label: "Timeline", title: "时间节点", description: "看这个站是怎么一点一点长出来的。", count: "3" },
  { href: "/guestbook", label: "Guestbook", title: "路过留言", description: "留一个脚印，哪怕只是一句问候。", count: "1" },
];

export async function HomePage() {
  const { notes, stats, dbError } = await getHomePageData();
  const { modules, dbError: modulesDbError } = await getHomepageModulesSafe();
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

  return (
    <>
      {(dbError || modulesDbError) ? <DbErrorBanner /> : null}
      <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
        {/* ── 暖调渐变层 ── */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,165,116,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(200,140,100,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(180,120,80,0.08),transparent_30%)] opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(232,228,221,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(232,228,221,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />

        <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            {/* ── 左侧 ── */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_var(--accent-glow)]" />
                一个安静但有光的地方
              </div>

              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--subtle)]">Miggra</p>
                <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
                  把日常、想法和情绪，放进一个很安静但很有光的地方。
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                  这里没有算法，没有打扰。只有慢慢生长的文字、灵感和生活碎片。
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#notes" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:scale-[1.02] hover:opacity-90">
                  看看最近的碎碎念
                </a>
                <Link href="/now" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:bg-[var(--card-strong)]">
                  我此刻在做什么
                </Link>
                <a href="/admin" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:bg-[var(--card-strong)]">
                  悄悄进入后台
                </a>
              </div>
            </div>

            {/* ── 右侧面板 ── */}
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl card-hover">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[var(--subtle)]">此刻</p>
                  <p className="mt-2 text-2xl font-semibold">正在生长中</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: "碎念", value: `${notes.length}` }, { label: "发布", value: `${published.length}` }, { label: "标签", value: `${tags.length}` }].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                      <div className="text-2xl font-semibold">{item.value}</div>
                      <div className="mt-1 text-xs text-[var(--subtle)]">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl bg-[linear-gradient(135deg,var(--accent-glow),transparent)] p-5">
                  <p className="text-sm text-[var(--subtle)]">随机拾起一句</p>
                  <p className="mt-3 text-lg leading-8 text-[var(--fg)]">
                    {random ? random.text : "还没有内容。从后台写下第一行吧。"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 模块入口 ── */}
          <div className="mt-16 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <FeatureHub items={featureCards} />
          </div>

          {/* ── 站点概览 ── */}
          <div className="mt-16 animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <StatsPanel
              title="站点概览"
              subtitle="每一条都是真实存在过的情绪和思考。"
              items={[
                { label: "总碎念数", value: stats.totalNotes },
                { label: "已发布", value: stats.publishedNotes },
                { label: "草稿", value: stats.draftNotes },
                { label: "标签数", value: stats.tagCount },
              ]}
              footerHref="/notes"
              footerLabel="浏览归档"
            />
          </div>

          {/* ── 置顶 ── */}
          {pinned ? (
            <section className="mt-16 rounded-[1.75rem] border border-[var(--accent-glow)] bg-[var(--accent-glow)]/10 p-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">置顶</p>
              <h2 className="mt-2 text-2xl font-semibold">一篇特别留在这里的</h2>
              <a href={`/notes/${pinned.id}`} className="mt-4 block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--card-strong)]">
                <h3 className="text-xl font-medium">{pinned.title}</h3>
                <p className="mt-3 line-clamp-3 text-[var(--muted)]">{pinned.text}</p>
              </a>
            </section>
          ) : null}

          {/* ── 最新碎碎念 ── */}
          <section id="notes" className="mt-16 grid gap-4 animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">碎碎念</p>
                <h2 className="mt-2 text-2xl font-semibold">最近写下的</h2>
              </div>
              <p className="hidden text-sm text-[var(--subtle)] md:block">每一条都安静地躺在这里</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {latest.map((note) => (
                <a key={note.id} href={`/notes/${note.id}`} className="group card-hover rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
                  <div className="flex items-center justify-between gap-3 text-xs text-[var(--subtle)]">
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)]">{note.tag}</span>
                    <time>{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
                  </div>
                  <h3 className="mt-5 text-xl font-medium">{note.title}</h3>
                  <p className="mt-4 line-clamp-4 leading-7 text-[var(--muted)]">{note.text}</p>
                </a>
              ))}
            </div>
          </section>

          {/* ── About + Tags ── */}
          <section className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">关于这里</p>
              <h2 className="mt-3 text-2xl font-semibold">这个空间在做什么</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">
                用来安放碎碎念、灵感、观察和情绪。不需要完美，不需要计划——随手记下来就好。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/reading" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">书单</Link>
                <Link href="/wish" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">愿望</Link>
                <Link href="/timeline" className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)] transition hover:bg-[var(--card-strong)]">时间线</Link>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">标签</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--fg)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
