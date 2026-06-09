import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return Response.json(
        { ok: false, message: "파일 없음" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("video/")) {
      return Response.json(
        { ok: false, message: "영상 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "reels");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name
      .replaceAll(" ", "-")
      .replace(/[^\w가-힣.\-]/g, "");

    const fileName = `${Date.now()}-${safeName}`;
    const uploadPath = path.join(uploadDir, fileName);

    await writeFile(uploadPath, buffer);

    return Response.json({
      ok: true,
      url: `/reels/${fileName}`,
    });
  } catch (error) {
    console.error("릴스 업로드 실패:", error);

    return Response.json(
      { ok: false, message: "릴스 업로드 실패" },
      { status: 500 }
    );
  }
}