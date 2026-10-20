import OpenAI from "openai";
import { similarity, DUP_WARN } from "@/lib/blog-auto/similarity";
import { FACT_FIELDS, FACT_LABEL, type BlogRef, type Branch, type DraftRecord, type DraftResult, type FactField } from "./types";

export function textModel(): string {
  return process.env.NAVER_PLANNER_TEXT_MODEL || process.env.BLOG_AUTO_TEXT_MODEL || "gpt-5-mini";
}

// 실제 수업 방식 — 사실로 고정
const CLASS_FACT =
  "정해진 단체 수업 시간표에 맞춰 오는 방식이 아니라, 운영시간 안에 편한 시간에 방문해 개인별로 운동을 시작한다. 처음 하는 사람도 코치가 수준에 맞춰 지도한다.";

export const ANGLES = [
  "처음 방문하는 날 진행 순서",
  "체험·상담 전에 궁금한 것 정리",
  "운동을 처음 하는 사람의 첫 달",
  "다이어트 목적으로 복싱을 고를 때",
  "퇴근 후·늦은 시간 운동",
  "오전·낮 시간 운동",
  "주말 운동",
  "여성 입문자가 걱정하는 부분",
  "체력이 약해도 시작할 수 있는지",
  "운동 준비물과 복장",
  "등록 전에 확인하면 좋은 것",
];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["titles", "angle_summary", "blocks", "cta", "hashtags", "reference_note"],
  properties: {
    titles: { type: "array", items: { type: "string" } },
    angle_summary: { type: "string" },
    blocks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["kind", "text", "photo_tip"],
        properties: {
          kind: { type: "string", enum: ["heading", "paragraph", "photo"] },
          text: { type: "string" },
          photo_tip: { type: "string" },
        },
      },
    },
    cta: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
    reference_note: { type: "string" },
  },
};

function factValue(b: Branch, f: FactField): { text: string; usable: boolean } {
  const v = String(b[f] ?? "").trim();
  if (!v) return { text: `[입력 필요: ${FACT_LABEL[f]}]`, usable: false };
  if (!b.verified?.[f]) return { text: `[확인 필요] ${v}`, usable: false };
  return { text: v, usable: true };
}

/** 본문 아래 붙는 지점 안내 — 모델이 아니라 저장된 값으로 만든다 */
export function buildInfoBlock(b: Branch): string {
  const line = (f: FactField) => `· ${FACT_LABEL[f]}: ${factValue(b, f).text}`;
  return [
    `📍 스트롱복싱 ${b.name}`,
    line("address"),
    line("hours"),
    line("price"),
    line("phone"),
    `· 상담·예약: ${factValue(b, "booking_url").text}`,
    "· 운영시간 안에 편한 시간에 방문해 개인별로 시작합니다. 처음이어도 수준에 맞춰 알려드립니다.",
  ].join("\n");
}

export type GenerateArgs = {
  branch: Branch;
  keyword: string;
  subKeywords: string[];
  angle: string;
  memo: string;
  references: BlogRef[];
  recent: DraftRecord[];
  allBranches: Branch[];
};

