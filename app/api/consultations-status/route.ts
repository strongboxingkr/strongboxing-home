import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    await db.query(
      `
      UPDATE consultations
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
      },
      { status: 500 }
    );
  }
}