import Link from "next/link";
import type { ReactNode } from "react";

export function ContentDetailShell({
  eyebrow,
  title,
  meta,
  children,
  backHref = "/",
  backLabel = "返回首页",
  listHref = "/notes",
  listLabel = "碎碎念",
}: {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  listHref?: string;
  listLabel?: string;
}) {
  return (
    <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/45">
          <Link href={backHref} className="transition hover:text-white">{backLabel}</Link>
          <Link href={listHref} className="transition hover:text-white">{listLabel}</Link>
        </div>
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h1>
          {meta ? <div className="mt-4 text-sm text-white/45">{meta}</div> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
