import { db } from "@/lib/db";
import { validateLinks } from "./links";
import { hasFigure, isPublishable, plainText, stripPending } from "./render";
import { rowToDraft } from "./repo";
import type { Draft } from "./types";

export const PUBLISH_CATEGORY = "복싱정보";
export const PUBLISH_BRANCH = "전체";

export type Readiness = { blockers: string[]; warnings: string[] };

/** 발행 가능 여부. blockers 가 있으면 발행 불가 */
export async function checkReadiness(d: Draft): Promise<Readiness> {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!d.title.trim()) blockers.push("제목이 비어 있습니다.");
  if (!d.description.trim()) blockers.push("메타 설명이 비어 있습니다.");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) blockers.push("URL(slug)은 영어 소문자·숫자·하이픈만 쓸 수 있습니다.");
  if (plainText(stripPending(d.content_html)).length < 300) blockers.push("본문이 너무 짧습니다.");

  const open = d.checks.filter((c) => c.status === "open");
  if (open.length) blockers.push(`관리자 확인 사항 ${open.length}개가 남아 있습니다.`);

  const links = await validateLinks(stripPending(d.content_html), d.slug);
  for (const l of links.filter((x) => !x.ok)) blockers.push(`링크 오류: ${l.href} (${l.reason})`);

  if (d.status !== "published") {
    const [taken]: any = await db.query(`SELECT id FROM homepage_posts WHERE slug = ? LIMIT 1`, [d.slug]);
    if (taken.length) blockers.push(`이미 같은 URL의 글이 있습니다: /blog/${d.slug}`);
  }

  for (const img of d.images) {
    if (!hasFigure(d.content_html, img.role)) continue;
    if (!isPublishable(img)) {
      const why = img.needsCoachReview && img.status === "ready" ? "코치 검수 전" : img.status === "failed" ? "생성 실패" : "준비 전";
      warnings.push(`이미지 ${img.role}(${img.filename})는 ${why}이라 발행 본문에서 빠집니다.`);
    }
  }
  const cover = d.images.find((i) => i.role === "cover");
  if (!cover || !isPublishable(cover)) warnings.push("대표 이미지가 없어 공유 이미지는 기본 이미지(og.png)로 표시됩니다.");
  if (d.description.length > 80) warnings.push(`메타 설명이 ${d.description.length}자입니다. 80자 이내를 권장합니다.`);
  if (d.title.length > 55) warnings.push(`제목이 ${d.title.length}자입니다. 검색 결과에서 잘릴 수 있습니다.`);

  return { blockers, warnings };
}

/** 초안 → homepage_posts INSERT. 같은 초안을 두 번 발행해도 글은 1개만 생긴다 */
export async function publishDraft(id: number): Promise<{ ok: true; slug: string; postId: number } | { ok: false; message: string; blockers?: string[] }> {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows]: any = await conn.query(`SELECT * FROM blog_auto_drafts WHERE id = ? FOR UPDATE`, [id]);
    if (!rows[0]) {
      await conn.rollback();
      return { ok: false, message: "초안을 찾을 수 없습니다." };
    }
    const d = rowToDraft(rows[0]);
    if (d.status === "published" && d.published_post_id) {
      await conn.rollback();
      return { ok: true, slug: d.slug, postId: d.published_post_id };
    }
    if (d.status === "discarded") {
      await conn.rollback();
      return { ok: false, message: "폐기된 초안입니다." };
    }

    const { blockers } = await checkReadiness(d);
    if (blockers.length) {
      await conn.rollback();
      return { ok: false, message: "발행 전에 해결할 항목이 있습니다.", blockers };
    }

    const cover = d.images.find((i) => i.role === "cover");
    const thumbnail = cover && isPublishable(cover) ? cover.url : null;

    const [res]: any = await conn.query(
      `INSERT INTO homepage_posts (title, slug, description, content, branch_name, category, thumbnail)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [d.title.trim(), d.slug, d.description.trim(), stripPending(d.content_html).trim(), PUBLISH_BRANCH, PUBLISH_CATEGORY, thumbnail]
    );
    await conn.query(`UPDATE blog_auto_drafts SET status = 'published', published_post_id = ? WHERE id = ?`, [res.insertId, id]);
    await conn.query(`UPDATE blog_topics SET status = '발행' WHERE id = ?`, [d.topic_id]);
    await conn.commit();
    return { ok: true, slug: d.slug, postId: res.insertId };
  } catch (e) {
    await conn.rollback().catch(() => {});
    throw e;
  } finally {
    conn.release();
  }
}
