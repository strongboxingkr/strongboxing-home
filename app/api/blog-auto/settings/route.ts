import { db } from "@/lib/db";
import { handle } from "@/lib/blog-auto/api";
import { textModel } from "@/lib/blog-auto/generate";
import { imageModel } from "@/lib/blog-auto/images";
import { MAX_PENDING_DRAFTS } from "@/lib/blog-auto/pipeline";
import { getSetting, setSetting } from "@/lib/blog-auto/repo";

export const runtime = "nodejs";

/** 확인된 운영 정보 + 연결 상태 (비밀키 값은 내보내지 않고 설정 여부만) */
export async function GET() {
  return handle(async () => {
    const [[pending]]: any = await db.query(`SELECT COUNT(*) AS n FROM blog_auto_drafts WHERE status = 'draft'`);
    return Response.json({
      ok: true,
      verifiedFacts: await getSetting("verified_facts"),
      status: {
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        textModel: textModel(),
        imageModel: imageModel(),
        imageQuality: process.env.BLOG_AUTO_IMAGE_QUALITY || "medium",
        cronEnabled: !!process.env.BLOG_AUTO_CRON_SECRET,
        pendingDrafts: pending.n,
        maxPendingDrafts: MAX_PENDING_DRAFTS,
      },
    });
  });
}

export async function PUT(req: Request) {
  return handle(async () => {
    const { verifiedFacts } = await req.json();
    await setSetting("verified_facts", String(verifiedFacts ?? "").slice(0, 8000));
    return Response.json({ ok: true });
  });
}
