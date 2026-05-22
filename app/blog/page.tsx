import { db } from "@/lib/db";

function getFirstImage(content: string) {
  const match = String(content || "").match(/!\[.*?\]\((.*?)\)/);
  return match?.[1] || null;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ branch?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedBranch = params.branch || "전체";

  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_posts
    ORDER BY created_at DESC
  `);

  const posts = rows;

  const branches = ["전체", "목동점", "신정점", "개봉점", "철산점", "영등포점"];

  const filteredPosts =
    selectedBranch === "전체"
      ? posts
      : posts.filter((post: any) => post.branch_name === selectedBranch);

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(252,82,48,.28),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <a href="/" className="mb-10 inline-block text-zinc-400">
            ← 메인으로
          </a>

          <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#FC5230]">
            STRONG BOXING BLOG
          </p>

          <h1 className="mb-6 text-5xl font-black tracking-[-0.06em] md:text-8xl">
            소식 & 후기
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            스트롱복싱의 지점별 소식, 운동 후기, 다이어트 정보들을 확인해보세요.
          </p>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
          {branches.map((branch) => (
            <a
              key={branch}
              href={branch === "전체" ? "/blog" : `/blog?branch=${branch}`}
              className={`rounded-full border px-5 py-3 text-sm font-black transition ${
                selectedBranch === branch
                  ? "border-[#FC5230] bg-[#FC5230] text-white"
                  : "border-white/10 bg-[#171719] text-zinc-300 hover:border-[#FC5230]"
              }`}
            >
              {branch}
            </a>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {filteredPosts.length === 0 ? (
            <div className="rounded-[30px] border border-white/10 bg-[#171719] p-10 text-center">
              <h2 className="mb-3 text-2xl font-black">아직 글이 없습니다</h2>
              <p className="text-zinc-400">
                선택한 지점의 소식이 곧 업데이트될 예정입니다.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post: any) => {
                const image = getFirstImage(post.content);

                return (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-[34px] border border-white/10 bg-[#171719] transition hover:-translate-y-1 hover:border-[#FC5230]"
                  >
                    {image && (
                      <div className="h-[260px] overflow-hidden">
                        <img
                          src={image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black">
                          {post.branch_name}
                        </span>

                        <span className="text-sm text-zinc-400">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="mb-4 text-3xl font-black leading-tight tracking-[-0.04em]">
                        {post.title}
                      </h2>

                      <p className="line-clamp-3 leading-7 text-zinc-300">
                        {post.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}