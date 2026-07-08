import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Miggra 和这个个人空间。",
};

const links = [
  { href: "/notes", title: "碎碎念", text: "看最新的文字和记录。" },
  { href: "/photos", title: "照片墙", text: "看生活里的画面和光。" },
  { href: "/life", title: "生活切片", text: "看近况、愿望、书单和灵感。" },
  { href: "/guestbook", title: "留言板", text: "路过时留一句话。" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-16">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">About Miggra</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">一个安静但有光的地方</h1>
          <p className="mt-5 text-lg leading-9 text-[var(--muted)]">
            Miggra 是一个私人但开放的个人空间。它不追求信息流，也不急着证明什么，只用文字、照片和一些生活切片，把日常慢慢留下来。
          </p>
        </header>

        <section className="mt-10 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7">
          <h2 className="text-2xl font-semibold">这里适合怎么逛？</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-[var(--border)] bg-black/10 p-5 transition hover:bg-black/20"
              >
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">Tone</p>
            <h2 className="mt-3 text-2xl font-semibold">不吵，但持续</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              这个站希望保留一点慢的秩序：能回看，能更新，也能让路过的人轻轻停一下。
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">Contact</p>
            <h2 className="mt-3 text-2xl font-semibold">如果你路过</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              可以从留言板留下一句问候，也可以只看看照片和文字。这里不需要很正式，像经过一扇亮着灯的窗。
            </p>
            <Link href="/guestbook" className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90">
              去留言
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
