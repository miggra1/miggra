import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPageSafe } from "@/lib/pages";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const revalidate = 60;
export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await getPublishedPageSafe(slug);
  if (!page) return { title: "未找到" };
  return { title: page.title, description: page.content.slice(0, 160) };
}

export default async function PageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { page } = await getPublishedPageSafe(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
          <div className="mt-8">
            <MarkdownRenderer>{page.content}</MarkdownRenderer>
          </div>
        </div>
      </article>
    </main>
  );
}
