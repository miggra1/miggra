import { GuestbookAdminClient } from "../guestbook-client";

export default async function AdminGuestbookPage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#3d3027]">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139,90,43,0.4) 3px, rgba(139,90,43,0.4) 4px)" }} />
      <div className="relative px-6 py-8">
        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/60">Mailbox</p>
          <h1 className="mt-2 font-serif text-3xl font-light italic">留言信箱 ✉</h1>
          <p className="mt-1 font-mono text-xs text-amber-600/50">审核每一条路过留下的足迹</p>
        </header>
        <GuestbookAdminClient />
      </div>
    </div>
  );
}
