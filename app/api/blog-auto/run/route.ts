import { after } from "next/server";
import { bad, handle } from "@/lib/blog-auto/api";
import { executeRun } from "@/lib/blog-auto/pipeline";
import { createRun, hasRunningRun } from "@/lib/blog-auto/repo";

export const runtime = "nodejs";

/**
 * '초안 1개 생성' 버튼. 생성은 1~3분 걸릴 수 있어 응답을 먼저 보내고 백그라운드(after)로 실행한다.
 * body: { topicId?: number, force?: boolean }  — force = 보류·초안 상태 주제도 다시 생성(기존 초안 덮어씀)
 */
export async function POST(req: Request) {
  return handle(async () => {
    const body = await req.json().catch(() => ({}));
    const topicId = body.topicId ? Number(body.topicId) : undefined;
    const force = !!body.force;
    if (!process.env.OPENAI_API_KEY) return bad("서버 환경변수 OPENAI_API_KEY 가 없어 생성할 수 없습니다.", 503);
    if (await hasRunningRun()) return bad("이미 생성 작업이 실행 중입니다. 끝난 뒤 다시 시도해 주세요.", 409);

    const trigger = force ? "regenerate" : "manual";
    const runId = await createRun(trigger, topicId ?? null);
    after(() => executeRun(runId, { trigger, topicId, force }));
    return Response.json({ ok: true, runId });
  });
}
