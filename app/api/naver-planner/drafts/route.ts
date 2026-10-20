import { bad, handle } from "@/lib/naver-planner/api";
import { buildInfoBlock, generateDraft } from "@/lib/naver-planner/generate";
import { envStatus } from "@/lib/naver-planner/naver";
import { deleteDraft, getBranch, getDraft, getLookup, isBranchSlug, listBranches, listDrafts, insertDraft } from "@/lib/naver-planner/repo";
import type { BlogRef, DraftRecord } from "@/lib/naver-planner/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  return handle(async () => {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (id) {
      const draft = await getDraft(id);
      return draft ? Response.json({ ok: true, draft }) : bad("초안이 없습니다.", 404);
    }
    const drafts = (await listDrafts(40)).map((d) => ({
      id: d.id,
      branch_slug: d.branch_slug,
      keyword: d.keyword,
      angle: d.angle,
      first_title: d.first_title,
      created_at: d.created_at,
    }));
    return Response.json({ ok: true, drafts });
  });
}

/** 초안 생성 — 저장만 하고 발행하지 않음 */
export async function POST(req: Request) {
  return handle(async () => {
    if (!envStatus().openai) return bad("OPENAI_API_KEY 가 설정되지 않았습니다.", 503);
    const body = await req.json();
    if (!isBranchSlug(body.branch)) return bad("지점이 올바르지 않습니다.");
    const branch = await getBranch(body.branch);
    if (!branch) return bad("지점을 찾을 수 없습니다.", 404);

    const keyword = String(body.keyword ?? "").trim();
    if (!keyword) return bad("핵심 키워드를 선택하세요.");
    const angle = String(body.angle ?? "").trim() || "처음 방문하는 날 진행 순서";
    const subKeywords: string[] = (body.subKeywords ?? []).map(String).filter((k: string) => k && k !== keyword).slice(0, 6);
    const references: BlogRef[] = (body.references ?? []).slice(0, 10).map((r: any) => ({
      title: String(r.title ?? "").slice(0, 200),
      description: String(r.description ?? "").slice(0, 400),
      link: String(r.link ?? ""),
      bloggername: String(r.bloggername ?? ""),
      postdate: String(r.postdate ?? ""),
    }));
    // 검색량은 클라이언트가 보낸 값이 아니라 저장된 조회 기록에서 다시 꺼내 기록 (없으면 "미조회")
    const lookup = body.lookupId ? await getLookup(Number(body.lookupId)) : null;
    const keywords: DraftRecord["keywords"] = [keyword, ...subKeywords].map((k) => {
      const row = lookup?.branch_slug === branch.slug ? lookup.rows.find((r) => r.keyword === k.replace(/\s+/g, "")) : undefined;
      return row
        ? { keyword: k, pc: row.pc.raw, mobile: row.mobile.raw, fetched_at: lookup!.fetched_at }
        : { keyword: k, pc: "미조회", mobile: "미조회", fetched_at: null };
    });

    const recent = await listDrafts(16);
    const allBranches = await listBranches();
    const { result, warnings, model } = await generateDraft({
      branch,
      keyword,
      subKeywords,
      angle,
      memo: String(body.memo ?? "").slice(0, 2000),
      references,
      recent,
      allBranches,
    });

    const id = await insertDraft({
      branch_slug: branch.slug,
      keyword,
      sub_keywords: subKeywords.join(", "),
      angle,
      result: { ...result, infoBlock: buildInfoBlock(branch) },
      references,
      keywords,
      warnings,
      model,
    });
    return Response.json({ ok: true, draft: await getDraft(id) });
  });
}

export async function DELETE(req: Request) {
  return handle(async () => {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) return bad("id 가 필요합니다.");
    await deleteDraft(id);
    return Response.json({ ok: true });
  });
}
