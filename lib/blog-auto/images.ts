import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import OpenAI from "openai";
import type { DraftImage } from "./types";

// 이미지 생성은 BLOG_AUTO_IMAGE_MODEL 이 설정된 경우에만 켜진다 (예: gpt-image-1).
// 꺼져 있으면 초안에 생성 프롬프트·삽입 위치·파일명·대체 텍스트만 남긴다.
export function imageModel(): string | null {
  return process.env.OPENAI_API_KEY && process.env.BLOG_AUTO_IMAGE_MODEL ? process.env.BLOG_AUTO_IMAGE_MODEL : null;
}

// 홈페이지 톤(검정 #0E0E10 / 레드 #D01E2E / 오프화이트 #F5F4F1)에 맞춘 공통 스타일
export const ILLUSTRATION_STYLE =
  "Flat vector editorial illustration. Dark charcoal background (#0E0E10), off-white (#F5F4F1) and signal red (#D01E2E) accents, " +
  "muted grey (#4A4C50) shapes, generous empty space, soft grain. Clearly an illustration, not a photograph. " +
  "No text, no letters, no numbers, no logos, no brand marks. No gym interiors and no realistic people or faces.";

const SIZES = {
  cover: { width: 1200, height: 630 }, // OG 공유 비율
  body: { width: 1200, height: 800 },
};

/** 우하단에 작은 'ILLUSTRATION' 표기 — 실제 현장 사진과 혼동 방지 (긴 한글 문구는 넣지 않음) */
function labelSvg(width: number, height: number) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${width - 196}" y="${height - 46}" width="176" height="28" rx="14" fill="rgba(14,14,16,0.72)"/>
      <rect x="${width - 182}" y="${height - 36}" width="4" height="8" fill="#D01E2E"/>
      <text x="${width - 170}" y="${height - 27}" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700"
        letter-spacing="2.5" fill="#C8CACD">ILLUSTRATION</text>
    </svg>`
  );
}

export type SavedImage = { url: string; width: number; height: number; bytes: number };

/**
 * 원본 버퍼를 모바일용으로 최적화해 저장.
 * - 대표 이미지: 1200x630 JPG (카카오톡·SNS 공유 호환)
 * - 본문 이미지: 가로 1200 WebP
 * 파일 경로는 slug/파일명으로 고정 → 재시도해도 같은 파일을 덮어써 중복이 생기지 않음
 */
export async function optimizeAndSave(
  input: Buffer,
  slug: string,
  img: Pick<DraftImage, "role" | "kind" | "filename">
): Promise<SavedImage> {
  const isCover = img.role === "cover";
  const box = isCover ? SIZES.cover : SIZES.body;

  let pipeline = sharp(input).rotate();
  if (isCover || img.kind === "illustration") {
    pipeline = pipeline.resize(box.width, box.height, { fit: "cover", position: "attention" });
  } else {
    pipeline = pipeline.resize({ width: box.width, withoutEnlargement: true });
  }
  let buf = await pipeline.toBuffer();
  const meta = await sharp(buf).metadata();
  const width = meta.width ?? box.width;
  const height = meta.height ?? box.height;

  if (img.kind === "illustration") {
    buf = await sharp(buf).composite([{ input: labelSvg(width, height) }]).toBuffer();
  }

  const base = img.filename.replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const fileName = `${base}.${isCover ? "jpg" : "webp"}`;
  const out = isCover
    ? await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
    : await sharp(buf).webp({ quality: 78 }).toBuffer();

  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const dir = path.join(process.cwd(), "public", "uploads", "blog-auto", safeSlug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), out);

  // 같은 경로를 덮어쓰므로 브라우저 캐시를 피하도록 버전 파라미터 부여
  return { url: `/uploads/blog-auto/${safeSlug}/${fileName}?v=${Date.now().toString(36)}`, width, height, bytes: out.length };
}

/** OpenAI 이미지 API로 일러스트 1장 생성 → 최적화 저장 */
export async function generateIllustration(img: DraftImage, slug: string): Promise<DraftImage> {
  const model = imageModel();
  if (!model) return { ...img, status: "pending", error: "이미지 생성 도구가 설정되지 않음 (BLOG_AUTO_IMAGE_MODEL)" };

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const isDalle = model.startsWith("dall-e");
  const res = await client.images.generate({
    model,
    prompt: `${ILLUSTRATION_STYLE}\n\nSubject: ${img.prompt}`,
    size: isDalle ? "1792x1024" : "1536x1024",
    n: 1,
    ...(isDalle
      ? { response_format: "b64_json" as const }
      : { quality: (process.env.BLOG_AUTO_IMAGE_QUALITY as "low" | "medium" | "high") || "medium" }),
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("이미지 응답이 비어 있음");

  const saved = await optimizeAndSave(Buffer.from(b64, "base64"), slug, img);
  return {
    ...img,
    kind: "illustration",
    status: "ready",
    url: saved.url,
    width: saved.width,
    height: saved.height,
    bytes: saved.bytes,
    error: undefined,
    // 새로 생성하면 이전 검수는 무효
    coachApproved: false,
  };
}
