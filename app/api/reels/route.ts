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
    const { branch_name, title, aria_label, video_url, is_muted } = await req.json();

    await db.query(
      `
      INSERT INTO homepage_reels
        (branch_name, title, aria_label, video_url, is_muted)
      VALUES (?, ?, ?, ?, ?)
      `,
      [branch_name, title, aria_label || "", video_url, is_muted || 0]
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

export async function PUT(req: Request) {
  const { id, branch_name, title, aria_label, video_url, is_muted } = await req.json();

  await db.query(
    `
    UPDATE homepage_reels
    SET
      branch_name = ?,
      title = ?,
      aria_label = ?,
      video_url = ?,
      is_muted = ?
    WHERE id = ?
    `,
    [branch_name, title, aria_label || "", video_url, is_muted || 0, id]
  );

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.query(
    `
    DELETE FROM homepage_reels
    WHERE id = ?
    `,
    [id]
  );

  return Response.json({
    ok: true,
  });
}