import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT id, title, slug, description, thumbnail, content, branch_name, popup_start, popup_end
      FROM homepage_posts
      WHERE popup_start IS NOT NULL
        AND popup_end IS NOT NULL
        AND CURDATE() BETWEEN popup_start AND popup_end
      ORDER BY popup_start DESC
      LIMIT 5
    `);

    return Response.json({ ok: true, popups: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, popups: [] }, { status: 500 });
  }
}
