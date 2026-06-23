import { db } from "@/lib/db";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const siteUrl = "https://strongboxing.kr";

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

  const imageMatch = String(post.content || "").match(/!\[.*?\]\((.*?)\)/);
  const imageUrl = imageMatch?.[1]
    ? `${siteUrl}${imageMatch[1]}`
    : `${siteUrl}/og.png`;

  return {
    title: `${post.title} | 스트롱복싱`,
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

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black">글을 찾을 수 없습니다.</h1>
          <a href="/blog" className="mt-6 inline-block text-[#FC5230]">
            블로그로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  const imageMatch = String(post.content || "").match(/!\[.*?\]\((.*?)\)/);
  const imageUrl = imageMatch?.[1] ? `${siteUrl}${imageMatch[1]}` : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: "스트롱복싱",
    },
    publisher: {
      "@type": "Organization",
      name: "스트롱복싱",
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.created_at,
    dateModified: post.created_at,
    image: imageUrl ? [imageUrl] : undefined,
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      <article>
        <section className="bg-[radial-gradient(circle_at_80%_20%,rgba(252,82,48,.35),transparent_35%),linear-gradient(135deg,#070707,#151515)] px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <a href="/blog" className="mb-10 inline-block text-zinc-400">
              ← 블로그로
            </a>

            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black">
                {post.branch_name}
              </span>
              <span className="text-sm text-zinc-400">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
              {post.title}
            </h1>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-p:leading-9 prose-p:text-zinc-200 prose-img:rounded-[28px] prose-img:border prose-img:border-white/10 prose-img:w-full">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{String(post.content || "")}</ReactMarkdown>
            </div>

            <section className="mt-16 border-t border-white/10 pt-12">
            <h2 className="mb-6 text-3xl font-black">
              스트롱복싱 지점 둘러보기
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
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
                  className="rounded-2xl border border-white/10 bg-[#171719] px-5 py-4 font-black transition hover:border-[#FC5230]"
                >
                  {label} 바로가기 →
                </a>
              ))}
            </div>
          </section>

            <div className="mt-14 rounded-[30px] bg-[#FC5230] p-8 text-center">
              <h2 className="mb-4 text-3xl font-black">
                가까운 지점에서 상담 받아보세요
              </h2>
              <p className="mb-6 leading-7">
                처음이어도 괜찮습니다. 목적에 맞는 운동 방향을 안내해드립니다.
              </p>
              <a
                href="/reservation"
                className="inline-flex rounded-full bg-black px-7 py-4 font-black text-white"
              >
                지점 확인하기
              </a>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}