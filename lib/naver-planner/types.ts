export const BRANCH_SLUGS = ["gaebong", "sinjeong", "mokdong", "cheolsan"] as const;
export type BranchSlug = (typeof BRANCH_SLUGS)[number];

/** 확인 여부를 따로 관리하는 사실 항목 */
export const FACT_FIELDS = ["address", "hours", "price", "booking_url", "phone"] as const;
export type FactField = (typeof FACT_FIELDS)[number];

export const FACT_LABEL: Record<FactField, string> = {
  address: "주소",
  hours: "운영시간",
  price: "가격",
  booking_url: "예약 링크",
  phone: "전화번호",
};

export type Branch = {
  slug: BranchSlug;
  name: string;
  address: string;
  hours: string;
  price: string;
  booking_url: string;
  phone: string;
  region_terms: string;
  local_notes: string;
  angle_notes: string;
  verified: Partial<Record<FactField, boolean>>;
  updated_at?: string;
};

/** 검색광고 API 검색량: 10 미만은 API가 "< 10" 문자열로 줌 → 그대로 보존 */
export type Volume = { raw: string; num: number | null };

export type KeywordRow = {
  keyword: string;
  pc: Volume;
  mobile: Volume;
  compIdx: string; // 낮음/중간/높음 (API 값 그대로)
  source: "related" | "direct"; // 연관 키워드 / 직접 조회한 조합
};

export type ScoredKeyword = KeywordRow & {
  score: number;
  recommended: boolean;
  regionMatch: boolean;
  otherRegion: boolean;
  relevance: "boxing" | "fitness" | "none";
  reasons: string[];
  tier: "volume" | "longtail"; // 월 합계 10 이상 / 미만
  total: number; // 정렬용 ("< 10" 은 0)
  totalLabel: string; // 표시용
};

export type KeywordLookup = {
  id: number;
  branch_slug: BranchSlug;
  hints: string;
  fetched_at: string;
  rows: KeywordRow[];
  notReturned: string[]; // 직접 조회했지만 API가 값을 주지 않은 조합
  errors: string[];
};

export type BlogRef = {
  title: string;
  description: string;
  link: string;
  bloggername: string;
  postdate: string;
};

export type DraftBlock = { kind: "heading" | "paragraph" | "photo"; text: string; photo_tip: string };

export type DraftResult = {
  titles: string[];
  angle_summary: string;
  blocks: DraftBlock[];
  cta: string;
  hashtags: string[];
  reference_note: string;
};

export type DraftRecord = {
  id: number;
  branch_slug: BranchSlug;
  keyword: string;
  sub_keywords: string;
  angle: string;
  first_title: string;
  result: DraftResult;
  infoBlock: string;
  references: BlogRef[];
  keywords: { keyword: string; pc: string; mobile: string; fetched_at: string | null }[];
  warnings: string[];
  model: string;
  created_at: string;
};
