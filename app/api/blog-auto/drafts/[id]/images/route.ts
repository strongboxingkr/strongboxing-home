import { after } from "next/server";
import { bad, handle } from "@/lib/blog-auto/api";
import { imageModel, optimizeAndSave } from "@/lib/blog-auto/images";
import { executeImageRun } from "@/lib/blog-auto/pipeline";
import { replaceFigure } from "@/lib/blog-auto/render";
import { createRun, getDraft, updateDraft } from "@/lib/blog-auto/repo";
import type { DraftImage, ImageRole } from "@/lib/blog-auto/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };
const ROLES: ImageRole[] = ["cover", "body1", "body2"];

/**
 * POST multipart (file, role) → 관리자가 올린 실제 사진으로 교체 (최적화 후 저장)
 * POST json { role } → 일러스트 생성 (백그라운드, runId 반환)
 */
export async function POST(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const d = await getDraft(Number(id));
    if (!d) return bad("초안을 찾을 수 없습니다.", 404);
    if (d.status === "published") return bad("발행된 초안입니다.");

    const type = req.headers.get("content-type") || "";
    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const role = String(form.get("role") || "") as ImageRole;
      if (!file || !file.type.startsWith("image/")) return bad("이미지 파일을 선택해 주세요.");
      if (file.size > 30 * 1024 * 1024) return bad("30MB 이하 이미지만 올릴 수 있습니다.");
      const idx = d.images.findIndex((i) => i.role === role);
      if (idx < 0) return bad("이미지 항목이 없습니다.");

      const cur = d.images[idx];
      const photo: DraftImage = {
        ...cur,
        kind: "photo",
        filename: cur.filename.replace(/\.[a-z0-9]+$/i, "") + (role === "cover" ? ".jpg" : ".webp"),
      };
      const saved = await optimizeAndSave(Buffer.from(await file.arrayBuffer()), d.slug, photo);
      const images = [...d.images];
      images[idx] = {
        ...photo,
        status: "ready",
        url: saved.url,
        width: saved.width,
        height: saved.height,
        bytes: saved.bytes,
        error: undefined,
        caption: photo.caption.replace(/^일러스트\s*·?\s*/, ""),
        coachApproved: false,
      };
      await updateDraft(d.id, { images, content_html: replaceFigure(d.content_html, images[idx]) });
      return Response.json({ ok: true });
    }

    const { role } = await req.json();
    if (!ROLES.includes(role)) return bad("알 수 없는 이미지 항목입니다.");
    if (!imageModel()) return bad("이미지 생성 도구가 연결되어 있지 않습니다. 서버 환경변수 BLOG_AUTO_IMAGE_MODEL 을 설정하거나 사진을 직접 올려 주세요.");
    const runId = await createRun("image", d.topic_id, d.id);
    after(() => executeImageRun(runId, d.id, role));
    return Response.json({ ok: true, runId });
  });
}

/** 대체 텍스트·캡션·프롬프트 수정, 코치 검수 체크 → 본문 이미지 자리도 갱신 */
export async function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const d = await getDraft(Number(id));
    if (!d) return bad("초안을 찾을 수 없습니다.", 404);
    if (d.status === "published") return bad("발행된 초안입니다.");

    const body = await req.json();
    const idx = d.images.findIndex((i) => i.role === body.role);
    if (idx < 0) return bad("이미지 항목이 없습니다.");
    const img = { ...d.images[idx] };
    if (typeof body.alt === "string") img.alt = body.alt.trim();
    if (typeof body.caption === "string") img.caption = body.caption.trim();
    if (typeof body.prompt === "string") img.prompt = body.prompt.trim();
    if (typeof body.needsCoachReview === "boolean") img.needsCoachReview = body.needsCoachReview;
    if (typeof body.coachApproved === "boolean") img.coachApproved = body.coachApproved;

    const images = [...d.images];
    images[idx] = img;
    await updateDraft(d.id, { images, content_html: replaceFigure(d.content_html, img) });
    return Response.json({ ok: true });
  });
}
