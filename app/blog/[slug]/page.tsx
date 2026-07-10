import { db } from "@/lib/db";
import type { Metadata } from "next";
import MarkdownContent from "./MarkdownContent";
import ViewTracker from "./ViewTracker";

const siteUrl = "https://strongboxing.kr";

function extractFaqFromMarkdown(content: string): Array<{ q: string; a: string }> {
  const items: Array<{ q: string; a: string }> = [];

  // FAQ 섹션 헤더 찾기
  const sectionRx = /##\s*(?:FAQ|자주\s*묻는\s*질문|Q&A|궁금한\s*(?:점|질문))[^\n]*\n([\s\S]*?)(?=\n##|$)/i;
  const sectionMatch = content.match(sectionRx);
  const section = sectionMatch ? sectionMatch[1] : content;

  // 굵은 글씨 질문 패턴: **Q1. 질문?** 또는 **질문?**
  const boldQRx = /\*{1,2}(?:Q\d*[.:]\s*)?([^*\n]{5,150}(?:\?|요|까|야))\*{1,2}[^\n]*\n((?:(?!\*{1,2}|\n##)[^\n]+\n?)*)/gi;
  let match: RegExpExecArray | null;
  while ((match = boldQRx.exec(section)) !== null) {
    const q = match[1].trim().replace(/\*+/g, "");
    const a = match[2].replace(/\*{1,2}/g, "").trim().split(/\n/)[0].trim();
    if (q.length > 4 && a.length > 4) items.push({ q, a });
  }

  // 굵은 글씨로 못 찾은 경우 Q:/ A: 패턴 시도
  if (items.length === 0) {
    const qaRx = /Q\d*[.:]\s*([^\n]+)\nA\d*[.:]\s*([^\n]+)/gi;
    while ((match = qaRx.exec(section)) !== null) {
      const q = match[1].trim();
      const a = match[2].trim();
      if (q.length > 4 && a.length > 4) items.push({ q, a });
    }
  }

  return items.filter(i => i.q && i.a).slice(0, 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const [rows]: any = await db.query(
    `
    SELECT *
    FROM homepage_posts
    WHERE slug = ?
    LIMIT 1
    `,
    [slug]
  );

  const post = rows[0];

  if (!post) {
    return {
      title: "스트롱복싱 블로그",
      description: "스트롱복싱 소식과 운동 정보",
    };
  }

  const rawContent = String(post.content || "");
  const imgSrc =
    rawContent.match(/!\[.*?\]\(([^)]+)\)/)?.[1] ||
    rawContent.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  const imageUrl = imgSrc ? `${siteUrl}${imgSrc}` : `${siteUrl}/og.png`;

  return {
    title: { absolute: `${post.title} | 스트롱복싱` },
    description:
      post.description || `${post.branch_name} 스트롱복싱 블로그 소식입니다.`,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | 스트롱복싱`,
      description:
        post.description || `${post.branch_name} 스트롱복싱 블로그 소식입니다.`,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: "스트롱복싱",
      locale: "ko_KR",
      type: "article",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | 스트롱복싱`,
      description: post.description || `${post.branch_name} 스트롱복싱 블로그 소식입니다.`,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [rows]: any = await db.query(
    `
    SELECT *
    FROM homepage_posts
    WHERE slug = ?
    LIMIT 1
    `,
    [slug]
  );

  const post = rows[0];

  // 관련 글 3단계 fallback
  let relatedPosts: any[] = [];
  let relatedTitle = "함께 보면 좋은 글";

  if (post) {
    // 1순위: 같은 지점 + 같은 카테고리
    const [relSameRows]: any = await db.query(
      `SELECT id, title, slug, branch_name, category, created_at
       FROM homepage_posts
       WHERE slug != ? AND branch_name = ? AND category = ?
       ORDER BY created_at DESC LIMIT 5`,
      [slug, post.branch_name, post.category]
    );
    relatedPosts = relSameRows;

    // 2순위: 같은 카테고리 (지점 무관)
    if (relatedPosts.length < 5) {
      const exclude1 = [slug, ...relatedPosts.map((p: any) => p.slug)];
      const ph1 = exclude1.map(() => "?").join(", ");
      const [relCatRows]: any = await db.query(
        `SELECT id, title, slug, branch_name, category, created_at
         FROM homepage_posts
         WHERE slug NOT IN (${ph1}) AND category = ?
         ORDER BY created_at DESC LIMIT ?`,
        [...exclude1, post.category, 5 - relatedPosts.length]
      );
      relatedPosts = [...relatedPosts, ...relCatRows];
    }

    // 3순위: 최신 글로 채우기
    if (relatedPosts.length < 5) {
      const exclude2 = [slug, ...relatedPosts.map((p: any) => p.slug)];
      const ph2 = exclude2.map(() => "?").join(", ");
      const [relLatestRows]: any = await db.query(
        `SELECT id, title, slug, branch_name, category, created_at
         FROM homepage_posts
         WHERE slug NOT IN (${ph2})
         ORDER BY created_at DESC LIMIT ?`,
        [...exclude2, 5 - relatedPosts.length]
      );
      relatedPosts = [...relatedPosts, ...relLatestRows];
    }

    // 결과가 모두 같은 지점이면 지점별 제목, 아니면 범용 제목
    const allSameBranch = relatedPosts.every((p: any) => p.branch_name === post.branch_name);
    if (allSameBranch && relatedPosts.length > 0) {
      const labelMap: Record<string, string> = {
        소식: "같은 지점의 다른 소식",
        이벤트: "관련 이벤트",
        공지: "함께 확인할 공지",
        후기: "회원 후기 더 보기",
        운동팁: "함께 보면 좋은 글",
      };
      relatedTitle = labelMap[post.category] ?? "함께 보면 좋은 글";
    } else {
      relatedTitle = "함께 보면 좋은 글";
    }
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0E0E10] px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black">글을 찾을 수 없습니다.</h1>
          <a href="/blog" className="mt-6 inline-block text-[#D01E2E]">
            블로그로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  const rawContent2 = String(post.content || "");
  const imgSrc2 =
    rawContent2.match(/!\[.*?\]\(([^)]+)\)/)?.[1] ||
    rawContent2.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  const imageUrl = imgSrc2 ? `${siteUrl}${imgSrc2}` : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: "스트롱복싱",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "스트롱복싱",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon.png` },
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.created_at,
    dateModified: post.created_at,
    image: imageUrl ? [imageUrl] : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "스트롱복싱", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "블로그", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  const faqItems = extractFaqFromMarkdown(String(post.content || ""));
  const faqJsonLd = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-[#0E0E10] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article>
        {/* 헤더 */}
        <section
          className="px-6 py-12 md:py-16"
          style={{ background: "#0E0E10", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="mx-auto max-w-4xl">
            <a href="/blog" className="mb-10 inline-block text-[#4A4C50] transition hover:text-white">
              ← 블로그로
            </a>

            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-[#D01E2E] px-3 py-1 text-xs font-black">
                {post.branch_name}
              </span>
              <span className="rounded-full border border-[#4A4C50]/30 px-3 py-1 text-xs text-[#8A8D91]">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#4A4C50]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="2" width="10" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.15" />
                  <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
                  <path d="M1 5h10" stroke="currentColor" strokeWidth="1.15" />
                </svg>
                {new Date(post.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#4A4C50]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.15" />
                  <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {Math.max(1, Math.ceil(String(post.content || "").replace(/<[^>]*>/g, "").length / 300))}분 읽기
              </span>
              <span className="flex items-center gap-1 text-xs text-[#4A4C50]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <ellipse cx="6" cy="6" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.15" />
                  <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                </svg>
                조회 {(post.views ?? 0).toLocaleString()}
              </span>
            </div>

            <h1 className="text-[28px] font-black leading-[1.35] tracking-[-0.04em] md:text-[36px] md:leading-[1.28]">
              {post.title}
            </h1>
          </div>
        </section>

        <ViewTracker postId={post.id} />

        {/* 본문 */}
        <section className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-4xl">
            <MarkdownContent content={String(post.content || "")} />

            {/* ── 관련 글 ── */}
            {relatedPosts.length > 0 && (
              <section className="mt-20" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 52 }}>
                <p className="mb-1.5 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>
                  RELATED
                </p>
                <h2 className="mb-8 text-lg font-black" style={{ color: "#8A8D91", letterSpacing: "-0.02em" }}>
                  {relatedTitle}
                </h2>

                <ul>
                  {relatedPosts.map((rp: any) => (
                    <li key={rp.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <a
                        href={`/blog/${rp.slug}`}
                        className="group flex items-center justify-between gap-4 py-5 transition-all duration-200"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="mb-1.5 text-[11px] font-bold" style={{ color: "#5A5C61" }}>
                            {rp.branch_name} · {rp.category} · {new Date(rp.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                          </p>
                          <p className="truncate text-sm font-bold transition-colors duration-200 group-hover:text-white" style={{ color: "#C8CACD" }}>
                            {rp.title}
                          </p>
                        </div>
                        <span
                          className="shrink-0 text-sm transition-transform duration-300 group-hover:translate-x-1"
                          style={{ color: "#5A5C61" }}
                        >
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ── 해당 지점 링크 ── */}
            {(() => {
              const branchLinkMap: Record<string, { slug: string; cta: string; sub: string }> = {
                "목동점":    { slug: "mokdong",      cta: "목동 복싱장 수업 안내 보기",        sub: "목동·목5동·오목교 인근" },
                "철산점":    { slug: "cheolsan",     cta: "철산 복싱장 위치와 운영시간 보기",  sub: "철산동·광명 인근" },
                "개봉점":    { slug: "gaebong",      cta: "개봉 복싱장 상담 예약하기",         sub: "개봉·고척동 인근" },
                "신정점":    { slug: "sinjeong",     cta: "신정동 복싱장 수업 분위기 보기",    sub: "신정·양천구" },
                "영등포점":  { slug: "yeongdeungpo", cta: "영등포 복싱장 상담 안내 보기",      sub: "영등포·도림동 인근" },
              };
              const bl = branchLinkMap[post.branch_name];
              if (!bl) return null;
              return (
                <section className="mt-16 border-t border-[#4A4C50]/30 pt-12">
                  <p className="mb-2 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>THIS BRANCH</p>
                  <a
                    href={`/branches/${bl.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-[14px] border border-[#4A4C50]/30 bg-[#141416] px-7 py-6 transition duration-200 hover:border-[#D01E2E]/50 hover:bg-[#1A1212]"
                  >
                    <div>
                      <p className="mb-1 text-xs font-bold" style={{ color: "#5A5C61" }}>{bl.sub}</p>
                      <p className="text-base font-black text-[#F5F4F1] transition group-hover:text-[#D01E2E]">{bl.cta}</p>
                    </div>
                    <span className="shrink-0 text-lg text-[#5A5C61] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#D01E2E]">→</span>
                  </a>
                </section>
              );
            })()}

            {/* ── 지점 둘러보기 ── */}
            <section className="mt-16 border-t border-[#4A4C50]/30 pt-12">
              <h2 className="mb-6 text-xl font-black" style={{ color: "#8A8D91" }}>
                스트롱복싱 지점 둘러보기
              </h2>

              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ["철산복싱 · 철산동복싱 · 광명복싱", "/branches/cheolsan"],
                  ["개봉복싱 · 고척복싱 · 구로구복싱", "/branches/gaebong"],
                  ["목동복싱 · 오목교복싱 · 양천구복싱", "/branches/mokdong"],
                  ["신정복싱 · 신정동복싱 · 양천구복싱", "/branches/sinjeong"],
                  ["영등포복싱 · 신길동복싱", "/branches/yeongdeungpo"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="rounded-[10px] border border-[#4A4C50]/30 bg-[#141416] px-5 py-4 text-sm font-bold text-[#8A8D91] transition duration-200 hover:border-white/25 hover:text-white"
                  >
                    {label} →
                  </a>
                ))}
              </div>
            </section>

            {/* ── CTA ── */}
            <div
              className="mt-14 p-10 text-center"
              style={{ borderRadius: 16, background: "#141416", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="mb-2 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>STRONG BOXING</p>
              <h2 className="mb-4 text-2xl font-black" style={{ color: "#F5F4F1", letterSpacing: "-0.03em" }}>
                가까운 지점에서 상담 받아보세요
              </h2>
              <p className="mb-8 leading-7" style={{ color: "#8A8D91" }}>
                처음이어도 괜찮습니다. 목적에 맞는 운동 방향을 안내해드립니다.
              </p>
              <a
                href="/reservation"
                className="group inline-flex items-center gap-2 rounded-[10px] bg-[#D01E2E] px-7 py-3.5 font-black text-white transition-all duration-300 hover:bg-[#B71C2B]"
              >
                지점 상담 예약하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
