export type NoteMood = "平静" | "兴奋" | "疲惫" | "松弛" | "想念" | "记录";

export type NoteMoodMeta = {
  value: NoteMood;
  label: NoteMood;
  borderClass: string;
  softClass: string;
  textClass: string;
  dotClass: string;
  barClass: string;
};

export const NOTE_MOODS: NoteMoodMeta[] = [
  {
    value: "平静",
    label: "平静",
    borderClass: "border-sky-300/30",
    softClass: "bg-sky-300/10",
    textClass: "text-sky-100",
    dotClass: "bg-sky-300",
    barClass: "bg-sky-300",
  },
  {
    value: "兴奋",
    label: "兴奋",
    borderClass: "border-rose-300/30",
    softClass: "bg-rose-300/10",
    textClass: "text-rose-100",
    dotClass: "bg-rose-300",
    barClass: "bg-rose-300",
  },
  {
    value: "疲惫",
    label: "疲惫",
    borderClass: "border-zinc-300/30",
    softClass: "bg-zinc-300/10",
    textClass: "text-zinc-100",
    dotClass: "bg-zinc-300",
    barClass: "bg-zinc-300",
  },
  {
    value: "松弛",
    label: "松弛",
    borderClass: "border-emerald-300/30",
    softClass: "bg-emerald-300/10",
    textClass: "text-emerald-100",
    dotClass: "bg-emerald-300",
    barClass: "bg-emerald-300",
  },
  {
    value: "想念",
    label: "想念",
    borderClass: "border-violet-300/30",
    softClass: "bg-violet-300/10",
    textClass: "text-violet-100",
    dotClass: "bg-violet-300",
    barClass: "bg-violet-300",
  },
  {
    value: "记录",
    label: "记录",
    borderClass: "border-amber-300/30",
    softClass: "bg-amber-300/10",
    textClass: "text-amber-100",
    dotClass: "bg-amber-300",
    barClass: "bg-amber-300",
  },
];

export function getMoodMeta(value?: string | null): NoteMoodMeta {
  return NOTE_MOODS.find((mood) => mood.value === value) ?? NOTE_MOODS[NOTE_MOODS.length - 1];
}

export function moodFor(note: {
  mood?: string | null;
  tag?: string | null;
  title?: string | null;
  text?: string | null;
}): NoteMood {
  const explicitMood = note.mood?.trim();
  if (explicitMood && NOTE_MOODS.some((mood) => mood.value === explicitMood)) {
    return explicitMood as NoteMood;
  }

  const tagMood = note.tag?.trim();
  if (tagMood && NOTE_MOODS.some((mood) => mood.value === tagMood)) {
    return tagMood as NoteMood;
  }

  const content = `${note.title ?? ""} ${note.text ?? ""}`;
  if (/想念|怀念|回忆|以前|梦见|舍不得/.test(content)) return "想念";
  if (/累|困|疲惫|熬夜|低电量|撑住|没睡/.test(content)) return "疲惫";
  if (/开心|兴奋|喜欢|完成|终于|太好了|快乐/.test(content)) return "兴奋";
  if (/松弛|慢慢|散步|休息|晒太阳|发呆|舒服/.test(content)) return "松弛";
  if (/平静|安静|稳定|轻轻|普通|日常/.test(content)) return "平静";
  return "记录";
}
