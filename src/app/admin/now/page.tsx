import { listContentItems } from "@/lib/content";
import { ContentSectionEditor } from "../content-section-editor";

export default async function AdminNowPage() {
  const items = await listContentItems("NOW").catch(() => []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#d4d4d8]">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-500/60">Terminal · Now</p>
          <h1 className="mt-2 font-mono text-2xl tracking-tight">~/now <span className="text-emerald-400">▸ edit</span></h1>
        </header>
        <ContentSectionEditor section="NOW" initialItems={items.map((i) => ({ id: i.id, section: i.section as any, title: i.title, detail: i.detail, meta: i.meta ?? "", status: i.status ?? "", order: i.order, active: i.active, createdAt: i.createdAt.toISOString() }))} />
      </div>
    </div>
  );
}
