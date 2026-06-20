import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GuestbookForm } from "./guestbook-form";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "留言板", description: "留下一个脚印" };

export default async function GuestbookPage() {
  const entries = await prisma.guestbookEntry.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 20 });

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
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
