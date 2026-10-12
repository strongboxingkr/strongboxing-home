import { ensureSchema } from "./schema";
import { expireStaleRuns } from "./repo";

/** blog-auto API 공통: 테이블 준비 + 오류를 JSON 으로 */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    await ensureSchema();
    await expireStaleRuns();
    return await fn();
  } catch (e) {
    console.error("[blog-auto]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, message: msg }, { status: 500 });
  }
}

export function bad(message: string, status = 400, extra: Record<string, unknown> = {}) {
  return Response.json({ ok: false, message, ...extra }, { status });
}
