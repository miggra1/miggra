import Link from "next/link";

export function PublicNav() {
  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-white/80 lg:px-10">
      <Link href="/" className="text-sm font-medium tracking-[0.3em] text-white">
        MIGGRA
      </Link>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/notes" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
          归档
        </Link>
        <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
          后台
        </Link>
        <Link href="/rss.xml" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
          RSS
        </Link>
      </div>
    </nav>
  );
}
