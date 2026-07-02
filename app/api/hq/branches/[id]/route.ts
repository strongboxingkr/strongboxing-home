import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db.query(
      `UPDATE hq_branches
       SET name = ?, slug = ?, phone = ?, address = ?, instagram = ?,
           kakao_map_url = ?, naver_reservation_url = ?, business_hours = ?, memo = ?
       WHERE id = ? AND deleted_at IS NULL`,
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
        params.id,
      ]
    );
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error("[PUT /api/hq/branches/:id]", e);
    return Response.json({ ok: false, error: e?.message ?? "DB error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.query(
      `UPDATE hq_branches SET deleted_at = NOW(), is_active = 0 WHERE id = ?`,
      [params.id]
    );
    return Response.json({ ok: true });
  } catch (e: any) {
    console.error("[DELETE /api/hq/branches/:id]", e);
    return Response.json({ ok: false, error: e?.message ?? "DB error" }, { status: 500 });
  }
}
