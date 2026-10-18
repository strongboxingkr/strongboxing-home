import { timingSafeEqual } from "crypto";
import { bad, handle } from "@/lib/blog-auto/api";
import { executeRun } from "@/lib/blog-auto/pipeline";
import { createRun, hasRunningRun } from "@/lib/blog-auto/repo";

export const runtime = "nodejs";

/**
 * 예약 실행(주 2회 등)용. 관리자 쿠키 대신 서버 환경변수 BLOG_AUTO_CRON_SECRET 으로 인증.
 * 초안까지만 만들고 발행은 하지 않는다.
 *   curl -X POST -H "Authorization: Bearer $BLOG_AUTO_CRON_SECRET" https://strongboxing.kr/api/blog-auto/cron
 */
export async function POST(req: Request) {
  const secret = process.env.BLOG_AUTO_CRON_SECRET;
  if (!secret) return bad("예약 실행이 꺼져 있습니다 (BLOG_AUTO_CRON_SECRET 미설정).", 503);

  const given = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return bad("인증 실패", 401);

  return handle(async () => {
    if (!process.env.OPENAI_API_KEY) return bad("OPENAI_API_KEY 미설정", 503);
    if (await hasRunningRun()) return bad("이미 실행 중", 409);
    const runId = await createRun("schedule", null);
    executeRun(runId, { trigger: "schedule" }).catch(() => {});
    return Response.json({ ok: true, runId });
  });
}
