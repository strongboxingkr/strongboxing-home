import { db } from "@/lib/db";

const branchKeywords: any = {
  개봉점: ["개봉 복싱", "개봉동 복싱", "구로 복싱", "개봉 다이어트"],
  신정점: ["신정 복싱", "신정동 복싱", "양천구 복싱", "신정 다이어트"],
  목동점: ["목동 복싱", "양천구 복싱", "목동 다이어트", "목동 복싱장"],
  철산점: ["철산 복싱", "광명 복싱", "철산역 복싱", "철산 다이어트"],
  영등포점: ["영등포 복싱", "영등포구 복싱", "영등포 다이어트", "영등포 복싱장"],
};

const branchLinks: any = {
  개봉점: "https://strongboxing.kr/branches/gaebong",
  신정점: "https://strongboxing.kr/branches/sinjeong",
  목동점: "https://strongboxing.kr/branches/mokdong",
  철산점: "https://strongboxing.kr/branches/cheolsan",
  영등포점: "https://strongboxing.kr/branches/yeongdeungpo",
};

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    const [rows]: any = await db.query(
      `
      SELECT *
      FROM homepage_posts
      WHERE id = ?
      LIMIT 1
      `,
      [postId]
    );

    const post = rows[0];

    if (!post) {
      return Response.json(
        { ok: false, message: "글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const keywords = branchKeywords[post.branch_name] || ["복싱", "다이어트 복싱"];
    const branchUrl = branchLinks[post.branch_name] || "https://strongboxing.kr";

    const title = `[${post.branch_name}] ${post.title}`;

    const body = `
${post.content}

---

${post.branch_name}에서 복싱을 시작하고 싶다면
스트롱복싱에서 기초부터 차근차근 시작해보세요.

✅ 복싱 입문
✅ 다이어트 복싱
✅ 체력 향상
✅ 직장인 운동
✅ 여성 복싱

자세한 지점 정보는 아래 링크에서 확인할 수 있습니다.

${branchUrl}
`.trim();

    const tags = [
      "스트롱복싱",
      ...keywords,
      "복싱입문",
      "다이어트복싱",
      "복싱체육관",
    ];

    return Response.json({
      ok: true,
      draft: {
        title,
        body,
        tags,
        branchUrl,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { ok: false, message: "네이버 블로그 원고 생성 실패" },
      { status: 500 }
    );
  }
}