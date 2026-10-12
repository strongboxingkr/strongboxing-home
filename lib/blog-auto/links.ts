import { db } from "@/lib/db";
import { postSimilarity } from "./similarity";
import { extractHrefs } from "./render";
import type { LinkReportItem, RelatedLink } from "./types";

// app/ 아래 실제 존재하는 공개 라우트
export const STATIC_ROUTES = ["/", "/blog", "/reservation", "/about", "/links", "/tools/boxing-calorie"];
export const BRANCH_SLUGS = ["cheolsan", "gaebong", "mokdong", "sinjeong", "yeongdeungpo"];

/** 본문 링크가 실제로 열리는지 확인: 블로그 글은 DB에서 발행 여부, 나머지는 라우트 존재 여부 */
export async function validateLinks(html: string, ownSlug?: string): Promise<LinkReportItem[]> {
  const report: LinkReportItem[] = [];
  for (const raw of extractHrefs(html)) {
    const href = raw.split("#")[0].split("?")[0] || raw;
    if (/^https?:\/\//i.test(href)) {
      report.push({ href: raw, ok: true, reason: "외부 링크 — 자동 확인 안 함" });
      continue;
    }
    if (href.startsWith("/blog/")) {
      const slug = decodeURIComponent(href.slice("/blog/".length).replace(/\/$/, ""));
      if (ownSlug && slug === ownSlug) {
        report.push({ href: raw, ok: false, reason: "자기 자신을 가리키는 링크" });
        continue;
      }
      const [rows]: any = await db.query(`SELECT id FROM homepage_posts WHERE slug = ? LIMIT 1`, [slug]);
      report.push(rows.length ? { href: raw, ok: true } : { href: raw, ok: false, reason: "발행된 글이 없음" });
      continue;
    }
    if (href.startsWith("/branches/")) {
      const slug = href.slice("/branches/".length).replace(/\/$/, "");
      report.push(
        BRANCH_SLUGS.includes(slug) ? { href: raw, ok: true } : { href: raw, ok: false, reason: "없는 지점 페이지" }
      );
      continue;
    }
    if (STATIC_ROUTES.includes(href.replace(/(.)\/$/, "$1"))) {
      report.push({ href: raw, ok: true });
      continue;
    }
    report.push({ href: raw, ok: false, reason: "사이트에 없는 경로" });
  }
  return report;
}

export type RelatedCandidate = { slug: string; title: string; score: number };

/** 관련 글 후보: 발행된 글 중 주제와 가까운 글. 지역 홍보 글보다 정보 글을 우선 */
export async function relatedCandidates(topicTitle: string, keyword: string, excludeSlug?: string): Promise<RelatedCandidate[]> {
  const [rows]: any = await db.query(
    `SELECT slug, title, description, category FROM homepage_posts ORDER BY created_at DESC LIMIT 300`
  );
  const q = `${topicTitle} ${keyword}`;
  return rows
    .filter((r: any) => r.slug !== excludeSlug)
    .map((r: any) => ({
      slug: r.slug,
      title: r.title,
      score: postSimilarity(q, r.title, r.description) + (r.category === "복싱정보" ? 0.1 : 0),
    }))
    .filter((r: RelatedCandidate) => r.score >= 0.12 && r.score < 0.6) // 0.6 이상은 사실상 같은 글
    .sort((a: RelatedCandidate, b: RelatedCandidate) => b.score - a.score)
    .slice(0, 8);
}

export function toRelatedLinks(cands: RelatedCandidate[], picks: string[], max = 3): RelatedLink[] {
  const bySlug = new Map(cands.map((c) => [c.slug, c]));
  const chosen = picks.map((s) => bySlug.get(s)).filter(Boolean) as RelatedCandidate[];
  const list = chosen.length ? chosen : cands;
  return list.slice(0, max).map((c) => ({ title: c.title, href: `/blog/${c.slug}` }));
}
