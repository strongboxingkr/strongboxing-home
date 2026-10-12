import { db } from "@/lib/db";
import { handle } from "@/lib/blog-auto/api";
import { rowToDraft } from "@/lib/blog-auto/repo";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    const [rows]: any = await db.query(
      `SELECT d.*, t.title AS topic_title FROM blog_auto_drafts d
       LEFT JOIN blog_topics t ON t.id = d.topic_id
       ORDER BY FIELD(d.status, 'draft', 'published', 'discarded'), d.updated_at DESC`
    );
    const drafts = rows.map((r: any) => {
      const d = rowToDraft(r);
      return {
        id: d.id,
        topic_id: d.topic_id,
        topic_title: r.topic_title,
        title: d.title,
        slug: d.slug,
        status: d.status,
        published_post_id: d.published_post_id,
        openChecks: d.checks.filter((c) => c.status === "open").length,
        images: d.images.map((i) => ({ role: i.role, status: i.status, needsCoachReview: i.needsCoachReview, coachApproved: i.coachApproved })),
        brokenLinks: d.link_report.filter((l) => !l.ok).length,
        model: d.model,
        updated_at: d.updated_at,
      };
    });
    return Response.json({ ok: true, drafts });
  });
}
