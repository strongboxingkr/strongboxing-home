import { db } from "@/lib/db";
import { handle } from "@/lib/blog-auto/api";

export const runtime = "nodejs";

/** 실행 기록. ?id= 로 1건(진행 상황 폴링용) */
export async function GET(req: Request) {
  return handle(async () => {
    const id = new URL(req.url).searchParams.get("id");
    const [rows]: any = id
      ? await db.query(`SELECT * FROM blog_auto_runs WHERE id = ?`, [Number(id)])
      : await db.query(
          `SELECT r.*, t.title AS topic_title FROM blog_auto_runs r
           LEFT JOIN blog_topics t ON t.id = r.topic_id
           ORDER BY r.id DESC LIMIT 30`
        );
    const runs = rows.map((r: any) => ({
      ...r,
      log: r.log_json ? JSON.parse(r.log_json) : [],
      usage: r.usage_json ? JSON.parse(r.usage_json) : null,
      log_json: undefined,
      usage_json: undefined,
    }));
    return Response.json({ ok: true, runs });
  });
}
