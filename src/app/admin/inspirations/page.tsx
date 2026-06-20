import { listContentItems } from "@/lib/content";
import { ContentSectionEditor } from "../content-section-editor";

export default async function AdminInspirationsPage() {
  const items = await listContentItems("INSPIRATION").catch(() => []);

  return (
    <div className="min-h-screen bg-[#c4a87c] text-[#3d3027]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,90,43,0.1) 2px, rgba(139,90,43,0.1) 3px)" }} />
      <div className="relative px-6 py-8">
        <header className="mb-8 inline-block -rotate-1 rounded-lg border-2 border-amber-700/30 bg-yellow-100/90 px-6 py-3 shadow-lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-700">Corkboard</p>
          <h1 className="font-serif text-2xl italic text-amber-900">灵感工坊 ◆</h1>
        </header>
        <ContentSectionEditor section="INSPIRATION" initialItems={items.map((i) => ({ id: i.id, section: i.section as any, title: i.title, detail: i.detail, meta: i.meta ?? "", status: i.status ?? "", order: i.order, active: i.active, createdAt: i.createdAt.toISOString() }))} />
      </div>
    </div>
  );
}
