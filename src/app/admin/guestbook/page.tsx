import { GuestbookAdminClient } from "../guestbook-client";

export default async function AdminGuestbookPage() {
  return (
    <div className="px-8 py-10 max-w-4xl animate-in">
      <p className="text-xs text-[var(--subtle)] uppercase tracking-widest">Guestbook</p>
      <h1 className="text-[28px] font-medium mt-1 mb-8">留言审核</h1>
      <GuestbookAdminClient />
    </div>
  );
}
