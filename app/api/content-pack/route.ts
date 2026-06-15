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
  const title = String(formData.get("title") || "복싱 입문");
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

    const base64Image = resized.toString("base64");

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

  const captions = {
  analysis: `${branch} ${title} 콘텐츠팩 테스트 저장입니다.`,

  instagram:
    `${branch}에서 ${title} 시작해보세요 🥊\n\n` +
      `처음이신 분들도 부담 없이 방문 상담을 받아보세요.`,

  blog:
    `${branch} ${title} 콘텐츠 초안입니다.\n\n` +
    `처음 운동을 시작하는 분들도 부담 없이 복싱을 경험할 수 있습니다.\n\n` +
    `스트롱복싱에서 운동 목적에 맞는 수업을 받아보세요.`,

  reels: [
    `${title}, 어렵게 시작하지 않아도 됩니다.`,
    `${branch}에서 복싱으로 운동 루틴 만들기`,
    `처음이신 분들도 기초부터 차근차근 지도해드립니다.`,
  ],

  thumbnail: `${title} 시작하기`,

  seoTitle: `${branch} ${title} | 스트롱복싱`,

  hashtags:
    `#스트롱복싱 #${branch.replace("점", "")}복싱 #복싱다이어트 #복싱입문`,

  cta: `지금 ${branch}에서 복싱을 시작해보세요 🥊`,

  hooks: [
    `운동 시작이 어렵다면 이거부터`,
    `${title} 이렇게 시작하면 됩니다`,
    `복싱 처음이어도 괜찮습니다`,
  ],
};

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