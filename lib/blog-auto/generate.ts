import OpenAI from "openai";
import type { AdminCheck, DraftBody, DraftImage, ImageRole, Topic } from "./types";
import type { RelatedCandidate } from "./links";

export function textModel(): string {
  // 2026-10 테스트에서 gpt-4.1-mini·gpt-4.1보다 사실 구분·문체 지시를 잘 따름 (글 1개 약 $0.02)
  return process.env.BLOG_AUTO_TEXT_MODEL || "gpt-5-mini";
}

export type GeneratedPost = {
  title: string;
  slug: string;
  description: string;
  body: DraftBody;
  relatedSlugs: string[];
  images: DraftImage[];
  checks: AdminCheck[];
  usage: { input_tokens: number; output_tokens: number };
};

const CTA_HREFS = ["/reservation", "/branches/mokdong", "/branches/sinjeong", "/branches/gaebong", "/branches/cheolsan", "/branches/yeongdeungpo"];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "slug", "description", "summary", "sections", "faq", "cta", "related_slugs", "images", "admin_checks"],
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    description: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "paragraphs", "bullets", "basis"],
        properties: {
          heading: { type: "string" },
          paragraphs: { type: "array", items: { type: "string" } },
          bullets: { type: "array", items: { type: "string" } },
          basis: { type: "string", enum: ["general", "gym_verified"] },
        },
      },
    },
    faq: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["q", "a"],
        properties: { q: { type: "string" }, a: { type: "string" } },
      },
    },
    cta: {
      type: "object",
      additionalProperties: false,
      required: ["text", "link_label", "href"],
      properties: {
        text: { type: "string" },
        link_label: { type: "string" },
        href: { type: "string", enum: CTA_HREFS },
      },
    },
    related_slugs: { type: "array", items: { type: "string" } },
    images: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "after_section", "alt", "caption", "prompt", "filename_hint", "accuracy_sensitive"],
        properties: {
          role: { type: "string", enum: ["cover", "body1", "body2"] },
          after_section: { type: "integer" },
          alt: { type: "string" },
          caption: { type: "string" },
          prompt: { type: "string" },
          filename_hint: { type: "string" },
          accuracy_sensitive: { type: "boolean" },
        },
      },
    },
    admin_checks: { type: "array", items: { type: "string" } },
  },
} as const;

