import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT * FROM hq_branches
      WHERE deleted_at IS NULL
      ORDER BY id ASC
    `);
    return Response.json({ ok: true, items: rows });
  } catch (e: any) {
    console.error("[GET /api/hq/branches]", e);
    return Response.json({ ok: false, error: e?.message ?? "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [result]: any = await db.query(
      `INSERT INTO hq_branches
        (name, slug, phone, address, instagram, kakao_map_url, naver_reservation_url, business_hours, memo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.slug,
        body.phone ?? null,
        body.address ?? null,
        body.instagram ?? null,
        body.kakao_map_url ?? null,
        body.naver_reservation_url ?? null,
        body.business_hours ? JSON.stringify(body.business_hours) : null,
        body.memo ?? null,
      ]
    );
    return Response.json({ ok: true, id: result.insertId });
  } catch (e: any) {
    console.error("[POST /api/hq/branches]", e);
    return Response.json({ ok: false, error: e?.message ?? "DB error" }, { status: 500 });
  }
}
