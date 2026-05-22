import { db } from "@/lib/db";
import { PassThrough } from "stream";
import path from "path";
import fs from "fs";

const archiver = require("archiver");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { ok: false, message: "id가 없습니다." },
      { status: 400 }
    );
  }

  const [rows]: any = await db.query(
    `
    SELECT *
    FROM content_packs
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  const pack = rows[0];

  if (!pack) {
    return Response.json(
      { ok: false, message: "콘텐츠팩을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const results = JSON.parse(pack.results || "[]");
  const captions = JSON.parse(pack.captions || "{}");

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  const stream = new PassThrough();
  archive.pipe(stream);

  results.forEach((item: any, index: number) => {
    const n = String(index + 1).padStart(2, "0");

    const files = [
      { url: item.feed, name: `feed-${n}.jpg` },
      { url: item.reels, name: `reels-${n}.jpg` },
      { url: item.blog, name: `blog-${n}.jpg` },
    ];

    files.forEach((file) => {
      const filePath = path.join(process.cwd(), "public", file.url);

      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.name });
      }
    });
  });

  archive.append(captions.analysis || "", {
    name: "ai-analysis.txt",
  });

  archive.append(captions.instagram || "", {
    name: "instagram-caption.txt",
  });

  archive.append(captions.blog || "", {
    name: "blog-draft.txt",
  });

  archive.append(
    Array.isArray(captions.reels)
      ? captions.reels.join("\n")
      : captions.reels || "",
    {
      name: "reels-script.txt",
    }
  );

  await archive.finalize();

  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="content-pack-${id}.zip"`,
    },
  });
}