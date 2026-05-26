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

function getTemplateStyle(style: string) {
  if (style === "STRONG_CHARCOAL") {
    return {
      primaryColor: "#F15A29",
      overlay: "0.34",
      textColor: "#ffffff",
      labelColor: "#F15A29",
    };
  }

  if (style === "URBAN_PREMIUM") {
    return {
      primaryColor: "#d6c3a5",
      overlay: "0.26",
      textColor: "#ffffff",
      labelColor: "#d6c3a5",
    };
  }

  if (style === "FIGHT_CLUB") {
    return {
      primaryColor: "#ffffff",
      overlay: "0.52",
      textColor: "#ffffff",
      labelColor: "#ffffff",
    };
  }

  if (style === "WOMEN_FIT") {
    return {
      primaryColor: "#ff7a59",
      overlay: "0.22",
      textColor: "#ffffff",
      labelColor: "#ffb39d",
    };
  }

  if (style === "ORANGE") {
    return {
      primaryColor: "#FC5230",
      overlay: "0.36",
      textColor: "#ffffff",
      labelColor: "#FC5230",
    };
  }

  if (style === "PREMIUM") {
    return {
      primaryColor: "#d6c3a5",
      overlay: "0.30",
      textColor: "#ffffff",
      labelColor: "#d6c3a5",
    };
  }

  if (style === "MINIMAL") {
    return {
      primaryColor: "#ffffff",
      overlay: "0.20",
      textColor: "#ffffff",
      labelColor: "#ffffff",
    };
  }

  return {
    primaryColor: "#F15A29",
    overlay: "0.34",
    textColor: "#ffffff",
    labelColor: "#F15A29",
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const branch = String(formData.get("branch") || "스트롱복싱");
  const title = String(formData.get("title") || "복싱 체험");
  const target = String(formData.get("target") || "입문자");
  const tone = String(formData.get("tone") || "감성");
  const style = String(formData.get("style") || "BLACK");

  const files = formData.getAll("files") as File[];
  const limitedFiles = files.slice(0, 2);

  if (!limitedFiles.length) {
    return Response.json(
      {
        ok: false,
        message: "이미지 없음",
      },
      {
        status: 400,
      }
    );
  }

  const { primaryColor, overlay, textColor, labelColor } =
    getTemplateStyle(style);

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
  const safeTarget = escapeSvgText(target);
  const safeTone = escapeSvgText(tone);

  for (let i = 0; i < limitedFiles.length; i++) {
    const buffer = Buffer.from(await limitedFiles[i].arrayBuffer());

    const n = String(i + 1).padStart(2, "0");

    const feedSvg = `
      <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0"
          y="0"
          width="1080"
          height="1080"
          fill="rgba(0,0,0,${overlay})"
        />

        <text
          x="60"
          y="90"
          font-size="38"
          font-weight="900"
          fill="${textColor}"
        >
          STRONG BOXING
        </text>

        <text
          x="60"
          y="850"
          font-size="46"
          font-weight="900"
          fill="${labelColor}"
        >
          ${safeBranch}
        </text>

        <text
          x="60"
          y="910"
          font-size="58"
          font-weight="900"
          fill="${textColor}"
        >
          ${safeTitle}
        </text>

        <rect
          x="60"
          y="955"
          rx="36"
          ry="36"
          width="455"
          height="78"
          fill="${primaryColor}"
        />

        <text
          x="92"
          y="1007"
          font-size="34"
          font-weight="900"
          fill="#ffffff"
        >
          1 DAY PASS · 10,000원
        </text>
      </svg>
    `;

    await sharp(buffer)
      .resize(1080, 1080, {
        fit: "cover",
        position: "center",
      })
      .composite([
        {
          input: Buffer.from(feedSvg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({
        quality: 90,
      })
      .toFile(path.join(uploadDir, `feed-${n}.jpg`));

      let titleFontSize = 82;
      let overlayBlur = overlay;
      let titleY = 1320;

      if (style === "FIGHT_CLUB") {
        titleFontSize = 96;
        titleY = 1380;
      }

      if (style === "URBAN_PREMIUM") {
        titleFontSize = 72;
        titleY = 1280;
      }

      if (style === "WOMEN_FIT") {
        titleFontSize = 68;
        titleY = 1260;
      }

    const reelsSvg = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0"
          y="0"
          width="1080"
          height="1920"
          fill="rgba(0,0,0,${overlay})"
        />

        <text
          x="80"
          y="110"
          font-size="42"
          font-weight="900"
          fill="${textColor}"
        >
          STRONG BOXING
        </text>

        <text
          x="80"
          y="1210"
          font-size="56"
          font-weight="800"
          fill="${labelColor}"
        >
          ${safeBranch}
        </text>

        <text
          x="80"
          y="${titleY}"
          font-size="${titleFontSize}"
          font-weight="900"
          fill="${textColor}"
        >
          ${safeTitle}
        </text>

        <rect
          x="80"
          y="1400"
          rx="45"
          ry="45"
          width="610"
          height="96"
          fill="${primaryColor}"
        />

        <text
          x="120"
          y="1463"
          font-size="42"
          font-weight="900"
          fill="#ffffff"
        >
          1 DAY PASS · 10,000원
        </text>

        <text
          x="80"
          y="1605"
          font-size="34"
          font-weight="800"
          fill="${textColor}"
        >
          ${safeTarget} · ${safeTone}
        </text>
      </svg>
    `;

    await sharp(buffer)
      .resize(1080, 1920, {
        fit: "cover",
        position: "center",
      })
      .composite([
        {
          input: Buffer.from(reelsSvg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({
        quality: 90,
      })
      .toFile(path.join(uploadDir, `reels-${n}.jpg`));

    const blogSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0"
          y="0"
          width="1200"
          height="630"
          fill="rgba(0,0,0,${overlay})"
        />

        <text
          x="70"
          y="95"
          font-size="38"
          font-weight="900"
          fill="${textColor}"
        >
          STRONG BOXING
        </text>

        <text
          x="70"
          y="465"
          font-size="60"
          font-weight="900"
          fill="${textColor}"
        >
          ${safeBranch}
        </text>

        <text
          x="70"
          y="535"
          font-size="42"
          font-weight="900"
          fill="${labelColor}"
        >
          ${safeTitle}
        </text>
      </svg>
    `;

    await sharp(buffer)
      .resize(1200, 630, {
        fit: "cover",
        position: "center",
      })
      .composite([
        {
          input: Buffer.from(blogSvg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({
        quality: 90,
      })
      .toFile(path.join(uploadDir, `blog-${n}.jpg`));

    results.push({
      feed: `/content-pack/${folderName}/feed-${n}.jpg`,
      reels: `/content-pack/${folderName}/reels-${n}.jpg`,
      blog: `/content-pack/${folderName}/blog-${n}.jpg`,
    });
  }

  const imageInputs: any[] = [];

  for (let i = 0; i < Math.min(limitedFiles.length, 3); i++) {
    const imageBuffer = Buffer.from(await limitedFiles[i].arrayBuffer());
    const resized = await sharp(imageBuffer)
      .resize(700)
      .jpeg({ quality: 60 })
      .toBuffer();

    const base64Image = imageBuffer.toString("base64");

    imageInputs.push({
      type: "input_image",
      image_url: `data:${limitedFiles[i].type};base64,${base64Image}`,
    });
  }

  let styleGuide = "";

  if (style === "FIGHT_CLUB") {
    styleGuide = `
  - 강렬하고 운동욕구 올라오는 느낌
  - 짧고 임팩트 있게
  - 복싱 감성 강하게
  `;
  }

  if (style === "URBAN_PREMIUM") {
    styleGuide = `
  - 감성적이고 세련된 느낌
  - 공간 분위기를 강조
  - 프리미엄 피트니스 느낌
  `;
  }

  if (style === "WOMEN_FIT") {
    styleGuide = `
  - 부담 없는 말투
  - 다이어트/입문자 친화적
  - 밝고 편안한 분위기
  `;
  }

  if (style === "STRONG_CHARCOAL") {
    styleGuide = `
  - 스트롱복싱 메인 브랜드 느낌
  - 도시적이고 힙한 분위기
  - 운동 욕구 올라오는 감성
  `;
  }

  const ai = await client.responses.create({
    model: "gpt-4.1-mini",

    input: [
      {
        role: "user",

        content: [
          {
            type: "input_text",

            text: `
너는 스트롱복싱 콘텐츠 마케터야.

업로드된 체육관 사진을 보고,
사진에 보이는 분위기와 요소를 반영해서 콘텐츠를 만들어줘.

지점: ${branch}
콘텐츠 주제: ${title}
타겟: ${target}
콘텐츠 톤: ${tone}
디자인 스타일: ${style}
스타일 가이드: ${styleGuide}

사진에서 확인할 것:
- 샌드백
- 복싱 링
- 미트 트레이닝
- 유산소 공간
- 단체수업 분위기
- 깔끔한 시설
- 채광/인테리어

아래 JSON 형식으로만 답해.

{
  "analysis": "사진 분위기 분석 요약",

  "instagram": "인스타 캡션",

  "blog": "네이버 블로그 초안",

  "reels": [
    "릴스 자막1",
    "릴스 자막2",
    "릴스 자막3",
    "릴스 자막4",
    "릴스 자막5"
  ],

  "thumbnail": "썸네일 문구",

  "seoTitle": "SEO 최적화 제목",

  "hashtags": "#목동복싱 #다이어트복싱",

  "cta": "무료체험으로 시작해보세요 🥊",

  "hooks": [
    "살 빼려고 런닝머신만 했다면…",
    "복싱이 다이어트에 좋은 진짜 이유",
    "운동 처음인데 복싱부터 시작한 이유"
  ]
}

조건:
- 사진에 실제로 보이는 요소를 자연스럽게 반영
- 친근한 체육관 말투
- 너무 광고 같지 않게
- 초보자도 부담 없게
- 1일 체험권 10,000원 자연스럽게 언급
- ${branch} 중심으로 작성
- 타겟(${target})에게 맞는 표현 사용
- 콘텐츠 톤(${tone})에 맞게 작성
- hooks는 릴스 첫 3초 시선 끄는 문구 느낌
- thumbnail은 짧고 강렬하게
- seoTitle은 네이버 검색 최적화 느낌
- hashtags는 실제 인스타 스타일
- cta는 상담 유도 느낌
`,
          },

          ...imageInputs,
        ],
      },
    ] as any,
  });

  let captions;

  try {
    captions = JSON.parse(ai.output_text);
  } catch {
    captions = {
      analysis: "",
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
      target,
      tone,
      style,
      results,
      captions
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      branch,
      title,
      target,
      tone,
      style,
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