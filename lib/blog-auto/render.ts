// 초안 → 블로그 본문 HTML
// 기존 블로그(MarkdownContent)는 '<'로 시작하는 본문을 HTML로 렌더링하고, 관리자 에디터(RichTextEditor)도
// HTML을 다루므로 발행 본문은 HTML로 만든다. 이미지 자리는 <figure data-image-role> 로 표시해 나중에 교체한다.

import type { DraftBody, DraftImage, RelatedLink } from "./types";

export function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 텍스트 이스케이프 + **굵게** 만 허용 */
function inline(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function illustrationCaption(img: DraftImage): string {
  const c = img.caption.trim();
  if (img.kind !== "illustration") return c;
  return c.startsWith("일러스트") ? c : `일러스트${c ? ` · ${c}` : ""}`;
}

/** 게시 가능한 이미지인지: 준비 완료 + (코치 검수 불필요 또는 검수 완료) */
export function isPublishable(img: DraftImage): boolean {
  return img.status === "ready" && !!img.url && (!img.needsCoachReview || img.coachApproved);
}

export function renderFigure(img: DraftImage): string {
  const role = esc(img.role);
  if (isPublishable(img)) {
    const size = img.width && img.height ? ` width="${img.width}" height="${img.height}"` : "";
    const loading = img.role === "cover" ? "" : ` loading="lazy"`;
    const cap = illustrationCaption(img);
    return (
      `<figure data-image-role="${role}" data-image-kind="${esc(img.kind)}" style="margin:28px 0">` +
      `<img src="${esc(img.url!)}" alt="${esc(img.alt)}"${size}${loading} decoding="async" />` +
      (cap ? `<figcaption style="margin-top:8px;font-size:13px;color:#8A8D91;text-align:center">${esc(cap)}</figcaption>` : "") +
      `</figure>`
    );
  }

  // 미리보기 전용 자리표시 — 발행 시 stripPending() 으로 제거됨
  const reason =
    img.status === "ready" && img.needsCoachReview && !img.coachApproved
      ? "코치 검수 전 — 발행 시 제외"
      : img.status === "failed"
        ? `생성 실패 — 발행 시 제외${img.error ? ` (${img.error})` : ""}`
        : "이미지 준비 전 — 발행 시 제외";
  const preview = img.url
    ? `<img src="${esc(img.url)}" alt="${esc(img.alt)}" style="opacity:.55;margin:12px 0 0" />`
    : "";
  return (
    `<figure data-image-role="${role}" data-pending="1" style="margin:28px 0;padding:18px 20px;border:1px dashed rgba(252,82,48,.6);border-radius:16px;background:rgba(252,82,48,.06)">` +
    `<p style="margin:0;font-size:13px;font-weight:800;color:#FC5230">[이미지 자리 · ${esc(img.role)}] ${esc(reason)}</p>` +
    `<p style="margin:6px 0 0;font-size:13px;color:#C8CACD">파일명: ${esc(img.filename)} / 대체 텍스트: ${esc(img.alt)}</p>` +
    (img.caption ? `<p style="margin:4px 0 0;font-size:13px;color:#C8CACD">캡션: ${esc(illustrationCaption(img))}</p>` : "") +
    (img.prompt ? `<p style="margin:4px 0 0;font-size:12px;color:#8A8D91">생성 프롬프트: ${esc(img.prompt)}</p>` : "") +
    preview +
    `</figure>`
  );
}

export function renderContent(body: DraftBody, images: DraftImage[], related: RelatedLink[]): string {
  const out: string[] = [];
  const figuresAfter = (n: number) =>
    images.filter((i) => i.afterSection === n).map(renderFigure).join("");

  out.push(
    `<div data-block="summary" style="margin:0 0 28px;padding:18px 22px;border-left:3px solid #D01E2E;border-radius:12px;background:#141416">` +
      `<p style="margin:0;font-weight:500;line-height:1.8;color:#F5F4F1">${inline(body.summary)}</p></div>`
  );
  out.push(figuresAfter(-1));

  body.sections.forEach((s, i) => {
    out.push(`<h2 data-basis="${s.basis}">${inline(s.heading)}</h2>`);
    // 첫 문단 = 목록 도입, 나머지 문단은 목록 뒤
    const [lead, ...rest] = s.paragraphs.filter((p) => p.trim());
    if (lead) out.push(`<p>${inline(lead)}</p>`);
    if (s.bullets.length) out.push(`<ul>${s.bullets.map((b) => `<li>${inline(b)}</li>`).join("")}</ul>`);
    for (const p of rest) out.push(`<p>${inline(p)}</p>`);
    out.push(figuresAfter(i));
  });

  if (body.faq.length) {
    out.push(`<h2>자주 묻는 질문</h2>`);
    out.push(
      `<div data-faq="1">${body.faq.map((f) => `<h3>${inline(f.q)}</h3><p>${inline(f.a)}</p>`).join("")}</div>`
    );
  }

  if (related.length) {
    out.push(`<h2>함께 읽으면 좋은 글</h2>`);
    out.push(
      `<ul data-placement="in_content_related">${related
        .map((r) => `<li><a href="${esc(r.href)}">${esc(r.title)}</a></li>`)
        .join("")}</ul>`
    );
  }

  if (body.cta.text) {
    out.push(
      `<p data-placement="in_content_cta">${inline(body.cta.text)} ` +
        `<a href="${esc(body.cta.href)}" style="color:#D01E2E;font-weight:800">${esc(body.cta.linkLabel)} →</a></p>`
    );
  }

  return out.filter(Boolean).join("\n");
}

const FIGURE_RX = (role: string) =>
  new RegExp(`<figure[^>]*data-image-role="${role}"[^>]*>[\\s\\S]*?</figure>`, "i");

/** 본문의 해당 이미지 자리를 교체. 관리자가 자리를 지웠으면 그대로 둔다(편집 존중) */
export function replaceFigure(html: string, img: DraftImage): string {
  const rx = FIGURE_RX(img.role);
  return rx.test(html) ? html.replace(rx, renderFigure(img)) : html;
}

export function hasFigure(html: string, role: string): boolean {
  return FIGURE_RX(role).test(html);
}

/** 발행용: 미리보기 자리표시 제거 */
export function stripPending(html: string): string {
  return html.replace(/<figure[^>]*data-pending="1"[^>]*>[\s\S]*?<\/figure>/gi, "").replace(/\n{3,}/g, "\n\n");
}

export function extractHrefs(html: string): string[] {
  const set = new Set<string>();
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) set.add(m[1].replace(/&amp;/g, "&"));
  return [...set];
}

export function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}
