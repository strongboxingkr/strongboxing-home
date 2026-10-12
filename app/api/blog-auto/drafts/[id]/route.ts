import { db } from "@/lib/db";
import { bad, handle } from "@/lib/blog-auto/api";
import { validateLinks } from "@/lib/blog-auto/links";
import { checkReadiness } from "@/lib/blog-auto/publish";
import { getDraft, updateDraft } from "@/lib/blog-auto/repo";
import { stripPending } from "@/lib/blog-auto/render";
import type { AdminCheck } from "@/lib/blog-auto/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const d = await getDraft(Number(id));
    if (!d) return bad("초안을 찾을 수 없습니다.", 404);
    return Response.json({ ok: true, draft: d, readiness: await checkReadiness(d) });
  });
}

/** 관리자 수정: 제목·slug·설명·본문 HTML·확인 사항 */
export async function PUT(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const d = await getDraft(Number(id));
    if (!d) return bad("초안을 찾을 수 없습니다.", 404);
    if (d.status === "published") return bad("발행된 글은 기존 블로그 관리(/admin)에서 수정해 주세요.");

    const body = await req.json();
    const patch: Parameters<typeof updateDraft>[1] = {};
    if (typeof body.title === "string") patch.title = body.title.trim();
    if (typeof body.description === "string") patch.description = body.description.trim();
    if (typeof body.slug === "string") {
      const slug = body.slug.trim().toLowerCase();
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return bad("slug는 영어 소문자·숫자·하이픈만 가능합니다.");
      const [dup]: any = await db.query(
        `SELECT id FROM blog_auto_drafts WHERE slug = ? AND id <> ? UNION SELECT id FROM homepage_posts WHERE slug = ?`,
        [slug, d.id, slug]
      );
      if (dup.length) return bad("이미 사용 중인 slug입니다.");
      patch.slug = slug;
    }
    if (typeof body.content_html === "string") patch.content_html = body.content_html;
    if (Array.isArray(body.checks)) {
      patch.checks = (body.checks as AdminCheck[]).map((c, i) => ({
        id: String(c.id || `c${i + 1}`),
        text: String(c.text || ""),
        status: ["open", "confirmed", "dismissed"].includes(c.status) ? c.status : "open",
        note: c.note ? String(c.note) : undefined,
      }));
    }
    const html = patch.content_html ?? d.content_html;
    patch.link_report = await validateLinks(stripPending(html), patch.slug ?? d.slug);

    await updateDraft(d.id, patch);
    const next = (await getDraft(d.id))!;
    return Response.json({ ok: true, draft: next, readiness: await checkReadiness(next) });
  });
}

/** 폐기: 초안은 남겨 두고(기록) 주제는 보류로 → 자동 실행이 다시 고르지 않음 */
export async function DELETE(_req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const d = await getDraft(Number(id));
    if (!d) return bad("초안을 찾을 수 없습니다.", 404);
    if (d.status === "published") return bad("발행된 초안은 폐기할 수 없습니다.");
    await db.query(`UPDATE blog_auto_drafts SET status = 'discarded' WHERE id = ?`, [d.id]);
    await db.query(`UPDATE blog_topics SET status = '보류', memo = '[관리자] 초안 폐기' WHERE id = ?`, [d.topic_id]);
    return Response.json({ ok: true });
  });
}
