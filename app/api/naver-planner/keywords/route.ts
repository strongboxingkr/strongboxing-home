import { bad, handle } from "@/lib/naver-planner/api";
import { directCombos, runLookup, scoreKeywords } from "@/lib/naver-planner/keywords";
import { envStatus, normalizeHint } from "@/lib/naver-planner/naver";
import { getBranch, getLookup, insertLookup, isBranchSlug, listLookups } from "@/lib/naver-planner/repo";
import type { Branch, KeywordLookup } from "@/lib/naver-planner/types";

export const runtime = "nodejs";

function scored(lookup: KeywordLookup, branch: Branch) {
  return { ...lookup, rows: scoreKeywords(lookup.rows, branch) };
}

/** ?branch= → 조회 기록 목록, ?id= → 저장된 조회 결과 (당시 조회일 그대로) */
export async function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));
    if (id) {
      const lookup = await getLookup(id);
      if (!lookup) return bad("조회 기록이 없습니다.", 404);
      const branch = await getBranch(lookup.branch_slug);
      if (!branch) return bad("지점을 찾을 수 없습니다.", 404);
      return Response.json({ ok: true, lookup: scored(lookup, branch) });
    }
    const slug = url.searchParams.get("branch");
    if (!isBranchSlug(slug)) return bad("지점이 올바르지 않습니다.");
    return Response.json({ ok: true, history: await listLookups(slug) });
  });
}

/** 검색광고 API 실제 조회. 실패한 값은 만들지 않고 오류로 돌려줌 */
export async function POST(req: Request) {
  return handle(async () => {
    if (!envStatus().searchAd) return bad("검색광고 API 환경변수가 설정되지 않아 검색량을 조회할 수 없습니다.", 503);
    const body = await req.json();
    if (!isBranchSlug(body.branch)) return bad("지점이 올바르지 않습니다.");
    const branch = await getBranch(body.branch);
    if (!branch) return bad("지점을 찾을 수 없습니다.", 404);

    const hints: string[] = [...new Set<string>((body.hints ?? []).map((h: string) => normalizeHint(String(h))).filter(Boolean))].slice(0, 10);
    if (!hints.length) return bad("힌트 키워드를 1개 이상 입력하세요.");
    const combos = body.includeCombos ? directCombos(branch, 10).filter((c) => !hints.includes(c)) : [];

    const data = await runLookup(hints, combos);
    if (!data.rows.length && data.errors.length) {
      // 전부 실패 → 기록하지 않고 오류만 반환
      return Response.json({ ok: false, message: data.errors.join("\n") }, { status: 502 });
    }
    const lookup = await insertLookup(branch.slug, [...hints, ...combos].join(", "), data);
    return Response.json({ ok: true, lookup: scored(lookup, branch) });
  });
}
