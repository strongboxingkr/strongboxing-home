import { db } from "@/lib/db";
import type { Metadata } from "next";
import BlogViewClient from "@/app/components/BlogViewClient";

export const metadata: Metadata = {
  title: "스트롱복싱 소식 & 후기 | 복싱 다이어트 정보",
  description:
    "스트롱복싱 지점별 소식, 복싱 입문, 다이어트 복싱, 여성 복싱, 직장인 운동 정보를 확인해보세요.",
  alternates: {
    canonical: "https://strongboxing.kr/blog",
  },
  openGraph: {
    title: "스트롱복싱 소식 & 후기",
    description:
      "복싱 입문부터 다이어트 복싱까지 스트롱복싱의 지점별 소식과 운동 정보를 확인해보세요.",
    url: "https://strongboxing.kr/blog",
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "스트롱복싱 소식" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "스트롱복싱 소식 & 후기",
    description: "복싱 입문부터 다이어트 복싱까지 스트롱복싱의 지점별 소식과 운동 정보를 확인해보세요.",
    images: ["/og.png"],
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{
  branch?: string;
  category?: string;
}>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedBranch = params.branch || "전체";
  const selectedCategory = params.category || "전체";

  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_posts
    ORDER BY created_at DESC
  `);

  const posts = rows;

  const branches = [
    "전체",
    "개봉점",
    "신정점",
    "목동점",
    "철산점",
    "영등포점",
  ];

  const categories = [
    "전체",
    "소식",
    "이벤트",
    "공지",
  ];

  const filteredPosts = posts.filter((post: any) => {
    const branchMatch =
      selectedBranch === "전체" ||
      post.branch_name === selectedBranch;

    const categoryMatch =
      selectedCategory === "전체" ||
      post.category === selectedCategory;

    return branchMatch && categoryMatch;
  });

  const pillBase = "rounded-full px-4 py-2 text-[13px] font-bold transition-all duration-200";
  const pillActive = "bg-[#D01E2E] text-white";
  const pillIdle = "bg-[#1C1C1F] text-[#5A5C61] hover:bg-[#252528] hover:text-[#C9C9C9]";

  return (
    <main className="min-h-screen bg-[#0E0E10] text-white">

      {/* ── 히어로 ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_0%,rgba(208,30,46,0.09),transparent_60%)]" />
        <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-[#D01E2E]/30" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <a href="/" className="mb-10 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#5A5C61] transition-colors hover:text-[#F5F4F1]">
            ← 메인으로
          </a>

          <p className="mb-4 text-[11px] font-black tracking-[0.4em] text-[#D01E2E]">
            STRONG BLOG
          </p>

          <h1 className="mb-5 font-black tracking-[-0.06em] text-[#F5F4F1]" style={{ fontSize: "clamp(48px, 9vw, 100px)", lineHeight: 0.88 }}>
            소식 & 후기
          </h1>

          <div className="my-7 h-[2px] w-12 bg-[#D01E2E]" />

          <p className="max-w-lg text-[15px] leading-[1.85] text-[#5A5C61]">
            스트롱복싱의 다양한 소식과<br />
            회원들의 생생한 운동 이야기를 만나보세요.
          </p>
        </div>
      </section>

      {/* ── 필터 ── */}
      <section className="sticky top-0 z-30 px-6 py-4" style={{ background: "rgba(14,14,16,0.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl space-y-3">
          {/* 지점 */}
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-[10px] font-black tracking-[0.2em] text-[#3A3A3E] mr-1">지점</span>
            {branches.map((branch) => (
              <a
                key={branch}
                href={branch === "전체" ? "/blog" : `/blog?branch=${branch}&category=${selectedCategory === "전체" ? "" : selectedCategory}`}
                className={`${pillBase} ${selectedBranch === branch ? pillActive : pillIdle}`}
              >
                {branch}
              </a>
            ))}
          </div>
          {/* 카테고리 */}
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-[10px] font-black tracking-[0.2em] text-[#3A3A3E] mr-1">분류</span>
            {categories.map((category) => (
              <a
                key={category}
                href={
                  category === "전체"
                    ? selectedBranch === "전체" ? "/blog" : `/blog?branch=${selectedBranch}`
                    : `/blog?branch=${selectedBranch}&category=${category}`
                }
                className={`${pillBase} ${selectedCategory === category ? pillActive : pillIdle}`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 포스트 목록 ── */}
      <section className="px-6 py-12 pb-28">
        <div className="mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", background: "#1C1C1F" }}>
              <span style={{ fontSize: 48, opacity: 0.2 }}>🥊</span>
              <p className="text-[15px] font-black" style={{ color: "#F5F4F1" }}>아직 글이 없습니다</p>
              <p className="text-[13px]" style={{ color: "#5A5C61" }}>선택한 지점의 소식이 곧 업데이트될 예정입니다.</p>
            </div>
          ) : (
            <BlogViewClient posts={filteredPosts} />
          )}
        </div>
      </section>
    </main>
  );
}
