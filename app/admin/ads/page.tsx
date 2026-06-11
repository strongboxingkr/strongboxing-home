"use client";

import { useEffect, useState } from "react";

export default function AdsPage() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const res = await fetch("/api/ads-files");
    const data = await res.json();

    if (data.ok) {
      setVideos(data.videos);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    alert("복사 완료!");
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FB7185]">
          ADS LIBRARY
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          광고 영상 라이브러리
        </h1>

        <p className="mb-10 text-zinc-400">
          지점별 폴더에 넣어둔 광고 영상을 한 화면에서 확인하고 복사합니다.
        </p>

        {videos.length === 0 ? (
          <div className="rounded-[30px] border border-white/10 bg-[#171719] p-10 text-center">
            <h2 className="mb-3 text-2xl font-black">등록된 광고 영상이 없습니다</h2>
            <p className="text-zinc-400">
              public/videos/ads/지점폴더 안에 영상을 넣어주세요.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 md:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.url}
                className="overflow-hidden rounded-[30px] border border-white/10 bg-[#171719]"
              >
                <video
                  src={video.url}
                  controls
                  preload="metadata"
                  className="aspect-video w-full bg-black object-cover"
                />

                <div className="p-5">
                  <p className="mb-2 text-xs font-black tracking-[0.2em] text-[#FB7185]">
                    {video.folder}
                  </p>

                  <h2 className="break-all text-lg font-black">
                    {video.file}
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => copy(video.file)}
                      className="rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                    >
                      파일명 복사
                    </button>

                    <button
                      onClick={() => copy(video.url)}
                      className="rounded-full bg-[#FB7185] px-4 py-2 text-sm font-black text-black"
                    >
                      경로 복사
                    </button>

                    <a
                      href={video.url}
                      target="_blank"
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-black"
                    >
                      새창 열기
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}