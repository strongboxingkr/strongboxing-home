import { db } from "@/lib/db";
import type { Metadata } from "next";
import BlogViewClient from "@/app/components/BlogViewClient";

const siteUrl = "https://strongboxing.kr";
const PAGE_TITLE = "스트롱복싱 소식 | 지점별 복싱 수업 이야기";
const PAGE_DESC =
  "개봉·신정·목동·철산·영등포 스트롱복싱의 다양한 수업 이야기와 회원 운동 모습, 키즈복싱, 다이어트 복싱, 초보자 복싱 등 실제 운동 현장을 소개합니다.";
const OG_IMAGE = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${siteUrl}/blog`,
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [OG_IMAGE],
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
    SELECT id, title, slug, description, content, branch_name, category, thumbnail, is_best, created_at
    FROM homepage_posts
    WHERE branch_name IS NOT NULL AND branch_name != ''
      AND NOT (branch_name = '전체' AND category = '복싱정보')
    ORDER BY created_at DESC, id DESC
  `);

  const posts = rows.map((post: { title: string }) => {
    const displayTitles = [
      ["양천복싱장·목동복싱장 운동추천!", "복싱장이 무서울 줄 알았던 목동점 회원 이야기"],
      ["철산 운동, 철산 복싱장 40~50대도", "40~50대도 편하게 시작하는 철산점 복싱"],
      ["신정동 복싱, 신정네거리 복싱", "신정점에서 보낸 복싱 첫날"],
      ["구로복싱 개봉동복싱 고척동복싱", "운동 의욕이 떨어졌을 때, 개봉점에서 다시 시작한 복싱"],
    ];
    const title = displayTitles.find(([prefix]) => post.title.startsWith(prefix))?.[1];
    return title ? { ...post, title } : post;
  });

  const isOverview = selectedBranch === "전체" && selectedCategory === "전체";
  const featured = isOverview
    ? posts.flatMap((post: any) => {
        if (post.category !== "소식" || post.branch_name === "전체" ||
            !/수업|훈련|미트|스텝/.test(post.title + " " + post.description)) return [];
        const image = post.thumbnail ||
          String(post.content || "").match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
          String(post.content || "").match(/!\[.*?\]\((.*?)\)/)?.[1];
        return image ? [{ post, image }] : [];
      })[0]
    : undefined;

  function filterHref(branch: string, category: string) {
    const filters = new URLSearchParams();
    if (branch !== "전체") filters.set("branch", branch);
    if (category !== "전체") filters.set("category", category);
    return filters.size ? "/blog?" + filters.toString() : "/blog";
  }

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
      selectedCategory === "전체" ? post.category !== "공지" : post.category === selectedCategory;

    return branchMatch && categoryMatch && post.id !== featured?.post.id;
  });

  const pillBase = "rounded-[4px] px-4 py-2 text-[13px] font-bold transition-all duration-200";
  const pillActive = "bg-[#D01E2E] text-white";
  const pillIdle = "bg-[#1C1C1F] text-[#B5B5BC] hover:bg-[#252528] hover:text-[#C9C9C9]";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${siteUrl}/blog`,
    inLanguage: "ko",
    publisher: {
      "@type": "Organization",
      name: "스트롱복싱",
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon.png` },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 10).map((post: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#0E0E10] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-6 pb-8 pt-10 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <a href="/" className="mb-6 inline-flex text-sm font-semibold text-[#B5B5BC] hover:text-white">← 메인으로</a>
          <h1 className="text-4xl font-black tracking-tight text-[#F5F4F1] md:text-5xl">소식 &amp; 후기</h1>

          {featured && (
            <a href={`/blog/${featured.post.slug}`} className="group mt-6 grid overflow-hidden rounded-[4px] border border-white/10 bg-[#171719] md:grid-cols-[1.3fr_1fr]">
              <img src={featured.image} alt="" fetchPriority="high" className={"aspect-video w-full object-cover" + (featured.post.slug === "before-choosing-cheolsan-boxing-gym-check-class-atmosphere" ? " object-top" : "")} />
              <div className="flex flex-col justify-center p-5 md:p-8">
                <p className="mb-3 text-sm font-semibold text-[#B5B5BC]">{featured.post.branch_name} · 수업 이야기</p>
                <h2 className="break-keep text-2xl font-black leading-snug tracking-tight group-hover:underline md:text-3xl">{featured.post.title}</h2>
                {featured.post.description && <p className="mt-3 line-clamp-2 break-keep text-sm leading-relaxed text-[#B5B5BC]">{featured.post.description}</p>}
                <span className="mt-5 text-sm font-bold">수업 이야기 읽기 →</span>
              </div>
            </a>
          )}
        </div>
      </section>

      {/* ── 필터 ── */}
      <section className="sticky top-0 z-30 px-6 py-4" style={{ background: "rgba(14,14,16,0.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl space-y-3">
          {/* 지점 */}
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-[10px] font-black tracking-[0.2em] text-[#B5B5BC] mr-1">지점</span>
            {branches.map((branch) => (
              <a
                key={branch}
                href={filterHref(branch, selectedCategory)}
                aria-current={selectedBranch === branch ? "true" : undefined}
                className={`${pillBase} ${selectedBranch === branch ? pillActive : pillIdle}`}
              >
                {branch}
              </a>
            ))}
          </div>
          {/* 카테고리 */}
          <div className="flex flex-wrap gap-2">
            <span className="self-center text-[10px] font-black tracking-[0.2em] text-[#B5B5BC] mr-1">분류</span>
            {categories.map((category) => (
              <a
                key={category}
                href={filterHref(selectedBranch, category)}
                aria-current={selectedCategory === category ? "true" : undefined}
                className={`${pillBase} ${selectedCategory === category ? pillActive : pillIdle}`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 포스트 목록 ── */}
      <section className="px-6 pt-8 pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black">{selectedCategory === "전체" ? "최신 글" : selectedCategory}</h2>
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
