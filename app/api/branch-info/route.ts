import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT * FROM branch_infos
    ORDER BY id DESC
  `);

  return Response.json({ ok: true, items: rows });
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.query(
    `
    INSERT INTO branch_infos
    (
      branch_name, phone, address, instagram_url,
      naver_booking_url, naver_map_url, naver_blog_url,
      kakao_map_url, business_hours, hashtags, memo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      body.branch_name,
      body.phone,
      body.address,
      body.instagram_url,
      body.naver_booking_url,
      body.naver_map_url,
      body.naver_blog_url,
      body.kakao_map_url,
      body.business_hours,
      body.hashtags,
      body.memo,
    ]
  );

  return Response.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();

  await db.query(
    `
    UPDATE branch_infos
    SET branch_name = ?,
        phone = ?,
        address = ?,
        instagram_url = ?,
        naver_booking_url = ?,
        naver_map_url = ?,
        naver_blog_url = ?,
        kakao_map_url = ?,
        business_hours = ?,
        hashtags = ?,
        memo = ?
    WHERE id = ?
    `,
    [
      body.branch_name,
      body.phone,
      body.address,
      body.instagram_url,
      body.naver_booking_url,
      body.naver_map_url,
      body.naver_blog_url,
      body.kakao_map_url,
      body.business_hours,
      body.hashtags,
      body.memo,
      body.id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.query(`DELETE FROM branch_infos WHERE id = ?`, [id]);

  return Response.json({ ok: true });
}