import { db } from "@/lib/db";

export async function GET() {
  if (!process.env.DB_HOST) return Response.json({ ok: true, popups: [] });

  try {
    const [rows]: any = await db.query(`
      SELECT id, title, slug, description, thumbnail, branch_name, category, popup_start, popup_end
      FROM homepage_posts
      WHERE popup_start IS NOT NULL
        AND popup_end IS NOT NULL
        AND category IN ('공지', '이벤트')
        AND DATE(UTC_TIMESTAMP() + INTERVAL 9 HOUR) BETWEEN popup_start AND popup_end
      ORDER BY popup_start DESC, id DESC
      LIMIT 5
    `);

    return Response.json({ ok: true, popups: rows });
  } catch (error) {
    // Older databases have no popup fields.
    if ((error as { code?: string }).code === "ER_BAD_FIELD_ERROR") {
      return Response.json({ ok: true, popups: [] });
    }
    console.error(error);
    return Response.json({ ok: false, popups: [] }, { status: 500 });
  }
}
