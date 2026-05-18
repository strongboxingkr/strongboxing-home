import { db } from "@/lib/db";

export default async function BlogPage() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_posts
    ORDER BY created_at DESC
  `);

  const posts = rows;

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#FC5230]">
            STRONG BOXING BLOG
          </p>

          <h1 className="mb-6 text-5xl font-black tracking-[-0.06em] md:text-8xl">
            소식 & 후기
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            스트롱복싱의 운동 이야기, 후기, 다이어트 정보들을 확인해보세요.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {posts.map((post: any) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rounded-[30px] border border-white/10 bg-[#171719] p-8 transition hover:border-[#FC5230]"
            >
              <div className="mb-4 flex items-center gap-3">
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

              <p className="leading-7 text-zinc-300">
                {post.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}