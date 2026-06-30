import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_naver_reviews
    ORDER BY is_active DESC, id DESC
  `);

  return Response.json({
    ok: true,
    reviews: rows,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.query(
    `
    INSERT INTO homepage_naver_reviews
    (
      branch_name,
      reviewer_name,
      rating,
      content,
      image_url,
      review_date,
      is_active,
      sort_order
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      body.branch_name,
      body.reviewer_name,
      body.rating || 5,
      body.content,
      body.image_url || "",
      body.review_date || "",
      body.is_active ? 1 : 0,
      body.sort_order || 0,
    ]
  );

  return Response.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();

  await db.query(
    `
    UPDATE homepage_naver_reviews
    SET
      branch_name = ?,
      reviewer_name = ?,
      rating = ?,
      content = ?,
      image_url = ?,
      review_date = ?,
      is_active = ?,
      sort_order = ?
    WHERE id = ?
    `,
    [
      body.branch_name,
      body.reviewer_name,
      body.rating || 5,
      body.content,
      body.image_url || "",
      body.review_date || "",
      body.is_active ? 1 : 0,
      body.sort_order || 0,
      body.id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.query(
    `
    DELETE FROM homepage_naver_reviews
    WHERE id = ?
    `,
    [id]
  );

  return Response.json({ ok: true });
}