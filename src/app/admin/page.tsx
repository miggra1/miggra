import { isAdminAuthenticated } from "@/lib/auth";
import { listNotesSafe } from "@/lib/notes";
import { computeStatsFromNotes } from "@/lib/stats";
import { AdminClient } from "./admin-client";
import { AdminLogin } from "./login";
import { DbErrorBanner } from "../components/db-error-banner";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLogin />;
  }

  const { notes, dbError } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);

  return (
    <>
      {dbError ? <DbErrorBanner /> : null}
      <main className="min-h-screen bg-[#07070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold">碎碎念后台</h1>
          <p className="mt-3 max-w-2xl text-white/65">
            这里可以直接管理内容：搜索、筛选、新建、编辑、删除。后面还能继续叠加统计、置顶和导出。
          </p>
        </header>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-white/35">Admin Stats</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "总碎念数", value: stats.totalNotes },
              { label: "已发布", value: stats.publishedNotes },
              { label: "草稿", value: stats.draftNotes },
              { label: "标签数", value: stats.tagCount },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <AdminClient initialNotes={notes} />
      </div>
    </main>
    </>
  );
}
