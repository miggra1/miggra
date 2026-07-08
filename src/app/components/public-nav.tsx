import Link from "next/link";

const links = [
  { href: "/notes", label: "归档" },
  { href: "/now", label: "Now" },
  { href: "/wish", label: "愿望清单" },
  { href: "/reading", label: "书单" },
  { href: "/inspirations", label: "灵感" },
  { href: "/timeline", label: "时间线" },
  { href: "/admin", label: "后台" },
  { href: "/rss", label: "RSS" },
];

export function PublicNav() {
  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-white/80 lg:px-10">
      <Link href="/" prefetch={false} className="text-sm font-medium tracking-[0.3em] text-white">
        MIGGRA
      </Link>
      <div className="flex flex-wrap gap-3 text-sm">
        {links.map((link) => (
          <Link key={link.href} href={link.href} prefetch={false} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
