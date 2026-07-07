import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ ok: false }, { status: 400 });

    await db.query(
      `UPDATE homepage_posts SET views = views + 1 WHERE id = ?`,
      [id]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
