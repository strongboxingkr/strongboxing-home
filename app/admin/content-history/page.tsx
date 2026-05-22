import { db } from "@/lib/db";

export default async function ContentHistoryPage() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM content_packs
    ORDER BY created_at DESC
  `);

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <a
          href="/admin"
          className="mb-8 inline-block text-zinc-400"
        >
          ← 관리자 메인으로
        </a>

        <p className="mb-4 text-sm font-black tracking-[0.32em] text-[#FC5230]">
          CONTENT HISTORY
        </p>

        <h1 className="mb-10 text-5xl font-black tracking-[-0.06em]">
          콘텐츠 생성 기록
        </h1>

        <div className="space-y-10">
          {rows.map((item: any) => {
            const results = JSON.parse(item.results || "[]");
            const captions = JSON.parse(item.captions || "{}");

            return (
              <section
                key={item.id}
                className="rounded-[36px] border border-white/10 bg-[#171719] p-7"
              >
                <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex rounded-full bg-[#FC5230]/15 px-4 py-2 text-sm font-black text-[#FC5230]">
                      {item.branch}
                    </div>

                    <h2 className="text-3xl font-black">
                      {item.title}
                    </h2>
                  </div>

                  <p className="text-zinc-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {results.map((image: any, index: number) => (
                    <div key={index} className="space-y-4">
                      <img
                        src={image.feed}
                        alt=""
                        className="aspect-square w-full rounded-2xl object-cover"
                      />

                      <img
                        src={image.reels}
                        alt=""
                        className="aspect-[9/16] w-full rounded-2xl object-cover"
                      />

                      <img
                        src={image.blog}
                        alt=""
                        className="aspect-[1200/630] w-full rounded-2xl object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="rounded-[28px] bg-black/30 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-black">
                        인스타 캡션
                      </h3>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            captions.instagram || ""
                          );

                          alert("복사 완료!");
                        }}
                        className="rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black"
                      >
                        복사
                      </button>
                    </div>

                    <pre className="whitespace-pre-wrap leading-7 text-zinc-300">
                      {captions.instagram}
                    </pre>
                  </div>

                  <div className="rounded-[28px] bg-black/30 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-black">
                        블로그 초안
                      </h3>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            captions.blog || ""
                          );

                          alert("복사 완료!");
                        }}
                        className="rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black"
                      >
                        복사
                      </button>
                    </div>

                    <pre className="whitespace-pre-wrap leading-7 text-zinc-300">
                      {captions.blog}
                    </pre>
                  </div>
                </div>

                {captions?.reels?.length > 0 && (
                  <div className="mt-6 rounded-[28px] bg-black/30 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-black">
                        릴스 자막 문구
                      </h3>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            captions.reels.join("\n")
                          );

                          alert("복사 완료!");
                        }}
                        className="rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black"
                      >
                        복사
                      </button>
                    </div>

                    <div className="space-y-3">
                      {captions.reels.map(
                        (text: string, index: number) => (
                          <div
                            key={index}
                            className="rounded-2xl bg-white/5 p-4 leading-7 text-zinc-300"
                          >
                            {index + 1}. {text}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}