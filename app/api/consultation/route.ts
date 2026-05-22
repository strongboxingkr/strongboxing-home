import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, phone, branch, goal, message } = await request.json();

    if (!name || !phone || !branch) {
      return Response.json(
        { ok: false, message: "이름, 전화번호, 지점은 필수입니다." },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO consultation_requests
      (name, phone, branch, goal, message)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, phone, branch, goal || "", message || ""]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error("상담예약 오류:", error);

    return Response.json(
      { ok: false, message: "상담예약 저장 실패" },
      { status: 500 }
    );
  }
}