function buildPrompt(p: {
  topic: Topic;
  facts: string;
  similar: { title: string }[];
  related: RelatedCandidate[];
  feedback?: string;
}) {
  const facts = p.facts.trim();
  return `
너는 서울·광명에서 복싱 체육관 5곳(목동·신정·개봉·철산·영등포)을 운영하는 '스트롱복싱'의 코치다.
홈페이지 블로그에 복싱을 처음 시작하는 사람을 위한 정보 글을 쓴다. 회원에게 직접 설명하듯 쓴다.

[이번 글]
- 제목(주제): ${p.topic.title}
- 핵심 키워드: ${p.topic.keyword}
- 독자: ${p.topic.audience || "복싱을 처음 시작하려는 성인"}

[스트롱복싱에서 확인된 운영 정보 — 이 목록에 있는 내용만 '스트롱복싱에서는'으로 쓸 수 있다]
${facts || "(없음 — 스트롱복싱의 수업 방식·가격·운영시간·코치 자격·단증 심사 등은 본문에 쓰지 말고 admin_checks 에 남길 것)"}

[이미 있는 비슷한 글 — 내용이 겹치지 않게 다른 정보에 집중할 것]
${p.similar.length ? p.similar.map((s) => `- ${s.title}`).join("\n") : "(없음)"}

[관련 글 후보 — related_slugs 에는 이 목록의 slug 만, 내용이 실제로 이어지는 글만 0~3개]
${p.related.length ? p.related.map((r) => `- ${r.slug} : ${r.title}`).join("\n") : "(없음 — 빈 배열)"}

[문체]
- 자연스러운 한국어, '~합니다/~입니다' 체. 질문에 첫 문단(summary)에서 바로 답한다.
- 인사말("안녕하세요", "오늘은 ~에 대해"), 맺음 상투구("마무리하며", "결론적으로", "도움이 되셨길"), 이모지, 느낌표 남발 금지.
- "~것이 중요합니다", "다양한", "효과적인" 같은 뜻 없는 표현을 반복하지 않는다. 과장된 홍보 금지.
- 주제 하나에만 집중한다. 분량을 억지로 늘리지 않되, 독자가 체육관에 가기 전에 알고 싶은 것을 빠짐없이 답한다.
  기준: 섹션 본문(문단+목록) 합계 공백 제외 1,300~2,200자. 문단은 2~4문장으로, 이유와 구체적인 상황을 함께 쓴다.
- 핵심 키워드는 제목에 1번, 본문에는 문맥상 자연스러울 때만 2~4번. 같은 말을 반복 삽입하지 않는다.
- 지역명을 넣지 않는다. 특정 지점 홍보 글이 아니라 누구에게나 통하는 정보 글이다.

[사실 규칙]
- 일반적인 복싱 정보는 basis "general". 확인된 운영 정보를 근거로 한 섹션만 basis "gym_verified".
- 회원 후기, 상담 사례, "회원 ○○%가", 칼로리·체중 감량 수치, 검색량 같은 숫자나 사례를 만들어내지 않는다.
- 일반 정보라도 사람마다 다른 내용은 "보통", "경우가 많습니다"처럼 단정하지 않는다. 의학적 판단이 필요한 내용은 전문가 상담을 권한다.
- 장비 규격(길이·온스·무게 등) 같은 수치는 널리 통용되는 범위로만 쓰고("○~○ 사이 제품이 많습니다"), 확신이 없으면 수치를 빼고 admin_checks 에 남긴다.
- "대부분의 체육관은 ~합니다"처럼 다른 체육관 운영을 일반화하지 않는다. "체육관마다 다르니 미리 물어보세요"로 쓴다.
- 주제와 상관없는 내용(예: 준비물 글에 요가매트·데오드란트)을 분량을 채우려고 넣지 않는다.
- 확인이 필요한 사실(스트롱복싱 운영 방식, 장비 대여, 체험 수업 여부 등)은 본문에 단정하지 말고 admin_checks 에 한 줄씩 남긴다.

[구성]
- title: 40자 내외, 질문형 주제를 살리되 키워드를 앞쪽에.
- slug: 영어 소문자와 하이픈만, 3~6단어.
- description: 메타 설명, 80자 이내, 질문에 대한 답을 한 문장으로.
- summary: 2~3문장, 질문에 대한 직접적인 답.
- sections: 4~7개. 소제목은 독자가 실제로 궁금해할 질문이나 답의 핵심으로. 목록이 더 읽기 쉬울 때만 bullets 사용.
  화면에는 paragraphs[0] → bullets → paragraphs[1..] 순서로 표시된다. 목록이 있으면 첫 문단은 목록을 여는 문장으로 쓴다.
- faq: 본문에서 다루지 않은 질문 2~4개. 본문 내용을 다시 묻는 질문은 금지. 답은 2~3문장.
- cta: 글 내용과 이어지는 한 문장 + 링크. 예약 페이지(/reservation)는 '방문 상담 예약' 페이지다.${facts.includes("체험") ? "" : ' "체험 수업"이라고 쓰지 않는다.'}
- images:
  - cover 1장은 필수. 주제를 상징하는 장비·사물 중심 일러스트(예: 글러브, 핸드랩, 줄넘기, 물병). after_section = -1.
  - body 이미지는 설명에 실제로 도움이 될 때만 0~2장. after_section 은 0부터 시작하는 섹션 번호.
  - 체육관 내부·입구나 회원을 묘사하지 않는다(실제 현장 사진과 혼동 방지). 사람이 꼭 필요하면 얼굴 없는 단순한 실루엣만. 이미지 안에 글자를 넣지 않는다.
  - 기술 자세, 펀치 동작, 핸드랩 감는 순서처럼 정확성이 필요한 이미지는 accuracy_sensitive = true.
  - prompt 는 영어로, 무엇을 그릴지(사물·배치)만 구체적으로. 색·화풍은 시스템이 홈페이지 톤으로 정하므로 쓰지 않는다. alt 는 이미지 내용을 설명하는 한국어 한 문장('사진'이라고 쓰지 말고 '일러스트'로). caption 은 짧게(없으면 빈 문자열).
  - filename_hint 는 영어 소문자-하이픈.
${p.feedback ? `\n[이전 결과 수정 요청]\n${p.feedback}\n` : ""}
반드시 지정된 JSON 스키마로만 답한다.`.trim();
}

