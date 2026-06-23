import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const IMAGE_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const VIDEO_MAX_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;
    const type = String(data.get("type") || "blog");

    if (!file) {
      return Response.json(
        { ok: false, message: "파일 없음" },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      return Response.json(
        { ok: false, message: "이미지 또는 영상 파일만 가능합니다." },
        { status: 400 }
      );
    }

    if (isImage && file.size > IMAGE_MAX_SIZE) {
      return Response.json(
        { ok: false, message: "이미지는 20MB 이하만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    if (isVideo && file.size > VIDEO_MAX_SIZE) {
      return Response.json(
        { ok: false, message: "영상은 200MB 이하만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const branch = String(data.get("branch") || "");
    const postNo = String(data.get("postNo") || "").replace(/[^\w]/g, "");
    const branchSlug: Record<string, string> = {
      개봉점: "gaebong",
      신정점: "sinjeong",
      목동점: "mokdong",
      철산점: "cheolsan",
      영등포점: "yeongdeungpo",
    };
    const branchFolder = branchSlug[branch] || "";

    const baseFolder = type === "naver-blog" ? "naver-blog" : "blog";
    const parts = [baseFolder, branchFolder, postNo].filter(Boolean);
    const folder = parts.join("/");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      folder
    );

    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name
      .replaceAll(" ", "-")
      .replace(/[^\w가-힣.\-]/g, "");

    const fileName = `${Date.now()}-${safeName}`;
    const uploadPath = path.join(uploadDir, fileName);

    await writeFile(uploadPath, buffer);

    return Response.json({
      ok: true,
      url: `/uploads/${folder}/${fileName}`,
      mediaType: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("업로드 실패:", error);

    return Response.json(
      {
        ok: false,
        message: "업로드 실패",
      },
      { status: 500 }
    );
  }
}