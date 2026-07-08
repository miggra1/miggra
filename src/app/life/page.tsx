import type { Metadata } from "next";
import Link from "next/link";
import { listContentItemsSafe, type ContentSection } from "@/lib/content";
import { fallbackInspirations, fallbackNowItems, fallbackReadingList, fallbackWishItems } from "@/lib/site-data";
import { MarkdownRenderer } from "@/app/components/markdown-renderer";

export const revalidate = 60;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "生活切片",
  description: "Now、愿望、书单和灵感的轻量集合。",
};

type SliceItem = {
  title: string;
  detail: string;
  meta?: string | null;
  status?: string | null;
  href?: string;
};

type SliceSection = {
  key: ContentSection;
  title: string;
  eyebrow: string;
  description: string;
  hrefBase: string;
  items: SliceItem[];
};

const sectionMeta: Record<ContentSection, Omit<SliceSection, "items" | "key">> = {
  NOW: {
    title: "Now",
    eyebrow: "Current",
    description: "最近正在做、正在想、正在靠近的事。",
    hrefBase: "/now",
  },
  WISH: {
    title: "愿望",
    eyebrow: "Wish",
    description: "还没完成也没关系，先把想去的方向放在这里。",
    hrefBase: "/wish",
  },
  READING: {
    title: "书单",
    eyebrow: "Reading",
    description: "读过、在读和想读的书，慢慢留下痕迹。",
    hrefBase: "/reading",
  },
  INSPIRATION: {
    title: "灵感",
    eyebrow: "Ideas",
    description: "一些闪过的小想法，先收住，以后再长大。",
    hrefBase: "/inspirations",
  },
  TIMELINE: {
    title: "时间线",
    eyebrow: "Timeline",
    description: "更完整的节点已经单独放在时间线页面。",
    hrefBase: "/timeline",
  },
};

function fallbackFor(section: ContentSection): SliceItem[] {
  if (section === "NOW") {
    return fallbackNowItems.map((detail, index) => ({ title: `状态 ${index + 1}`, detail, meta: "Current" }));
  }
  if (section === "WISH") return fallbackWishItems;
  if (section === "READING") return fallbackReadingList;
  if (section === "INSPIRATION") return fallbackInspirations;
  return [];
}

async function getSection(section: ContentSection): Promise<SliceSection> {
  const { items } = await listContentItemsSafe(section);
  const meta = sectionMeta[section];
  const source = items.length
    ? items.map((item) => ({
        title: item.title,
        detail: item.detail,
        meta: item.meta,
        status: item.status,
        href: `${meta.hrefBase}/${item.id}`,
      }))
    : fallbackFor(section);

  return { key: section, ...meta, items: source.slice(0, 6) };
}

export default async function LifePage() {
  const sections = await Promise.all([
    getSection("NOW"),
    getSection("WISH"),
    getSection("READING"),
    getSection("INSPIRATION"),
  ]);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] ambient-bg">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-16">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Life slices</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">生活切片</h1>
          <p className="mt-4 leading-8 text-[var(--muted)]">
            这里收着一些不必写成正式文章的小东西：近况、愿望、书单和灵感。它们不抢主线，只让这个网站更像一个真实的人。
          </p>
        </header>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {sections.map((section) => (
            <a
              key={section.key}
              href={`#${section.key.toLowerCase()}`}
              className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--card-strong)] hover:text-[var(--fg)]"
            >
              {section.title}
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-10">
          {sections.map((section) => (
            <section key={section.key} id={section.key.toLowerCase()} className="scroll-mt-24">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--subtle)]">{section.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{section.title}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{section.description}</p>
                </div>
                <Link href={section.hrefBase} className="text-sm text-[var(--subtle)] transition hover:text-[var(--fg)]">
                  查看全部
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item, index) => {
                  const content = (
                    <article className="h-full rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:bg-[var(--card-strong)]">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        {(item.status || item.meta) && (
                          <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--subtle)]">
                            {item.status ?? item.meta}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 line-clamp-3">
                        <MarkdownRenderer preview>{item.detail}</MarkdownRenderer>
                      </div>
                    </article>
                  );

                  return item.href ? (
                    <Link key={item.href} href={item.href} className="block">
                      {content}
                    </Link>
                  ) : (
                    <div key={`${section.key}-${index}`}>{content}</div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
