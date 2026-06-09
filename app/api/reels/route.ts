import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT *
      FROM homepage_reels
      WHERE is_active = 1
      ORDER BY sort_order ASC, id DESC
    `);

    return Response.json({
      ok: true,
      reels: rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, reels: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { branch_name, title, video_url } = await req.json();

    await db.query(
      `
      INSERT INTO homepage_reels
      (
        branch_name,
        title,
        video_url
      )
      VALUES (?, ?, ?)
      `,
      [branch_name, title, video_url]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false },
      { status: 500 }
    );
  }
}