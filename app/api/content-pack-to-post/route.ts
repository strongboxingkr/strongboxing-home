import { db } from "@/lib/db";

function makeSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\w가-힣-]/g, "");
}

export async function POST(request: Request) {
  try {
    const { contentPackId } = await request.json();

    if (!contentPackId) {
      return Response.json(
        { ok: false, message: "contentPackId가 없습니다." },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT *
      FROM content_packs
      WHERE id = ?
      LIMIT 1
      `,
      [contentPackId]
    );

    const pack = rows[0];

    if (!pack) {
      return Response.json(
        { ok: false, message: "콘텐츠팩을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const results = JSON.parse(pack.results || "[]");
    const captions = JSON.parse(pack.captions || "{}");

    const firstImages = results[0];

    const title = `${pack.branch} ${pack.title}`;
    const slug = `${makeSlug(pack.branch)}-${makeSlug(pack.title)}-${pack.id}`;
    const description =
      captions.instagram?.slice(0, 120) ||
      `${pack.branch} 스트롱복싱 소식입니다.`;

    const imageMarkdown = firstImages?.blog
      ? `\n\n![${title}](${firstImages.blog})\n\n`
      : "";

    const content = `
${captions.blog || ""}

${imageMarkdown}

📍 ${pack.branch}
🥊 1일 체험권 10,000원
궁금하신 점은 편하게 문의주세요.
`.trim();

    await db.query(
      `
      INSERT INTO homepage_posts (
        title,
        slug,
        branch_name,
        description,
        content
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, slug, pack.branch, description, content]
    );

    return Response.json({
      ok: true,
      slug,
    });
  } catch (error) {
    console.error("콘텐츠팩 블로그 등록 오류:", error);

    return Response.json(
      { ok: false, message: "블로그 등록 실패" },
      { status: 500 }
    );
  }
}