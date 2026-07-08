export type SectionIdentity = {
  label: string;
  eyebrowClass: string;
  borderClass: string;
  softClass: string;
  textClass: string;
  hoverClass: string;
  badgeClass: string;
};

export const sectionIdentity = {
  now: {
    label: "Now",
    eyebrowClass: "text-emerald-300",
    borderClass: "border-emerald-300/25",
    softClass: "bg-emerald-300/10",
    textClass: "text-emerald-100",
    hoverClass: "hover:border-emerald-300/45 hover:bg-emerald-300/10",
    badgeClass: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  },
  wish: {
    label: "愿望",
    eyebrowClass: "text-violet-300",
    borderClass: "border-violet-300/25",
    softClass: "bg-violet-300/10",
    textClass: "text-violet-100",
    hoverClass: "hover:border-violet-300/45 hover:bg-violet-300/10",
    badgeClass: "border-violet-300/25 bg-violet-300/10 text-violet-100",
  },
  reading: {
    label: "书单",
    eyebrowClass: "text-amber-300",
    borderClass: "border-amber-300/25",
    softClass: "bg-amber-300/10",
    textClass: "text-amber-100",
    hoverClass: "hover:border-amber-300/45 hover:bg-amber-300/10",
    badgeClass: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  },
  inspiration: {
    label: "灵感",
    eyebrowClass: "text-pink-300",
    borderClass: "border-pink-300/25",
    softClass: "bg-pink-300/10",
    textClass: "text-pink-100",
    hoverClass: "hover:border-pink-300/45 hover:bg-pink-300/10",
    badgeClass: "border-pink-300/25 bg-pink-300/10 text-pink-100",
  },
} satisfies Record<string, SectionIdentity>;
