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

    const seoText = `
${pack.branch} 스트롱복싱은 복싱을 처음 시작하는 분들도 부담 없이 운동할 수 있는 복싱 체육관입니다.

${pack.branch} 복싱, ${pack.branch} 복싱장, ${pack.branch} 다이어트 운동을 찾는 분들께 복싱 입문부터 체력 향상, 다이어트 복싱까지 개인 목적에 맞춰 안내해드립니다.

운동이 처음이어도 괜찮습니다. 스트롱복싱에서 기초부터 차근차근 시작해보세요.
`.trim();

const content = `
  ${captions.blog || ""}

  ${imageMarkdown}

  ${seoText}

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