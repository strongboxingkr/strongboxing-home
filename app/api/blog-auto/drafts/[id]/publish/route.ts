import { handle } from "@/lib/blog-auto/api";
import { publishDraft } from "@/lib/blog-auto/publish";

export const runtime = "nodejs";

/** 관리자가 직접 누르는 발행. 자동 실행은 이 엔드포인트를 호출하지 않는다 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const result = await publishDraft(Number(id));
    return Response.json(result, { status: result.ok ? 200 : 400 });
  });
}
