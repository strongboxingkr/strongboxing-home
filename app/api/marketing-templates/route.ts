import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM marketing_templates
    ORDER BY id DESC
  `);

  return Response.json({
    ok: true,
    items: rows,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.query(
    `
    INSERT INTO marketing_templates
    (
      category,
      branch_name,
      title,
      content,
      memo
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      body.category,
      body.branch_name,
      body.title,
      body.content,
      body.memo,
    ]
  );

  return Response.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();

  await db.query(
    `
    UPDATE marketing_templates
    SET
      category = ?,
      branch_name = ?,
      title = ?,
      content = ?,
      memo = ?
    WHERE id = ?
    `,
    [
      body.category,
      body.branch_name,
      body.title,
      body.content,
      body.memo,
      body.id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.query(
    `
    DELETE FROM marketing_templates
    WHERE id = ?
    `,
    [id]
  );

  return Response.json({ ok: true });
}