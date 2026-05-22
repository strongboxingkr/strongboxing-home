"use client";

import { useState } from "react";

export default function ContentPackPage() {
  const [branch, setBranch] = useState("목동점");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [target, setTarget] = useState("입문자");
  const [tone, setTone] = useState("감성");
  const [style, setStyle] = useState("STRONG_CHARCOAL");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!files || files.length === 0) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();

    formData.append("branch", branch);
    formData.append("title", title || "content");

    formData.append("target", target);
    formData.append("tone", tone);
    formData.append("style", style);

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    const res = await fetch("/api/content-pack", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (!data.ok) {
      alert(data.message || "생성 실패");
      return;
    }

    setResult(data);
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인으로
        </a>

        <p className="mb-4 text-sm font-black tracking-[0.32em] text-[#FC5230]">
          CONTENT AUTOMATION
        </p>

        <h1 className="mb-5 text-5xl font-black tracking-[-0.06em]">
          콘텐츠팩 생성기
        </h1>

        <p className="mb-10 text-lg leading-8 text-zinc-400">
          사진을 업로드하면 인스타 피드, 릴스 커버, 블로그용 이미지와
          AI 콘텐츠가 자동 생성됩니다.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-white/10 bg-[#171719] p-7"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold">지점</label>

              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
              >
                <option>목동점</option>
                <option>신정점</option>
                <option>개봉점</option>
                <option>철산점</option>
                <option>영등포점</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                콘텐츠 제목
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 다이어트 복싱"
                className="w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">
                타겟
              </label>

              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              >
                <option>입문자</option>
                <option>다이어트</option>
                <option>여성회원</option>
                <option>직장인</option>
                <option>고강도 운동</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                콘텐츠 톤
              </label>

              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              >
                <option>감성</option>
                <option>강렬함</option>
                <option>친근함</option>
                <option>프리미엄</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">
                템플릿 스타일
              </label>

              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              >
                <option>STRONG_CHARCOAL</option>
                <option>URBAN_PREMIUM</option>
                <option>FIGHT_CLUB</option>
                <option>WOMEN_FIT</option>
                <option>BLACK</option>
                <option>ORANGE</option>
                <option>PREMIUM</option>
                <option>MINIMAL</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold">
                이미지 여러 장 선택
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              />

              <p className="mt-2 text-sm text-zinc-500">
                인스타 피드 / 릴스 커버 / 블로그 이미지 자동 생성
              </p>
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-7 w-full rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black disabled:opacity-50"
          >
            {loading ? "생성 중..." : "콘텐츠팩 생성하기"}
          </button>
        </form>

        {result?.ok && (
          <section className="mt-12">
            <h2 className="mb-6 text-3xl font-black">
              생성 완료
            </h2>

            <div className="space-y-8">
              {result.results.map((item: any, index: number) => (
                <div
                  key={index}
                  className="rounded-[32px] border border-white/10 bg-[#171719] p-6"
                >
                  <h3 className="mb-5 text-xl font-black">
                    이미지 {index + 1}
                  </h3>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <img
                        src={item.feed}
                        alt="인스타 피드"
                        className="aspect-square w-full rounded-2xl object-cover"
                      />

                      <a
                        href={item.feed}
                        target="_blank"
                        className="mt-3 inline-block text-[#FC5230]"
                      >
                        인스타 피드 열기
                      </a>
                    </div>

                    <div>
                      <img
                        src={item.reels}
                        alt="릴스 커버"
                        className="aspect-[9/16] w-full rounded-2xl object-cover"
                      />

                      <a
                        href={item.reels}
                        target="_blank"
                        className="mt-3 inline-block text-[#FC5230]"
                      >
                        릴스 커버 열기
                      </a>
                    </div>

                    <div>
                      <img
                        src={item.blog}
                        alt="블로그 이미지"
                        className="aspect-[1200/630] w-full rounded-2xl object-cover"
                      />

                      <a
                        href={item.blog}
                        target="_blank"
                        className="mt-3 inline-block text-[#FC5230]"
                      >
                        블로그 이미지 열기
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {result?.captions && (
              <section className="mt-12 space-y-6">
                <div className="rounded-[32px] border border-white/10 bg-[#171719] p-7">
                 {result?.captions?.analysis && (
                    <div className="rounded-[32px] border border-white/10 bg-[#171719] p-7">
                      <h2 className="mb-4 text-2xl font-black">
                        AI 사진 분석
                      </h2>

                      <p className="leading-8 text-zinc-300">
                        {result.captions.analysis}
                      </p>
                    </div>
                  )}
                 
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-black">
                      인스타 캡션
                    </h2>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          result.captions.instagram
                        );

                        alert("인스타 캡션 복사 완료!");
                      }}
                      className="rounded-full bg-[#FC5230] px-5 py-2 text-sm font-black"
                    >
                      복사
                    </button>
                  </div>

                  <pre className="whitespace-pre-wrap leading-7 text-zinc-300">
                    {result.captions.instagram}
                  </pre>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-[#171719] p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-black">
                      네이버 블로그 초안
                    </h2>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          result.captions.blog
                        );

                        alert("블로그 초안 복사 완료!");
                      }}
                      className="rounded-full bg-[#FC5230] px-5 py-2 text-sm font-black"
                    >
                      복사
                    </button>
                  </div>

                  <pre className="whitespace-pre-wrap leading-7 text-zinc-300">
                    {result.captions.blog}
                  </pre>
                </div>

                {result?.captions?.reels && (
                  <div className="rounded-[32px] border border-white/10 bg-[#171719] p-7">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-2xl font-black">
                        릴스 자막 문구
                      </h2>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            Array.isArray(result.captions.reels)
                              ? result.captions.reels.join("\n")
                              : result.captions.reels
                          );

                          alert("릴스 문구 복사 완료!");
                        }}
                        className="rounded-full bg-[#FC5230] px-5 py-2 text-sm font-black"
                      >
                        복사
                      </button>
                    </div>

                    <div className="space-y-3 text-zinc-300">
                      {Array.isArray(result.captions.reels) ? (
                        result.captions.reels.map(
                          (text: string, index: number) => (
                            <p
                              key={index}
                              className="rounded-2xl bg-black/40 p-4 leading-7"
                            >
                              {index + 1}. {text}
                            </p>
                          )
                        )
                      ) : (
                        <pre className="whitespace-pre-wrap leading-7">
                          {result.captions.reels}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}
          </section>
        )}
      </div>
    </main>
  );
}