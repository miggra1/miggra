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
    <main className="min-h-screen bg-[var(--bg)] px-6 py-12 text-[var(--fg)]">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--subtle)]">
          <Link href={backHref} className="transition hover:text-[var(--fg)]">{backLabel}</Link>
          <Link href={listHref} className="transition hover:text-[var(--fg)]">{listLabel}</Link>
        </div>
        <header className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h1>
          {meta ? <div className="mt-4 text-sm text-[var(--subtle)]">{meta}</div> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
