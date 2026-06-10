import { readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const branchFolderMap: any = {
  철산점: "cheolsan",
  목동점: "mokdong",
  신정점: "sinjeong",
  개봉점: "gaebong",
  영등포점: "yeongdeungpo",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch") || "철산점";
    const folder = branchFolderMap[branch];

    const dir = path.join(process.cwd(), "public", "videos", folder);
    const files = await readdir(dir);

    const videos = files.filter((file) =>
      /\.(mp4|mov|webm|m4v)$/i.test(file)
    );

    return Response.json({
      ok: true,
      files: videos,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      files: [],
    });
  }
}