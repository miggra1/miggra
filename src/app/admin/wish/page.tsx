import { listContentItems } from "@/lib/content";
import { ContentSectionEditor } from "../content-section-editor";

export default async function AdminWishPage() {
  const items = await listContentItems("WISH").catch(() => []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#12102a] to-[#1a1040] text-[#e8e0f0]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 60% 50%, rgba(200,180,255,0.3), transparent)" }} />
      <div className="relative px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet-400/60">Wish Workshop</p>
          <h1 className="mt-2 font-serif text-3xl font-light tracking-wide">愿望工坊 ✦</h1>
        </header>
        <ContentSectionEditor section="WISH" initialItems={items.map((i) => ({ id: i.id, section: i.section as any, title: i.title, detail: i.detail, meta: i.meta ?? "", status: i.status ?? "", order: i.order, active: i.active, createdAt: i.createdAt.toISOString() }))} />
      </div>
    </div>
  );
}
