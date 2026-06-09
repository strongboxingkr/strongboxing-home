import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT *
      FROM naver_blog_posts
      ORDER BY created_at DESC
    `);

    return Response.json({
      ok: true,
      posts: rows,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        message: "목록 조회 실패",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      title,
      branch_name,
      keyword,
      content,
      hashtags,
      media,
    } = await req.json();

    await db.query(
      `
      INSERT INTO naver_blog_posts
      (
        title,
        branch_name,
        keyword,
        content,
        hashtags,
        media
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        branch_name,
        keyword,
        content,
        hashtags,
        JSON.stringify(media || []),
      ]
    );

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        message: "저장 실패",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const {
      id,
      title,
      branch_name,
      keyword,
      content,
      hashtags,
      media,
    } = await req.json();

    await db.query(
      `
      UPDATE naver_blog_posts
      SET
        title = ?,
        branch_name = ?,
        keyword = ?,
        content = ?,
        hashtags = ?,
        media = ?
      WHERE id = ?
      `,
      [
        title,
        branch_name,
        keyword,
        content,
        hashtags,
        JSON.stringify(media || []),
        id,
      ]
    );

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        message: "수정 실패",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await db.query(
      `
      DELETE FROM naver_blog_posts
      WHERE id = ?
      `,
      [id]
    );

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        message: "삭제 실패",
      },
      { status: 500 }
    );
  }
}