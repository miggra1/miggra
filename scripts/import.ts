import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const DUMP_FILE = process.argv[2];

if (!DUMP_FILE) {
  console.error("用法: npx tsx scripts/import.ts <导出文件.json>");
  console.error("示例: npx tsx scripts/import.ts miggra-export-2026-06-16.json");
  process.exit(1);
}

const prisma = new PrismaClient();

async function importAll() {
  const raw = fs.readFileSync(path.resolve(DUMP_FILE), "utf-8");
  const dump = JSON.parse(raw);

  const { notes, content_items, guestbook_entries, homepage_modules, timeline_milestones } =
    dump.tables;

  // 按依赖顺序导入
  if (homepage_modules?.rows?.length) {
    for (const row of homepage_modules.rows) {
      await prisma.homepageModule.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
    console.log(`✅ Homepage Modules: ${homepage_modules.rows.length} 条`);
  }

  if (timeline_milestones?.rows?.length) {
    for (const row of timeline_milestones.rows) {
      await prisma.timelineMilestone.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
    console.log(`✅ Timeline: ${timeline_milestones.rows.length} 条`);
  }

  if (notes?.rows?.length) {
    for (const row of notes.rows) {
      await prisma.note.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
    console.log(`✅ Notes: ${notes.rows.length} 条`);
  }

  if (content_items?.rows?.length) {
    for (const row of content_items.rows) {
      await prisma.contentItem.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
    console.log(`✅ Content Items: ${content_items.rows.length} 条`);
  }

  if (guestbook_entries?.rows?.length) {
    for (const row of guestbook_entries.rows) {
      await prisma.guestbookEntry.upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
    console.log(`✅ Guestbook: ${guestbook_entries.rows.length} 条`);
  }

  console.log("\n🎉 导入完成！");
  await prisma.$disconnect();
}

importAll().catch((err) => {
  console.error("导入失败:", err);
  process.exit(1);
});
