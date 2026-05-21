import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contentItem.deleteMany();
  await prisma.note.deleteMany();
  await prisma.guestbookEntry.deleteMany();
  await prisma.homepageModule.deleteMany();
  await prisma.timelineMilestone.deleteMany();

  await prisma.note.createMany({
    data: [
      {
        title: "把网站变成一个会慢慢生长的地方",
        text: "今天把首页和后台又往前推进了一点，希望它以后不只是一个静态展示页，而是一个真的能持续记录、持续回看的空间。",
        tag: "站点",
        status: "PUBLISHED",
        pinned: true,
      },
      {
        title: "晚上整理了一下灵感墙",
        text: "灵感不一定要很完整才配被保存，碎片、便签、半成品也可以先放进去。",
        tag: "灵感",
        status: "PUBLISHED",
      },
      {
        title: "给留言板留一个位置",
        text: "如果有人路过，能留下点什么会很温柔。",
        tag: "网站",
        status: "PUBLISHED",
      },
    ],
  });

  await prisma.contentItem.createMany({
    data: [
      {
        section: "NOW",
        title: "状态 1",
        detail: "最近在打磨这个个人站的内容结构，让它不只是碎碎念，也能像一个会成长的小空间。",
        meta: "Current",
        order: 1,
      },
      {
        section: "NOW",
        title: "状态 2",
        detail: "白天会先处理项目和页面，晚上则更适合整理灵感、书单和待办。",
        meta: "Current",
        order: 2,
      },
      {
        section: "WISH",
        title: "完成一个更完整的个人站",
        detail: "包含博客、灵感、书单、旅行和回忆录。",
        status: "进行中",
        order: 1,
      },
      {
        section: "WISH",
        title: "去一次想去很久的城市",
        detail: "最好能慢慢走、慢慢拍、慢慢写。",
        status: "长期",
        order: 2,
      },
      {
        section: "READING",
        title: "《你当像鸟飞往你的山》",
        detail: "读完后会想重新整理自己的成长轨迹。",
        status: "已读完",
        order: 1,
      },
      {
        section: "READING",
        title: "《The Almanack of Naval Ravikant》",
        detail: "适合慢慢读，很多句子值得反复想。",
        status: "在读",
        order: 2,
      },
      {
        section: "INSPIRATION",
        title: "页面像便签一样轻",
        detail: "让灵感写下来很容易，而不是每次都像在写正式文章。",
        meta: "灵感收集",
        order: 1,
      },
      {
        section: "INSPIRATION",
        title: "留一点生活状态",
        detail: "把当下在做什么、在想什么、在读什么放进网站。",
        meta: "Now",
        order: 2,
      },
      {
        section: "TIMELINE",
        title: "第一次认真做个人站改版",
        detail: "开始把碎碎念、项目和生活拆开整理。",
        meta: "2024",
        order: 1,
      },
      {
        section: "TIMELINE",
        title: "把内容更新变成一个习惯",
        detail: "逐步加入归档、标签和可维护的写作结构。",
        meta: "2025",
        order: 2,
      },
      {
        section: "TIMELINE",
        title: "让网站更像自己",
        detail: "加入 Now、愿望清单、书单和回忆页。",
        meta: "2026",
        order: 3,
      },
    ],
  });

  await prisma.timelineMilestone.createMany({
    data: [
      {
        year: "2021",
        kind: "PERSONAL",
        title: "开始独立整理自己的表达",
        detail: "那时候只是想把零散的想法写下来，慢慢发现记录本身也在塑造自己。",
        order: 1,
      },
      {
        year: "2023",
        kind: "PERSONAL",
        title: "开始更认真看待个人作品",
        detail: "不再把网站当作临时项目，而是一个真正可以长期维护的空间。",
        order: 2,
      },
      {
        year: "2024",
        kind: "SITE",
        title: "第一次认真做个人站改版",
        detail: "开始把碎碎念、项目和生活拆开整理。",
        order: 1,
      },
      {
        year: "2025",
        kind: "SITE",
        title: "把内容更新变成一个习惯",
        detail: "逐步加入归档、标签和可维护的写作结构。",
        order: 2,
      },
      {
        year: "2026",
        kind: "SITE",
        title: "让网站更像自己",
        detail: "加入 Now、愿望清单、书单、灵感墙、留言板和人生节点。",
        order: 3,
      },
    ],
  });

  await prisma.homepageModule.createMany({
    data: [
      { key: "now", title: "Now", enabled: true, order: 1 },
      { key: "wish", title: "愿望清单", enabled: true, order: 2 },
      { key: "reading", title: "书单", enabled: true, order: 3 },
      { key: "inspirations", title: "灵感墙", enabled: true, order: 4 },
      { key: "timeline", title: "人生节点", enabled: true, order: 5 },
      { key: "guestbook", title: "公开留言板", enabled: true, order: 6 },
    ],
  });

  await prisma.guestbookEntry.createMany({
    data: [
      { name: "路过的人", message: "这里很安静，也很舒服。", status: "PUBLISHED" },
      { name: "匿名", message: "喜欢这种慢慢长出来的网站。", status: "PUBLISHED" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
