import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, slug, description, content, branch_name } = body;

    if (!title || !slug || !content) {
      return Response.json(
        { ok: false, message: "제목, slug, 본문은 필수입니다." },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO homepage_posts
      (title, slug, description, content, branch_name)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, slug, description, content, branch_name]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, message: "저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}