function buildPrompt(a: GenerateArgs, feedback?: string): string {
  const b = a.branch;
  const facts = FACT_FIELDS.map((f) => {
    const v = factValue(b, f);
    return v.usable ? `- ${FACT_LABEL[f]}: ${v.text}` : `- ${FACT_LABEL[f]}: 확인 안 됨 → 본문에 구체 값 쓰지 말 것`;
  }).join("\n");

  const nameOf = (slug: string) => a.allBranches.find((x) => x.slug === slug)?.name ?? slug;
  const recent = a.recent.length
    ? a.recent
        .slice(0, 16)
        .map((d) => `- [${nameOf(d.branch_slug)}] 주제: ${d.angle || "-"} / 제목: ${d.first_title} / 요약: ${d.result.angle_summary}`)
        .join("\n")
    : "(없음)";

  const refs = a.references.length
    ? a.references.map((r, i) => `${i + 1}. 제목: ${r.title}\n   요약: ${r.description}`).join("\n")
    : "(검색 결과 없음)";

  return `너는 스트롱복싱 ${b.name}의 네이버 블로그 초안을 쓰는 에디터다. 관장이 직접 쓴 것처럼, 짧은 문장과 2~3줄 문단으로 쓴다.

# 지점
- 지점명: 스트롱복싱 ${b.name}
- 지역어: ${b.region_terms}
- 운영자가 확인한 지점 특징: ${b.local_notes || "(입력 없음 — 시설·장비·분위기를 지어내지 말 것)"}
- 이 지점 글의 주제 방향: ${b.angle_notes || "(입력 없음)"}
${facts}

# 수업 방식 (사실, 반드시 이 내용과 맞게)
${CLASS_FACT}
단체 수업 시간표, 반 편성, 정원, 레벨 테스트 같은 표현은 쓰지 않는다.

# 이번 글
- 핵심 키워드: ${a.keyword}
- 보조 키워드: ${a.subKeywords.join(", ") || "(없음)"}
- 주제 각도: ${a.angle}
- 운영자 메모(사실로 사용 가능): ${a.memo || "(없음)"}

# 네이버 블로그 검색 결과 (제목·요약만 있음, 본문은 읽지 않았음)
${refs}
→ 이 결과들이 흔히 다루는 내용을 파악하고, 이 글은 다른 각도·다른 예시로 쓴다.
→ 위 문장, 표현, 소제목 구성, 글 순서를 그대로 쓰거나 바꿔 쓰지 않는다.
→ reference_note에는 "검색 결과 제목·요약 기준" 으로 시작해서, 흔히 다룬 내용과 이 글이 다르게 다룬 점을 2~3문장으로 쓴다. 본문을 분석했다고 쓰지 않는다.

# 최근 작성한 초안 (전 지점) — 주제·예시·도입부·제목이 겹치지 않게
${recent}
→ 다른 지점 글에서 지역명만 바꾼 글이 되면 실패다. 이 지점의 지역어·운영자 메모·주제 방향에 맞는 상황을 골라 쓴다.

# 절대 금지
- 가짜 회원 후기, 회원 대사(따옴표 인용), "회원분들이 많이 말씀하세요" 같은 표현
- 감량 kg, 기간 내 성과, 만족도, 회원 수 같은 수치·성과
- 확인 안 된 가격·할인·이벤트·시설·장비
- "최고", "1등", "무조건" 같은 과장
- 사례가 필요하면 실제 회원이 아니라 "예를 들어 ~라면" 형태의 가정 상황으로 쓴다

# 형식
- 첫 문단은 "안녕하세요 😊\\n스트롱복싱 ${b.name}입니다💪" 로 시작한다.
- titles: 서로 다른 톤의 제목 3개. 핵심 키워드를 앞쪽에 자연스럽게. 각 35자 이내.
- angle_summary: 이 글의 주제와 다른 지점 글과 다른 점 1~2문장.
- blocks: heading / paragraph / photo 를 순서대로. 본문 전체 1,500~2,300자.
  - photo 블록은 4~7개. text에는 "어떤 사진을 넣을지"(실제 체육관에서 찍을 장면), photo_tip에는 촬영 팁 한 줄. 사람 얼굴이 나오면 동의가 필요하다는 점을 고려해 손·장비·공간 위주로 제안.
  - heading 은 필요할 때만, 2~4개.
  - 키워드는 제목, 첫 문단, 중간, 마지막 문단에 자연스럽게. 억지 반복 금지.
- cta: 상담·예약 안내 문구 3~4줄. 부담 주지 않는 말투. 링크·주소·가격·전화번호는 쓰지 않는다(아래에 따로 붙음).
- hashtags: 8~12개, # 없이.
${feedback ? `\n# 이전 결과 수정 요청\n${feedback}\n` : ""}`;
}

/* ---------------- 검사 ---------------- */

function plain(r: DraftResult): string {
  return [...r.titles, ...r.blocks.filter((x) => x.kind !== "photo").map((x) => x.text), r.cta].join("\n");
}

function norm(s: string) {
  return s.replace(/[^0-9a-zA-Z가-힣]/g, "");
}

