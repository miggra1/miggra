import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.note.deleteMany();

  await prisma.note.createMany({
    data: [
      {
        title: "凌晨一点的脑海回声",
        text: "有些想法像雾一样，抓不住，但很适合被写下来。",
        tag: "随想",
        status: "PUBLISHED",
      },
      {
        title: "今天的天空很像电影分镜",
        text: "云层、光线和风都在慢慢移动，像一场不会结束的长镜头。",
        tag: "观察",
        status: "PUBLISHED",
      },
      {
        title: "把日常当作素材",
        text: "记录不是为了完整，而是为了在未来某天重新看见自己。",
        tag: "记录",
        status: "PUBLISHED",
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
