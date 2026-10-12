// 복싱 정보 글 자동화 — 공용 타입

export const TOPIC_STATUSES = ["미작성", "작성중", "초안", "발행", "보류", "실패"] as const;
export type TopicStatus = (typeof TOPIC_STATUSES)[number];

export type Topic = {
  id: number;
  title: string;
  keyword: string;
  audience: string;
  status: TopicStatus;
  priority: number;
  memo: string | null;
  draft_id: number | null;
  created_at: string;
  updated_at: string;
};

/** 본문 소제목 단위. basis 로 일반 정보와 스트롱복싱 운영 정보를 구분 */
export type DraftSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
  basis: "general" | "gym_verified";
};

export type DraftFaq = { q: string; a: string };

export type ImageRole = "cover" | "body1" | "body2";

export type DraftImage = {
  role: ImageRole;
  /** illustration = 생성 일러스트, photo = 관리자가 올린 실제 사진 */
  kind: "illustration" | "photo";
  filename: string;
  alt: string;
  caption: string;
  /** 일러스트 생성 프롬프트 (이미지 도구가 없으면 이 프롬프트를 초안에 남김) */
  prompt: string;
  /** -1 = 요약 바로 아래(대표 이미지), n = n번째 소제목 섹션 뒤 */
  afterSection: number;
  /** 기술 자세·핸드랩 순서 등 정확성이 필요한 이미지 → 코치 검수 전 게시 불가 */
  needsCoachReview: boolean;
  coachApproved: boolean;
  status: "pending" | "ready" | "failed";
  url: string | null;
  width?: number;
  height?: number;
  bytes?: number;
  error?: string;
};

export type AdminCheck = {
  id: string;
  text: string;
  /** open = 확인 필요, confirmed = 확인 완료, dismissed = 본문에 반영 안 함 */
  status: "open" | "confirmed" | "dismissed";
  note?: string;
};

export type RelatedLink = { title: string; href: string };

export type LinkReportItem = { href: string; ok: boolean; reason?: string };

export type DupReportItem = { source: "post" | "draft" | "topic"; id: number; title: string; score: number };

export type DraftBody = {
  summary: string;
  sections: DraftSection[];
  faq: DraftFaq[];
  cta: { text: string; linkLabel: string; href: string };
};

export type DraftStatus = "draft" | "published" | "discarded";

export type Draft = {
  id: number;
  topic_id: number;
  title: string;
  slug: string;
  description: string;
  keyword: string;
  body: DraftBody;
  content_html: string;
  images: DraftImage[];
  checks: AdminCheck[];
  related: RelatedLink[];
  link_report: LinkReportItem[];
  dup_report: DupReportItem[];
  status: DraftStatus;
  published_post_id: number | null;
  model: string | null;
  created_at: string;
  updated_at: string;
};

export type RunLogLine = { at: string; level: "info" | "warn" | "error"; msg: string };
