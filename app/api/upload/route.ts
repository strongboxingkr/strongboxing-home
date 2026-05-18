import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File;

    if (!file) {
      return Response.json(
        { ok: false, message: "파일 없음" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;

    const uploadPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      fileName
    );

    await writeFile(uploadPath, buffer);

    return Response.json({
      ok: true,
      url: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        ok: false,
        message: "업로드 실패",
      },
      { status: 500 }
    );
  }
}