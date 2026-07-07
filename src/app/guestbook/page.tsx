import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GuestbookForm } from "./guestbook-form";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "留言板", description: "留下一个脚印" };

export default async function GuestbookPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const pageSize = 20;

  const [entries, total] = await Promise.all([
    prisma.guestbookEntry.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.guestbookEntry.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Guestbook</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">公开留言板</h1>
          <p className="mt-3 text-[var(--muted)]">留下一个简短的问候、感想或者路过的脚印。</p>
        </header>

        <GuestbookForm />

        <div className="mt-12 grid gap-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">{entry.name}</h2>
                <time className="text-sm text-[var(--subtle)]">{new Date(entry.createdAt).toLocaleString("zh-CN")}</time>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-8 text-[var(--muted)]">{entry.message}</p>
              {entry.reply ? (
                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">站长回复</p>
                  <p className="mt-2 whitespace-pre-wrap leading-7 text-[var(--fg)]">{entry.reply}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-4">
            {page > 1 ? (
              <a href={`?page=${page - 1}`} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)]">
                上一页
              </a>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--subtle)] opacity-40">上一页</span>
            )}
            <span className="text-sm text-[var(--subtle)]">{page} / {totalPages}</span>
            {page < totalPages ? (
              <a href={`?page=${page + 1}`} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)]">
                下一页
              </a>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--subtle)] opacity-40">下一页</span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
