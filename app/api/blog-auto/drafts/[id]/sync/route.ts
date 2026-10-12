import { db } from "@/lib/db";
import { bad, handle } from "@/lib/blog-auto/api";
import { getDraft } from "@/lib/blog-auto/repo";
import { stripPending } from "@/lib/blog-auto/render";

export const runtime = "nodejs";

/** 초안 내용을 발행된 homepage_posts에 강제 동기화 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const d = await getDraft(Number(id));
    if (!d) return bad("초안을 찾을 수 없습니다.", 404);
    if (d.status !== "published" || !d.published_post_id) return bad("발행된 글이 아닙니다.");

    const content = stripPending(d.content_html).trim();
    const cover = d.images.find((i) => i.role === "cover");
    const thumbnail = cover?.url ?? null;

    await db.query(
      `UPDATE homepage_posts SET title = ?, description = ?, content = ?, slug = ?${thumbnail ? ", thumbnail = ?" : ""} WHERE id = ?`,
      thumbnail
        ? [d.title, d.description, content, d.slug, thumbnail, d.published_post_id]
        : [d.title, d.description, content, d.slug, d.published_post_id]
    );

    return Response.json({ ok: true });
  });
}
