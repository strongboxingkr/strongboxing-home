import { db } from "@/lib/db";

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

  const paragraphs = String(post.content || "")
    .split("\n")
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
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
            <div className="space-y-7 text-lg leading-9 text-zinc-200">
              {paragraphs.map((paragraph: string) => {
                const imageMatch = paragraph.match(/^!\[(.*?)\]\((.*?)\)$/);

                if (imageMatch) {
                    return (
                    <img
                        key={paragraph}
                        src={imageMatch[2]}
                        alt={imageMatch[1]}
                        className="w-full rounded-[28px] border border-white/10"
                    />
                    );
                }

                return <p key={paragraph}>{paragraph}</p>;
                })}
            </div>

            <div className="mt-14 rounded-[30px] bg-[#FC5230] p-8 text-center">
              <h2 className="mb-4 text-3xl font-black">
                가까운 지점에서 상담 받아보세요
              </h2>
              <p className="mb-6 leading-7">
                처음이어도 괜찮습니다. 목적에 맞는 운동 방향을 안내해드립니다.
              </p>
              <a
                href="/#branch"
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