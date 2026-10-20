import { bad, handle } from "@/lib/naver-planner/api";
import { blogSearch, envStatus } from "@/lib/naver-planner/naver";

export const runtime = "nodejs";

/** 네이버 블로그 검색 API — 제목·요약·링크만 받음 (본문은 가져오지 않음) */
export async function GET(req: Request) {
  return handle(async () => {
    if (!envStatus().blogSearch) return bad("네이버 검색 API 환경변수가 설정되지 않았습니다.", 503);
    const query = (new URL(req.url).searchParams.get("query") ?? "").trim();
    if (!query) return bad("검색어를 입력하세요.");
    const items = await blogSearch(query, 10);
    return Response.json({ ok: true, query, items, fetched_at: new Date().toISOString() });
  });
}
