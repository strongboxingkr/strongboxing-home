import { keywordTool, normalizeHint } from "./naver";
import type { Branch, KeywordRow, ScoredKeyword } from "./types";

// 방문상담·체험·등록 가능성 판단은 규칙 기반 (점수와 이유를 그대로 화면에 보여줌).
// 검색량 하한은 두지 않음 — 적어도 지역·목적이 뚜렷하면 추천.

const BOXING = ["복싱", "권투", "킥복싱", "스파링", "복싱장", "복싱체육관"];
const FITNESS = ["다이어트", "운동", "체육관", "헬스", "pt", "피티", "유산소", "체력", "줄넘기", "격투기", "주짓수", "무에타이"];

const INTENTS: { label: string; words: string[]; reason: string }[] = [
  { label: "체험·상담", words: ["체험", "상담", "원데이", "일일", "무료", "방문"], reason: "체험·상담 의사가 드러나는 검색" },
  { label: "등록·가격", words: ["가격", "비용", "회비", "등록", "한달", "1개월", "3개월", "할인", "월회비"], reason: "등록 전 가격·조건을 비교하는 단계" },
  { label: "위치", words: ["근처", "주변", "역", "가까운", "위치", "추천"], reason: "가까운 곳을 찾는 검색 → 방문으로 이어지기 쉬움" },
  { label: "대상", words: ["초보", "입문", "여자", "여성", "성인", "직장인", "중년", "학생", "청소년", "키즈", "아이", "초등", "남자", "40대", "50대"], reason: "운동할 사람이 분명함 → 수준별 지도 안내와 맞음" },
  { label: "목적", words: ["다이어트", "체력", "살빼기", "스트레스", "자세", "호신"], reason: "운동 목적이 분명함" },
  { label: "시간대", words: ["저녁", "아침", "오전", "새벽", "주말", "토요일", "퇴근", "점심"], reason: "시간대 조건 검색 → 운영시간 안내로 연결" },
];

// 다른 지점·다른 동네 지명. 자기 지점 지역어는 계산 시 제외
const OTHER_AREAS = [
  "개봉", "고척", "구로", "신정", "양천", "목동", "오목교", "철산", "광명", "영등포", "신길", "도림", "당산", "문래",
  "신도림", "대림", "강남", "강서", "강동", "강북", "마곡", "발산", "화곡", "등촌", "염창", "가양", "부천", "역곡", "온수",
  "오류동", "천왕", "하안", "소하", "일직", "홍대", "합정", "마포", "신촌", "잠실", "송파", "노원", "일산", "분당", "인천",
  "수원", "안양", "시흥", "김포", "관악", "신림", "사당", "동작", "용산", "성수", "건대", "왕십리", "미아", "은평", "연신내",
  "서초", "교대", "판교", "평촌", "산본", "의정부", "고양", "파주", "부평", "송도", "신월",
];

const DIRECT_SUFFIXES = ["체험", "가격", "초보", "여자", "다이어트", "성인", "직장인", "저녁", "주말", "입문"];

export function regionTerms(b: Branch): string[] {
  return b.region_terms
    .split(",")
    .map((s) => normalizeHint(s))
    .filter(Boolean);
}

export function defaultHints(b: Branch): string[] {
  return regionTerms(b)
    .slice(0, 5)
    .map((r) => `${r}복싱`);
}

