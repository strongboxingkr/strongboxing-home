export const BRANCHES = ["개봉점", "신정점", "목동점", "철산점", "영등포점"] as const;
export type BranchName = typeof BRANCHES[number];

export const CATEGORIES = ["소식", "이벤트", "공지"] as const;

export const HQ_BRAND = "STRONGBOXING HQ";
export const HQ_VERSION = "1.0.0";