const BANNED_PHRASES = [
  "안녕하세요", "오늘은", "알아보겠습니다", "알아볼까요", "마무리하며", "결론적으로", "도움이 되셨", "여러분",
  "체험 수업", "놓치지 마세요", "지금 바로", "매우 중요합니다", "대부분의 체육관", "대부분 체육관",
];
const EMOJI_RX = /\p{Extended_Pictographic}/u;
const ACCURACY_RX = /자세|스탠스|stance|guard|가드|핸드랩.*(감|순서)|wrap(ping)?\s*(steps|order)|펀치\s*동작|footwork|풋워크|기술/i;

function allText(o: any): string {
  return [o.title, o.description, o.summary, ...o.sections.flatMap((s: any) => [s.heading, ...s.paragraphs, ...s.bullets]), ...o.faq.flatMap((f: any) => [f.q, f.a]), o.cta.text].join("\n");
}

/** 문체·구성 검사. 문제 목록을 반환 (빈 배열 = 통과) */
export function lintPost(o: any, keyword: string, facts = ""): string[] {
  const issues: string[] = [];
  const text = allText(o);
  for (const p of BANNED_PHRASES) {
    if (p === "체험 수업" && facts.includes("체험")) continue; // 확인된 정보에 체험 수업이 있으면 허용
    if (text.includes(p)) issues.push(`금지 표현 "${p}" 사용`);
  }
  if (EMOJI_RX.test(text)) issues.push("이모지 사용");
  if (o.sections.length < 3) issues.push("소제목 섹션이 3개 미만");
  const bodyLen = o.sections
    .flatMap((s: any) => [...s.paragraphs, ...s.bullets])
    .join("")
    .replace(/\s/g, "").length;
  const scene = /\b(boxing gym|gym (interior|hall|floor|entrance|room)|interior|entrance|members|people|crowd)\b/i;
  const positive = (p: string) => p.replace(/\b(no|without)\s+[a-z\s-]+/gi, ""); // "no people" 같은 부정 표현 제외
  if (o.images.some((i: any) => scene.test(positive(i.prompt)))) {
    issues.push("이미지 프롬프트에 체육관 현장·사람 묘사 포함 — 장비·사물 중심으로 변경");
  }
  if (bodyLen < 1000) issues.push(`본문이 짧음(공백 제외 ${bodyLen}자) — 독자가 실제로 궁금해할 내용을 보강`);
  if (o.description.length > 90) issues.push(`메타 설명이 너무 김(${o.description.length}자)`);
  if (!o.images.some((i: any) => i.role === "cover")) issues.push("대표 이미지(cover) 없음");
  // '복싱' 같은 일반 단어가 아니라 키워드 구문 전체의 반복을 센다
  const phrase = keyword.trim();
  if (phrase.includes(" ")) {
    const count = text.split(phrase).length - 1;
    if (count > 6) issues.push(`키워드 "${phrase}" 반복 과다(${count}회)`);
  }
  return issues;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** 모델 응답 → 초안 구조. 확인된 정보가 없는데 gym_verified 섹션이 오면 본문에서 빼고 확인 사항으로 이동 */
function toGenerated(o: any, facts: string, slugBase: string): Omit<GeneratedPost, "usage"> {
  const checks: AdminCheck[] = (o.admin_checks as string[])
    .filter((t) => t.trim())
    .map((text, i) => ({ id: `c${i + 1}`, text: text.trim(), status: "open" as const }));

  let sections = o.sections as DraftBody["sections"];
  if (!facts.trim()) {
    const gym = sections.filter((s) => s.basis === "gym_verified");
    for (const s of gym) {
      checks.push({ id: `c${checks.length + 1}`, text: `확인된 운영 정보 없이 작성된 단락이라 본문에서 뺐습니다: "${s.heading}"`, status: "open" });
    }
    sections = sections.filter((s) => s.basis !== "gym_verified");
  }

  const seen = new Set<ImageRole>();
  const images: DraftImage[] = [];
  for (const im of o.images as any[]) {
    if (seen.has(im.role)) continue;
    seen.add(im.role);
    const after = im.role === "cover" ? -1 : Math.min(Math.max(0, im.after_section), sections.length - 1);
    const sensitive = !!im.accuracy_sensitive || ACCURACY_RX.test(`${im.prompt} ${im.alt}`);
    const hint = slugify(im.filename_hint || im.role) || im.role;
    images.push({
      role: im.role,
      kind: "illustration",
      filename: `${slugBase}-${im.role === "cover" ? "cover" : hint}.${im.role === "cover" ? "jpg" : "webp"}`,
      alt: im.alt.trim(),
      caption: im.caption.trim(),
      prompt: im.prompt.trim(),
      afterSection: after,
      needsCoachReview: sensitive,
      coachApproved: false,
      status: "pending",
      url: null,
    });
  }
  // 본문 이미지는 최대 2장
  const body = images.filter((i) => i.role !== "cover").slice(0, 2);
  const cover = images.filter((i) => i.role === "cover");

  return {
    title: o.title.trim(),
    slug: slugify(o.slug) || slugBase,
    description: o.description.trim().slice(0, 120),
    body: {
      summary: o.summary.trim(),
      sections,
      faq: o.faq,
      cta: { text: o.cta.text.trim(), linkLabel: o.cta.link_label.trim(), href: o.cta.href },
    },
    relatedSlugs: o.related_slugs,
    images: [...cover, ...body],
    checks,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * 글 생성. API 오류·JSON 오류는 최대 3회 재시도, 문체 검사 실패는 1회 수정 요청.
 * 끝까지 남은 문체 문제는 관리자 확인 사항으로 넘긴다.
 */
export async function generatePost(
  args: { topic: Topic; facts: string; similar: { title: string }[]; related: RelatedCandidate[] },
  log: (level: "info" | "warn", msg: string) => Promise<void>
): Promise<GeneratedPost & { attempts: number }> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY 가 서버 환경변수에 없습니다.");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = textModel();

  let feedback: string | undefined;
  let lastErr: unknown;
  const usage = { input_tokens: 0, output_tokens: 0 };
  let lintRetried = false;

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await log("info", `글 생성 요청 (${model}, ${attempt}번째 시도)`);
      const res = await client.responses.create({
        model,
        input: buildPrompt({ ...args, feedback }),
        text: { format: { type: "json_schema", name: "boxing_post", schema: SCHEMA as any, strict: true } },
      });
      usage.input_tokens += res.usage?.input_tokens ?? 0;
      usage.output_tokens += res.usage?.output_tokens ?? 0;

      const o = JSON.parse(res.output_text);
      const issues = lintPost(o, args.topic.keyword, args.facts);
      if (issues.length && !lintRetried) {
        lintRetried = true;
        feedback = `다음 문제를 고쳐서 다시 작성: ${issues.join(", ")}`;
        await log("warn", `문체 검사 미통과 → 수정 요청: ${issues.join(", ")}`);
        continue;
      }

      const g = toGenerated(o, args.facts, slugify(o.slug) || `boxing-guide-${args.topic.id}`);
      for (const issue of issues) {
        g.checks.push({ id: `c${g.checks.length + 1}`, text: `문체 확인: ${issue}`, status: "open" });
      }
      return { ...g, usage, attempts: attempt };
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      await log("warn", `생성 실패: ${msg}`);
      if (attempt < 4) await sleep(2000 * attempt);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
