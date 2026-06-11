import { db } from "@/lib/db";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

export async function POST(req: Request) {
  try {
    const { id, video_url } = await req.json();

    if (!id || !video_url) {
      return Response.json({ ok: false, message: "정보 부족" }, { status: 400 });
    }

    if (!video_url.startsWith("/videos/")) {
      return Response.json({ ok: false, message: "videos 폴더 영상만 가능" }, { status: 400 });
    }

    const inputPath = path.join(process.cwd(), "public", video_url);
    const parsed = path.parse(inputPath);
    const outputPath = path.join(parsed.dir, `${parsed.name}-muted${parsed.ext}`);
    const outputUrl = video_url.replace(parsed.base, `${parsed.name}-muted${parsed.ext}`);

    if (!existsSync(inputPath)) {
      return Response.json({ ok: false, message: "원본 파일 없음" }, { status: 404 });
    }

    await execFileAsync("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-c",
      "copy",
      "-an",
      outputPath,
    ]);

    await db.query(
      `
      UPDATE homepage_reels
      SET video_url = ?, is_muted = 1
      WHERE id = ?
      `,
      [outputUrl, id]
    );

    return Response.json({ ok: true, url: outputUrl });
  } catch (error) {
    console.error("음소거 실패:", error);
    return Response.json({ ok: false, message: "음소거 실패" }, { status: 500 });
  }
}