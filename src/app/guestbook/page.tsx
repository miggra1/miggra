import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GuestbookForm } from "./guestbook-form";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "留言板", description: "留下一个脚印" };

export default async function GuestbookPage() {
  const entries = await prisma.guestbookEntry.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-12 text-center">
          <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Guestbook</p>
          <h1 className="text-[32px] font-medium mt-2 tracking-tight">留言板</h1>
          <p className="text-[15px] text-[var(--fg-secondary)] mt-2">路过的人，留下一句话再走吧</p>
        </header>

        <GuestbookForm />

        <div className="mt-12 space-y-4">
          {entries.length === 0 && <p className="text-center text-[var(--subtle)] text-sm py-8">还没有留言，来做第一个留下脚印的人</p>}
          {entries.map((entry) => (
            <article key={entry.id} className="card-apple p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-medium">{entry.name}</h2>
                <time className="text-[12px] text-[var(--subtle)]">{new Date(entry.createdAt).toLocaleString("zh-CN")}</time>
              </div>
              <p className="text-[14px] text-[var(--fg-secondary)] mt-2 leading-relaxed whitespace-pre-wrap">{entry.message}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
