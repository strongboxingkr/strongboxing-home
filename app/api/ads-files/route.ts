import { readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const folders = ["cheolsan", "mokdong", "sinjeong", "gaebong", "yeongdeungpo"];

export async function GET() {
  try {
    const allVideos: any[] = [];

    for (const folder of folders) {
      const dir = path.join(process.cwd(), "public", "videos", "ads", folder);

      try {
        const files = await readdir(dir);

        files
          .filter((file) => /\.(mp4|mov|webm|m4v)$/i.test(file))
          .forEach((file) => {
            allVideos.push({
              folder,
              file,
              url: `/videos/ads/${folder}/${file}`,
            });
          });
      } catch {
        // 폴더 없으면 그냥 넘어감
      }
    }

    return Response.json({
      ok: true,
      videos: allVideos,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, videos: [] },
      { status: 500 }
    );
  }
}