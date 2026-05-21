import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FeaturePageShell } from "../components/feature-page-shell";
import { GuestbookForm } from "./guestbook-form";

export const runtime = "nodejs";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "公开留言板",
  description: "留下一个简短的问候、感想或者路过的脚印。",
};

export default async function GuestbookPage() {
  const entries = await prisma.guestbookEntry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <FeaturePageShell eyebrow="Guestbook" title="公开留言板" description="留下一个简短的问候、感想或者路过的脚印。">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GuestbookForm />
        <section className="grid gap-4">
          {entries.length ? entries.map((entry) => (
            <article key={entry.id} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-medium">{entry.name}</h2>
                <time className="text-xs text-[var(--subtle)]">{new Date(entry.createdAt).toLocaleString("zh-CN")}</time>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-8 text-[var(--muted)]">{entry.message}</p>
            </article>
          )) : (
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              还没有留言，来做第一个留下脚印的人吧。
            </article>
          )}
        </section>
      </div>
    </FeaturePageShell>
  );
}
