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

  const chipBase = "rounded-[10px] border px-5 py-2.5 text-sm font-black transition-all duration-200";
  const chipActive = "border-[#D01E2E] bg-[#D01E2E] text-white";
  const chipIdle = "border-[#4A4C50]/30 bg-[#141416] text-[#8A8D91] hover:border-white/30 hover:text-white";

  return (
    <main className="min-h-screen bg-[#0E0E10] text-white">
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(208,30,46,.12),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <a href="/" className="mb-10 inline-block text-[#8A8D91] transition hover:text-white">
            ← 메인으로
          </a>

          <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#D01E2E]">
            STRONG BOXING BLOG
          </p>

          <h1 className="mb-6 text-5xl font-black tracking-[-0.06em] text-[#F5F4F1] md:text-8xl">
            소식 & 후기
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[#8A8D91]">
            스트롱복싱의 지점별 소식, 운동 후기, 다이어트 정보들을 확인해보세요.
          </p>
        </div>
      </section>

      {/* 지점 필터 */}
      <section className="px-6 pb-3">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-[10px] font-black tracking-[0.25em] text-[#5A5C61]">지점</p>
          <div className="flex flex-wrap gap-2">
            {branches.map((branch) => (
              <a
                key={branch}
                href={branch === "전체" ? "/blog" : `/blog?branch=${branch}`}
                className={`${chipBase} ${selectedBranch === branch ? chipActive : chipIdle}`}
              >
                {branch}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 mt-5 text-[10px] font-black tracking-[0.25em] text-[#5A5C61]">카테고리</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={
                  category === "전체"
                    ? selectedBranch === "전체"
                      ? "/blog"
                      : `/blog?branch=${selectedBranch}`
                    : `/blog?branch=${selectedBranch}&category=${category}`
                }
                className={`${chipBase} ${selectedCategory === category ? chipActive : chipIdle}`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 포스트 목록 */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="rounded-[16px] border border-[#4A4C50]/30 bg-[#141416] p-10 text-center">
              <h2 className="mb-3 text-2xl font-black">아직 글이 없습니다</h2>
              <p className="text-[#8A8D91]">
                선택한 지점의 소식이 곧 업데이트될 예정입니다.
              </p>
            </div>
          ) : (
            <BlogViewClient posts={filteredPosts} />
          )}
        </div>
      </section>
    </main>
  );
}
