import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function exportAll() {
  console.log("正在连接数据库导出数据...\n");

  const [notes, contentItems, guestbookEntries, homepageModules, timelineMilestones] =
    await Promise.all([
      prisma.note.findMany(),
      prisma.contentItem.findMany(),
      prisma.guestbookEntry.findMany(),
      prisma.homepageModule.findMany(),
      prisma.timelineMilestone.findMany(),
    ]);

  const dump = {
    exportedAt: new Date().toISOString(),
    tables: {
      notes: { count: notes.length, rows: notes },
      content_items: { count: contentItems.length, rows: contentItems },
      guestbook_entries: { count: guestbookEntries.length, rows: guestbookEntries },
      homepage_modules: { count: homepageModules.length, rows: homepageModules },
      timeline_milestones: { count: timelineMilestones.length, rows: timelineMilestones },
    },
    summary: {
      totalNotes: notes.length,
      totalContentItems: contentItems.length,
      totalGuestbookEntries: guestbookEntries.length,
      totalHomepageModules: homepageModules.length,
      totalTimelineMilestones: timelineMilestones.length,
    },
  };

  const fs = await import("fs");
  const path = await import("path");
  const filename = path.join(process.cwd(), `miggra-export-${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(filename, JSON.stringify(dump, null, 2));

  console.log(`✅ 导出完成: ${filename}`);
  console.log(`   Notes:            ${notes.length} 条`);
  console.log(`   Content Items:    ${contentItems.length} 条`);
  console.log(`   Guestbook:        ${guestbookEntries.length} 条`);
  console.log(`   Homepage Modules: ${homepageModules.length} 条`);
  console.log(`   Timeline:         ${timelineMilestones.length} 条`);

  await prisma.$disconnect();
}

exportAll().catch((err) => {
  console.error("导出失败:", err);
  process.exit(1);
});
