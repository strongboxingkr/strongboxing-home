import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM reply_templates
    ORDER BY is_pinned DESC, id DESC
  `);

  return Response.json({
    ok: true,
    replies: rows,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  await db.query(
    `
    INSERT INTO reply_templates
    (
    category,
    branch_name,
    title,
    content,
    is_pinned
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
    body.category,
    body.branch_name,
    body.title,
    body.content,
    body.is_pinned || 0,
    ]
  );

  return Response.json({ ok: true });
}

export async function PUT(request: Request) {
  const body = await request.json();

  await db.query(
    `
    UPDATE reply_templates
    SET
    category = ?,
    branch_name = ?,
    title = ?,
    content = ?,
    is_pinned = ?
    WHERE id = ?
    `,
    [
    body.category,
    body.branch_name,
    body.title,
    body.content,
    body.is_pinned || 0,
    body.id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();

  await db.query(
    `
    DELETE FROM reply_templates
    WHERE id = ?
    `,
    [body.id]
  );

  return Response.json({ ok: true });
}