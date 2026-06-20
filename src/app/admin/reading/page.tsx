import { listContentItems } from "@/lib/content";
import { ContentSectionEditor } from "../content-section-editor";

export default async function AdminReadingPage() {
  const items = await listContentItems("READING").catch(() => []);

  return (
    <div className="min-h-screen bg-[#1a1410] text-[#e8dfd3]">
      <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-amber-400/[0.03] blur-3xl" />
      <div className="relative px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/60">Library</p>
          <h1 className="mt-2 font-serif text-3xl font-light italic">阅读书房 ▣</h1>
        </header>
        <ContentSectionEditor section="READING" initialItems={items.map((i) => ({ id: i.id, section: i.section as any, title: i.title, detail: i.detail, meta: i.meta ?? "", status: i.status ?? "", order: i.order, active: i.active, createdAt: i.createdAt.toISOString() }))} />
      </div>
    </div>
  );
}
