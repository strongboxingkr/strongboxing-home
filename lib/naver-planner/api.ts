import { ensureSchema } from "./repo";

/** naver-planner API 공통: 테이블 준비 + 오류를 JSON 으로 (키 값은 메시지에 들어가지 않음) */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    await ensureSchema();
    return await fn();
  } catch (e) {
    console.error("[naver-planner]", e instanceof Error ? e.message : e);
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, message: msg }, { status: 500 });
  }
}

export function bad(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}
