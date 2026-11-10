// blog-auto 자동 생성 기능이 비활성화되었습니다.
export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { ok: false, message: "blog-auto 자동 생성 기능이 비활성화되었습니다." },
    { status: 503 }
  );
}
