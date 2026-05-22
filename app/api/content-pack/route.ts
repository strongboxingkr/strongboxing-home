import OpenAI from "openai";
import { mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { db } from "@/lib/db";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function escapeSvgText(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const branch = String(formData.get("branch") || "스트롱복싱");
  const title = String(formData.get("title") || "복싱 체험");
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return Response.json(
      { ok: false, message: "이미지 없음" },
      { status: 400 }
    );
  }

  const folderName = `${Date.now()}-${branch}-${title}`.replace(
    /[^\w가-힣-]/g,
    "-"
  );

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "content-pack",
    folderName
  );

  await mkdir(uploadDir, { recursive: true });

  const results = [];
  const safeBranch = escapeSvgText(branch);
  const safeTitle = escapeSvgText(title || "STRONG BOXING");

  for (let i = 0; i < files.length; i++) {
    const buffer = Buffer.from(await files[i].arrayBuffer());
    const n = String(i + 1).padStart(2, "0");

    const feedSvg = `
      <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1080" height="1080" fill="rgba(0,0,0,0.22)" />
        <text x="60" y="90" font-size="38" font-weight="900" fill="#ffffff">
          STRONG BOXING
        </text>
        <rect x="60" y="950" rx="36" ry="36" width="455" height="78" fill="#FC5230" />
        <text x="92" y="1002" font-size="34" font-weight="900" fill="#ffffff">
          1 DAY PASS · 10,000원
        </text>
      </svg>
    `;

    await sharp(buffer)
      .resize(1080, 1080, { fit: "cover", position: "center" })
      .composite([{ input: Buffer.from(feedSvg), top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, `feed-${n}.jpg`));

    const reelsSvg = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1080" height="1920" fill="rgba(0,0,0,0.42)" />

        <text x="80" y="110" font-size="42" font-weight="900" fill="#ffffff">
          STRONG BOXING
        </text>

        <text x="80" y="1210" font-size="56" font-weight="800" fill="#FC5230">
          ${safeBranch}
        </text>

        <text x="80" y="1320" font-size="82" font-weight="900" fill="#ffffff">
          ${safeTitle}
        </text>

        <rect x="80" y="1400" rx="45" ry="45" width="610" height="96" fill="#FC5230" />

        <text x="120" y="1463" font-size="42" font-weight="900" fill="#ffffff">
          1 DAY PASS · 10,000원
        </text>
      </svg>
    `;

    await sharp(buffer)
      .resize(1080, 1920, { fit: "cover", position: "center" })
      .composite([{ input: Buffer.from(reelsSvg), top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, `reels-${n}.jpg`));

    const blogSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1200" height="630" fill="rgba(0,0,0,0.35)" />
        <text x="70" y="95" font-size="38" font-weight="900" fill="#ffffff">
          STRONG BOXING
        </text>
        <text x="70" y="500" font-size="60" font-weight="900" fill="#ffffff">
          ${safeBranch}
        </text>
        <text x="70" y="565" font-size="36" font-weight="800" fill="#FC5230">
          ${safeTitle}
        </text>
      </svg>
    `;

    await sharp(buffer)
      .resize(1200, 630, { fit: "cover", position: "center" })
      .composite([{ input: Buffer.from(blogSvg), top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toFile(path.join(uploadDir, `blog-${n}.jpg`));

    results.push({
      feed: `/content-pack/${folderName}/feed-${n}.jpg`,
      reels: `/content-pack/${folderName}/reels-${n}.jpg`,
      blog: `/content-pack/${folderName}/blog-${n}.jpg`,
    });
  }

  const ai = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
너는 스트롱복싱 콘텐츠 마케터야.

지점: ${branch}
콘텐츠 주제: ${title}

아래 JSON 형식으로만 답해.

{
  "instagram": "인스타 캡션",
  "blog": "네이버 블로그 초안",
  "reels": ["릴스 자막1", "릴스 자막2"]
}

조건:
- 친근한 체육관 말투
- 너무 광고 같지 않게
- 초보자도 부담 없게
- 1일 체험권 10,000원 자연스럽게 언급
- ${branch} 중심으로 작성
`,
  });

  let captions;

  try {
    captions = JSON.parse(ai.output_text);
  } catch {
    captions = {
      instagram: ai.output_text,
      blog: "",
      reels: [],
    };
  }

  await db.query(
    `
    INSERT INTO content_packs (
      branch,
      title,
      results,
      captions
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      branch,
      title,
      JSON.stringify(results),
      JSON.stringify(captions),
    ]
  );

  return Response.json({
    ok: true,
    results,
    captions,
  });
}