/** 지역어 + 복싱 + 목적어 조합. 연관 키워드에 안 나오는 롱테일 검색량을 직접 확인하는 용도 */
export function directCombos(b: Branch, max = 10): string[] {
  const regions = regionTerms(b).slice(0, 2);
  const out: string[] = [];
  for (const s of DIRECT_SUFFIXES) for (const r of regions) out.push(`${r}복싱${s}`);
  // 지역어별로 번갈아 섞어서 앞에서부터 max개
  return out.slice(0, max);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 힌트(최대 5개씩)로 연관 키워드 조회 + 목적 조합을 직접 조회 */
export async function runLookup(hints: string[], combos: string[]) {
  const errors: string[] = [];
  const map = new Map<string, KeywordRow>();

  const batches: { list: string[]; direct: boolean }[] = [];
  for (let i = 0; i < hints.length; i += 5) batches.push({ list: hints.slice(i, i + 5), direct: false });
  for (let i = 0; i < combos.length; i += 5) batches.push({ list: combos.slice(i, i + 5), direct: true });

  for (const [i, batch] of batches.entries()) {
    if (i > 0) await sleep(400);
    try {
      const rows = await keywordTool(batch.list);
      const directSet = new Set(batch.list.map(normalizeHint));
      for (const r of rows) {
        const isDirect = batch.direct && directSet.has(r.keyword);
        const prev = map.get(r.keyword);
        if (!prev) map.set(r.keyword, { ...r, source: isDirect ? "direct" : "related" });
        else if (isDirect) prev.source = "direct";
      }
    } catch (e) {
      errors.push(`[${batch.list.join(", ")}] ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const notReturned = combos.map(normalizeHint).filter((c) => !map.has(c));
  return { rows: [...map.values()], notReturned, errors };
}

/** 정렬용 합계. "< 10" 은 0 으로 취급 (화면에는 원래 값 표시) */
function total(r: KeywordRow): number {
  return (r.pc.num ?? 0) + (r.mobile.num ?? 0);
}

/** 화면 표시용 월 합계. "< 10" 이 섞이면 범위로 표시 — 값을 만들지 않음 */
function totalLabel(r: KeywordRow): string {
  const under = [r.pc, r.mobile].filter((v) => v.num === null).length;
  const sum = total(r);
  if (under === 0) return sum.toLocaleString();
  if (under === 2) return "< 20";
  return `${sum.toLocaleString()}~${(sum + 9).toLocaleString()}`;
}

export function scoreKeywords(rows: KeywordRow[], b: Branch): ScoredKeyword[] {
  const own = regionTerms(b);
  const lower = (s: string) => s.toLowerCase();

  return rows
    .map((r) => {
      const k = lower(r.keyword);
      const reasons: string[] = [];
      let score = 0;

      const regionMatch = own.some((t) => k.includes(lower(t)));
      const otherRegion = OTHER_AREAS.some((a) => k.includes(a) && !own.some((t) => t.includes(a) || a.includes(t)));
      const relevance: ScoredKeyword["relevance"] = BOXING.some((w) => k.includes(w))
        ? "boxing"
        : FITNESS.some((w) => k.includes(w))
          ? "fitness"
          : "none";

      if (regionMatch) {
        score += 40;
        reasons.push(`${b.name} 지역어 포함`);
      }
      if (otherRegion) {
        score -= 40;
        reasons.push("다른 지역명 포함 — 이 지점 글에는 맞지 않음");
      }
      if (relevance === "boxing") {
        score += 25;
        reasons.push("복싱 직접 관련");
      } else if (relevance === "fitness") {
        score += 10;
        reasons.push("운동·다이어트 관련 (복싱과 연결해 쓸 수 있음)");
      } else {
        reasons.push("복싱·운동과 관련성 낮음");
      }

      // 지역어 안의 글자(개봉"역" 등)를 의도로 세지 않도록 지역어를 지운 뒤 검사
      const rest = own.reduce((acc, t) => acc.split(lower(t)).join(" "), k);
      let intentHits = 0;
      for (const it of INTENTS) {
        if (it.words.some((w) => rest.includes(w))) {
          intentHits++;
          if (intentHits <= 3) score += 15;
          reasons.push(`${it.label}: ${it.reason}`);
        }
      }

      if (r.compIdx === "낮음") {
        score += 5;
        reasons.push("광고 경쟁도 낮음");
      }

      const t = total(r);
      score += Math.min(12, Math.round(Math.log10(t + 1) * 3));
      if (regionMatch && relevance !== "none" && t < 100) {
        reasons.push("검색량은 적지만 지역·목적이 뚜렷해 방문 전환을 노릴 만함");
      }

      const recommended = regionMatch && !otherRegion && relevance !== "none" && score >= 65;
      // 월 합계 10 이상이면 "검색량 있음", 아니면 롱테일(본문 보조 키워드용)
      const tier: ScoredKeyword["tier"] = t >= 10 ? "volume" : "longtail";
      return { ...r, score, recommended, regionMatch, otherRegion, relevance, reasons, tier, total: t, totalLabel: totalLabel(r) };
    })
    // 검색량 많은 순 → 같으면 점수 순
    .sort((a, b) => b.total - a.total || b.score - a.score);
}