/** 검색 결과 제목·요약과 12글자 이상 똑같이 이어지는 구간 */
function copiedFragments(text: string, refs: BlogRef[]): string[] {
  const body = norm(text);
  const hits = new Set<string>();
  const N = 12;
  for (const r of refs) {
    for (const src of [r.title, r.description]) {
      const s = norm(src);
      for (let i = 0; i + N <= s.length; i += 3) {
        const frag = s.slice(i, i + N);
        if (body.includes(frag)) {
          hits.add(frag);
          break;
        }
      }
    }
  }
  return [...hits];
}

export function lint(r: DraftResult, a: GenerateArgs): { blocking: string[]; warnings: string[] } {
  const text = plain(r);
  const blocking: string[] = [];
  const warnings: string[] = [];

  if (r.titles.length !== 3) blocking.push("제목은 정확히 3개여야 합니다.");
  const photos = r.blocks.filter((x) => x.kind === "photo").length;
  if (photos < 4) blocking.push("사진 위치(photo 블록)를 4개 이상 넣어 주세요.");
  if (/후기|입을\s*모|회원(님|분)들?(이|께서)\s*(많이\s*)?(말씀|이야기)/.test(text))
    blocking.push("회원 후기·회원 발언처럼 보이는 표현을 빼 주세요.");
  if (/\d+(\.\d+)?\s*(kg|킬로)|감량|만족도/.test(text)) blocking.push("감량 수치·만족도 같은 성과 표현을 빼 주세요.");
  if (!a.branch.verified?.price && /\d[\d,]*\s*(원|만\s*원)/.test(text)) blocking.push("확인되지 않은 가격을 쓰지 마세요.");
  if (/시간표|반\s*편성|정원|레벨\s*테스트/.test(text)) blocking.push("단체 수업 시간표·반 편성 표현은 실제 수업 방식과 맞지 않습니다.");

  const frags = copiedFragments(text, a.references);
  if (frags.length) blocking.push(`검색 결과 문장과 같은 구간이 있습니다: ${frags.slice(0, 3).join(" / ")} — 다른 문장으로 쓰세요.`);

  if (/"[^"\n]{4,60}"|“[^”\n]{4,60}”/.test(text)) warnings.push("따옴표 인용문이 있습니다. 실제 발언처럼 보이지 않는지 확인하세요.");

  return { blocking, warnings };
}

/** 같은/다른 지점 최근 초안과 제목·본문 유사도 (지역명 제거 후 비교) */
export function overlapWarnings(r: DraftResult, a: GenerateArgs): string[] {
  const out: string[] = [];
  const body = r.blocks.map((x) => x.text).join(" ");
  const nameOf = (slug: string) => a.allBranches.find((x) => x.slug === slug)?.name ?? slug;
  for (const d of a.recent) {
    const t = Math.max(...r.titles.map((title) => similarity(title, d.first_title)), 0);
    const bsim = similarity(body, d.result.blocks.map((x) => x.text).join(" "));
    if (t >= DUP_WARN || bsim >= 0.45) {
      out.push(
        `[${nameOf(d.branch_slug)}] "${d.first_title}" 초안과 비슷합니다 (제목 ${Math.round(t * 100)}%, 본문 ${Math.round(bsim * 100)}%). 주제·예시를 바꿨는지 확인하세요.`
      );
    }
  }
  return out;
}

export async function generateDraft(a: GenerateArgs) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = textModel();
  let feedback: string | undefined;
  let result: DraftResult | null = null;
  let warnings: string[] = [];

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await client.responses.create({
      model,
      input: buildPrompt(a, feedback),
      text: { format: { type: "json_schema", name: "naver_blog_draft", schema: SCHEMA as any, strict: true } },
    });
    result = JSON.parse(res.output_text) as DraftResult;
    result.hashtags = result.hashtags.map((h) => h.replace(/^#/, "").replace(/\s+/g, ""));
    const { blocking, warnings: w } = lint(result, a);
    warnings = [...blocking.map((x) => `[자동 검사] ${x}`), ...w];
    if (!blocking.length) {
      warnings = w;
      break;
    }
    feedback = blocking.join("\n");
  }
  if (!result) throw new Error("초안 생성 실패");

  warnings.push(...overlapWarnings(result, a));
  return { result, warnings, model };
}
