import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contentItem.deleteMany();
  await prisma.note.deleteMany();

  await prisma.note.createMany({
    data: [
      {
        title: "凌晨一点的脑海回声",
        text: "有些想法像雾一样，抓不住，但很适合被写下来。",
        tag: "随想",
        status: "PUBLISHED",
        pinned: true,
      },
      {
        title: "今天的天空很像电影分镜",
        text: "云层、光线和风都在慢慢移动，像一场不会结束的长镜头。",
        tag: "观察",
        status: "PUBLISHED",
        pinned: false,
      },
      {
        title: "把日常当作素材",
        text: "记录不是为了完整，而是为了在未来某天重新看见自己。",
        tag: "记录",
        status: "PUBLISHED",
        pinned: false,
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
