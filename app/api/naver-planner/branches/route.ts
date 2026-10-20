import { bad, handle } from "@/lib/naver-planner/api";
import { envStatus } from "@/lib/naver-planner/naver";
import { ANGLES, textModel } from "@/lib/naver-planner/generate";
import { getBranch, isBranchSlug, listBranches, updateBranch } from "@/lib/naver-planner/repo";
import { FACT_FIELDS } from "@/lib/naver-planner/types";

export const runtime = "nodejs";

/** 지점 정보 + 환경변수 설정 여부(값은 보내지 않음) + 주제 각도 목록 */
export async function GET() {
  return handle(async () =>
    Response.json({ ok: true, branches: await listBranches(), env: envStatus(), angles: ANGLES, model: textModel() })
  );
}

export async function PUT(req: Request) {
  return handle(async () => {
    const body = await req.json();
    if (!isBranchSlug(body.slug)) return bad("지점이 올바르지 않습니다.");
    const cur = await getBranch(body.slug);
    if (!cur) return bad("지점을 찾을 수 없습니다.", 404);

    const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
    const verified: Record<string, boolean> = {};
    for (const f of FACT_FIELDS) verified[f] = !!body.verified?.[f];

    const next = {
      ...cur,
      address: str(body.address, 300),
      hours: str(body.hours, 300),
      price: str(body.price, 500),
      booking_url: str(body.booking_url, 500),
      phone: str(body.phone, 50),
      region_terms: str(body.region_terms, 300),
      local_notes: str(body.local_notes, 5000),
      angle_notes: str(body.angle_notes, 5000),
      verified,
    };
    if (next.booking_url && !/^https?:\/\//.test(next.booking_url)) return bad("예약 링크는 http(s):// 로 시작해야 합니다.");
    // 비어 있는 값은 확인됨으로 둘 수 없음
    for (const f of FACT_FIELDS) if (!next[f]) next.verified[f] = false;

    await updateBranch(next);
    return Response.json({ ok: true, branch: await getBranch(body.slug) });
  });
}
