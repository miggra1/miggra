import { isAdminAuthenticated } from "@/lib/auth";
import { listNotesSafe } from "@/lib/notes";
import { computeStatsFromNotes } from "@/lib/stats";
import { AdminClient } from "./admin-client";
import { AdminLogin } from "./login";
import { DbErrorBanner } from "../components/db-error-banner";
import { prisma } from "@/lib/prisma";
import { ContentAdminClient } from "./content-admin-client";
import { HomepageModulesClient } from "./homepage-modules-client";
import { GuestbookAdminClient } from "./guestbook-client";
import { TimelineMilestonesClient } from "./timeline-milestones-client";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <AdminLogin />;
  }

  const { notes, dbError } = await listNotesSafe();
  const stats = computeStatsFromNotes(notes);
  const db = prisma as typeof prisma & {
    homepageModule: {
      findMany: typeof prisma.contentItem.findMany;
    };
    timelineMilestone: {
      findMany: typeof prisma.contentItem.findMany;
    };
  };

  const contentItems = (await db.contentItem.findMany({ orderBy: [{ section: "asc" }, { order: "asc" }, { createdAt: "desc" }] })).map((item) => ({
    id: item.id,
    section: item.section,
    title: item.title,
    detail: item.detail,
    meta: item.meta,
    status: item.status,
    order: item.order,
    active: item.active,
    createdAt: item.createdAt.toISOString(),
  }));
  const homepageModules = (await db.homepageModule.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] })).map((item: any) => ({
    id: item.id,
    key: item.key,
    title: item.title,
    enabled: item.enabled,
    order: item.order,
  }));
  const timelineItems = await (db as any).timelineMilestone.findMany({ orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "desc" }] });

  return (
    <>
      {dbError ? <DbErrorBanner /> : null}
      <main className="min-h-screen bg-[var(--bg)] px-6 py-12 text-[var(--fg)]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold">站点后台</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            这里可以同时管理碎碎念和生活模块内容。搜索、筛选、新建、编辑、删除都在这里完成。
          </p>
        </header>

        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--subtle)]">Admin Stats</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "总碎念数", value: stats.totalNotes },
              { label: "已发布", value: stats.publishedNotes },
              { label: "草稿", value: stats.draftNotes },
              { label: "标签数", value: stats.tagCount },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <AdminClient initialNotes={notes} />
        <ContentAdminClient initialItems={contentItems} />
        <TimelineMilestonesClient initialItems={(timelineItems as any[]).map((item: any) => ({
          id: String(item.id),
          year: String(item.year),
          kind: item.kind,
          title: String(item.title),
          detail: String(item.detail),
          order: Number(item.order),
          active: Boolean(item.active),
        }))} />
        <HomepageModulesClient initialModules={homepageModules} />
        <GuestbookAdminClient />
      </div>
    </main>
    </>
  );
}
