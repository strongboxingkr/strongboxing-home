import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { Readable } from "stream";

export const runtime = "nodejs";

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return Response.json({ ok: false, message: "파일 없음" }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return Response.json(
        { ok: false, message: "영상 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { ok: false, message: `파일이 너무 큽니다. 최대 500MB까지 업로드 가능합니다.` },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "reels");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name
      .replaceAll(" ", "-")
      .replace(/[^\w가-힣.\-]/g, "");

    const fileName = `${Date.now()}-${safeName}`;
    const uploadPath = path.join(uploadDir, fileName);

    // 스트리밍으로 디스크에 직접 씀 — 메모리에 전체 로드 안 함
    const nodeStream = Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]);
    const writeStream = createWriteStream(uploadPath);

    await new Promise<void>((resolve, reject) => {
      nodeStream.pipe(writeStream);
      nodeStream.on("error", reject);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    return Response.json({ ok: true, url: `/reels/${fileName}` });
  } catch (error) {
    console.error("릴스 업로드 실패:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return Response.json(
      { ok: false, message: `릴스 업로드 실패: ${msg}` },
      { status: 500 }
    );
  }
}