// 주제·글 중복 판별
// - normalizeTopic: 지역명/지점명/조사·기호를 제거한 비교용 키 → 지역명만 바꾼 주제를 같은 주제로 판별
// - similarity: 글자 bigram Jaccard (0~1)

const REGION_WORDS = [
  "목동", "목5동", "오목교", "신정동", "신정", "양천구", "양천", "개봉동", "개봉", "고척", "구로구", "구로",
  "철산동", "철산역", "철산", "광명시", "광명", "영등포구", "영등포", "신길동", "신길", "도림동", "도림",
  "서울시", "서울", "강서구", "강서", "강남구", "강남", "마포", "부천",
];
// 일반 단어와 겹치는 지명(개봉=개봉기, 신정=새해) — 비교 키에서는 지우지만 등록 거절 기준에서는 제외
const AMBIGUOUS_REGIONS = ["개봉", "신정"];
const GENERIC_WORDS = ["스트롱복싱", "지점", "근처", "인근"];

/** 지역명·지점명이 들어 있는지 (주제 등록 시 거절용) */
export function hasRegion(text: string): boolean {
  return /(목동|신정|개봉|철산|영등포)\s*점/.test(text) || REGION_WORDS.filter((w) => !AMBIGUOUS_REGIONS.includes(w)).some((w) => text.includes(w));
}

// 의미 차이가 거의 없는 어미·조사
const STOP_WORDS = ["까요", "할까", "을까", "ㄹ까", "하는", "하면", "에서", "으로", "에게", "어떤", "무엇"];

export function stripRegions(text: string): string {
  let t = text.replace(/(목동|신정|개봉|철산|영등포)\s*점/g, " "); // ○○점
  for (const w of [...REGION_WORDS, ...GENERIC_WORDS]) t = t.split(w).join(" ");
  return t;
}

export function normalizeTopic(text: string): string {
  return stripRegions(String(text || "").toLowerCase())
    .replace(/[^0-9a-z가-힣]/g, "")
    .trim();
}

function bigrams(text: string): Set<string> {
  let t = normalizeTopic(text);
  for (const w of STOP_WORDS) t = t.split(w).join("");
  const set = new Set<string>();
  for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
  return set;
}

export function similarity(a: string, b: string): number {
  const A = bigrams(a);
  const B = bigrams(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/** 제목 기준 + 설명 보조 비교. 설명은 가중치를 낮춰 반영 */
export function postSimilarity(topic: string, title: string, description?: string | null): number {
  const t = similarity(topic, title);
  const d = description ? similarity(topic, description) * 0.8 : 0;
  return Math.max(t, d);
}

export const DUP_BLOCK = 0.6; // 이 이상이면 생성 중단 → 주제 보류
export const DUP_WARN = 0.35; // 이 이상이면 관리자에게 표시 + 모델에 "겹치지 않게" 전달
