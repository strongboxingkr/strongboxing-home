import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      name,
      phone,
      branch,
      reservation_date,
      reservation_time,
      goal,
      message,
    } = await req.json();

    if (!name || !phone || !branch || !reservation_date || !reservation_time) {
      return Response.json({
        ok: false,
        message: "필수 항목을 입력해주세요.",
      });
    }

    await db.query(
      `
      INSERT INTO consultations (
        name,
        phone,
        branch,
        reservation_date,
        reservation_time,
        goal,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        phone,
        branch,
        reservation_date,
        reservation_time,
        goal || "",
        message || "",
      ]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json({
      ok: false,
      message: "예약 접수 중 오류가 발생했습니다.",
    });
  }
}