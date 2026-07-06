import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT id, title, slug, description, content, branch_name, category, thumbnail, created_at
      FROM homepage_posts
      ORDER BY created_at DESC
    `);

    return Response.json({
      ok: true,
      posts: rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, message: "목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, slug, description, content, branch_name, category, thumbnail } = body;

    if (!title || !slug || !content) {
      return Response.json(
        { ok: false, message: "제목, slug, 본문은 필수입니다." },
        { status: 400 }
      );
    }

    await db.query(
      `
      INSERT INTO homepage_posts
      (title, slug, description, content, branch_name, category, thumbnail)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        slug,
        description,
        content,
        branch_name,
        category || "소식",
        thumbnail || null,
      ]
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, title, slug, description, content, branch_name, category, thumbnail } = body;

    if (!id || !title || !slug || !content) {
      return Response.json(
        { ok: false, message: "id, 제목, slug, 본문은 필수입니다." },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE homepage_posts
      SET title = ?,
          slug = ?,
          description = ?,
          content = ?,
          branch_name = ?,
          category = ?,
          thumbnail = ?
      WHERE id = ?
      `,
      [
        title,
        slug,
        description,
        content,
        branch_name,
        category || "소식",
        thumbnail ?? null,
        id,
      ]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, message: "수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return Response.json(
        { ok: false, message: "id는 필수입니다." },
        { status: 400 }
      );
    }

    await db.query(
      `
      DELETE FROM homepage_posts
      WHERE id = ?
      `,
      [id]
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, message: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}