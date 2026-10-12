import { db } from "@/lib/db";
import { bad, handle } from "@/lib/blog-auto/api";
import { DUP_WARN, hasRegion, normalizeTopic, similarity } from "@/lib/blog-auto/similarity";
import { TOPIC_STATUSES } from "@/lib/blog-auto/types";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    const [rows]: any = await db.query(
      `SELECT t.*, d.status AS draft_status, d.slug AS draft_slug
       FROM blog_topics t LEFT JOIN blog_auto_drafts d ON d.topic_id = t.id
       ORDER BY FIELD(t.status, '작성중', '초안', '실패', '미작성', '보류', '발행'), t.priority ASC, t.id ASC`
    );
    return Response.json({ ok: true, topics: rows });
  });
}

/** 주제 추가. 지역명만 바꾼 주제는 거절, 비슷한 주제는 경고 후 force 로 등록 */
export async function POST(req: Request) {
  return handle(async () => {
    const { title, keyword, audience, priority, force } = await req.json();
    const t = String(title || "").trim();
    const k = String(keyword || "").trim();
    if (!t || !k) return bad("제목과 핵심 키워드는 필수입니다.");

    const norm = normalizeTopic(t);
    if (!norm) return bad("지역명을 뺀 주제 내용이 비어 있습니다.");
    if (hasRegion(t)) {
      return bad("주제에 지역명·지점명은 넣지 않습니다. 정보 글은 지역과 무관하게 작성하고, 지점 연결은 글 마지막 안내로 처리합니다.");
    }

    const [existing]: any = await db.query(`SELECT id, title, status FROM blog_topics`);
    const same = existing.find((e: any) => normalizeTopic(e.title) === norm);
    if (same) return bad(`이미 같은 주제가 있습니다: "${same.title}"`, 409);

    const [posts]: any = await db.query(`SELECT id, title FROM homepage_posts ORDER BY created_at DESC LIMIT 500`);
    const similar = [
      ...existing.map((e: any) => ({ source: "topic", title: e.title, score: similarity(t, e.title) })),
      ...posts.map((p: any) => ({ source: "post", title: p.title, score: similarity(t, p.title) })),
    ]
      .filter((s) => s.score >= DUP_WARN)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (similar.length && !force) {
      return Response.json({ ok: false, needConfirm: true, similar, message: "비슷한 주제나 글이 있습니다." }, { status: 409 });
    }

    await db.query(
      `INSERT INTO blog_topics (title, norm_key, keyword, audience, priority) VALUES (?, ?, ?, ?, ?)`,
      [t, norm, k, String(audience || "").trim(), Number(priority) || 100]
    );
    return Response.json({ ok: true });
  });
}

export async function PUT(req: Request) {
  return handle(async () => {
    const { id, title, keyword, audience, priority, status, memo } = await req.json();
    if (!id) return bad("id는 필수입니다.");
    const [rows]: any = await db.query(`SELECT * FROM blog_topics WHERE id = ?`, [id]);
    const cur = rows[0];
    if (!cur) return bad("주제를 찾을 수 없습니다.", 404);

    if (status !== undefined) {
      if (!TOPIC_STATUSES.includes(status)) return bad("알 수 없는 상태입니다.");
      if (["작성중", "발행"].includes(status) || cur.status === "발행" || cur.status === "작성중") {
        return bad("작성중·발행 상태는 자동으로만 바뀝니다.");
      }
    }

    const nextTitle = title !== undefined ? String(title).trim() : cur.title;
    const nextNorm = normalizeTopic(nextTitle);
    if (title !== undefined && nextNorm !== cur.norm_key) {
      const [dup]: any = await db.query(`SELECT id FROM blog_topics WHERE norm_key = ? AND id <> ?`, [nextNorm, id]);
      if (dup.length) return bad("같은 주제가 이미 있습니다.", 409);
    }

    await db.query(
      `UPDATE blog_topics SET title = ?, norm_key = ?, keyword = ?, audience = ?, priority = ?, status = ?, memo = ? WHERE id = ?`,
      [
        nextTitle,
        nextNorm,
        keyword !== undefined ? String(keyword).trim() : cur.keyword,
        audience !== undefined ? String(audience).trim() : cur.audience,
        priority !== undefined ? Number(priority) || 100 : cur.priority,
        status ?? cur.status,
        memo !== undefined ? memo : cur.memo,
        id,
      ]
    );
    return Response.json({ ok: true });
  });
}

/** 초안이 없는 주제만 삭제 */
export async function DELETE(req: Request) {
  return handle(async () => {
    const { id } = await req.json();
    const [d]: any = await db.query(`SELECT id FROM blog_auto_drafts WHERE topic_id = ?`, [id]);
    if (d.length) return bad("초안이 있는 주제는 삭제할 수 없습니다. 보류 상태로 바꿔 주세요.");
    await db.query(`DELETE FROM blog_topics WHERE id = ?`, [id]);
    return Response.json({ ok: true });
  });
}
