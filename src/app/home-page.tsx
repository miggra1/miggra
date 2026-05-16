import { getHomePageData } from "@/lib/notes";
import { DbErrorBanner } from "./components/db-error-banner";
import { StatsPanel } from "./components/stats-panel";

export async function HomePage() {
  const { notes, stats, dbError } = await getHomePageData();
  const published = notes.filter((note) => note.status === "PUBLISHED");
  const latest = published.slice(0, 6);
  const pinned = published.find((note) => note.pinned);
  const random = published[Math.floor(Math.random() * Math.max(published.length, 1))] ?? null;

  const tags = Array.from(new Set(published.map((note) => note.tag))).slice(0, 6);

  return (
    <>
      {dbError ? <DbErrorBanner /> : null}
      <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,120,196,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.14),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
              个人碎碎念 / MySQL 后端 / 可公开访问
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">Miggra Journal</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
                把日常、想法和情绪，放进一个很安静但很有光的地方。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                这是一个为你个人碎碎念设计的网站：现代、艺术、极简，已经接入 MySQL 数据层，支持公开浏览和后台管理。
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#notes"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02] hover:bg-white/90"
              >
                查看碎碎念
              </a>
              <a
                href="/admin"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:bg-white/10"
              >
                进入后台
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-white/45">当前状态</p>
                <p className="mt-2 text-2xl font-semibold">在线记录中</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "碎念总数", value: `${notes.length}` },
                  { label: "已发布", value: `${published.length}` },
                  { label: "标签数", value: `${tags.length}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-2xl font-semibold">{item.value}</div>
                    <div className="mt-1 text-xs text-white/50">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-5">
                <p className="text-sm text-white/55">随机一句</p>
                <p className="mt-3 text-lg leading-8 text-white/85">
                  {random ? random.text : "还没有内容，先去后台写一条吧。"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <StatsPanel
            title="站点概览"
            subtitle="这里展示当前内容状态，后面还能继续扩展成月报和写作统计。"
            items={[
              { label: "总碎念数", value: stats.totalNotes },
              { label: "已发布", value: stats.publishedNotes },
              { label: "草稿", value: stats.draftNotes },
              { label: "标签数", value: stats.tagCount },
            ]}
            footerHref="/notes"
            footerLabel="查看归档"
          />
        </div>

        {pinned ? (
          <section className="mt-16 rounded-[1.75rem] border border-amber-300/25 bg-amber-300/8 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-100/70">Pinned</p>
            <h2 className="mt-2 text-2xl font-semibold">置顶精选</h2>
            <a href={`/notes/${pinned.id}`} className="mt-4 block rounded-2xl border border-amber-300/20 bg-black/15 p-5 transition hover:bg-black/25">
              <h3 className="text-xl font-medium">{pinned.title}</h3>
              <p className="mt-3 line-clamp-3 text-white/70">{pinned.text}</p>
            </a>
          </section>
        ) : null}

        <section id="notes" className="mt-16 grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/35">Latest notes</p>
              <h2 className="mt-2 text-2xl font-semibold">最新碎碎念</h2>
            </div>
            <p className="hidden text-sm text-white/45 md:block">这些内容现在来自 MySQL</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {latest.map((note) => (
              <a
                key={note.id}
                href={`/notes/${note.id}`}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between gap-3 text-xs text-white/45">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">{note.tag}</span>
                  <time>{new Date(note.createdAt).toISOString().slice(0, 10)}</time>
                </div>
                <h3 className="mt-5 text-xl font-medium">{note.title}</h3>
                <p className="mt-4 line-clamp-4 leading-7 text-white/65">{note.text}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/35">About</p>
            <h2 className="mt-3 text-2xl font-semibold">这个站要做什么</h2>
            <p className="mt-4 leading-8 text-white/65">
              用来记录碎碎念、灵感、观察和情绪。后端已经接到 MySQL，可以继续加登录、管理后台、标签和搜索。
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/35">Tags</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/75">
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
