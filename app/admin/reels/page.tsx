"use client";

import { useEffect, useState } from "react";

export default function ReelsPage() {
  const [branchName, setBranchName] = useState("철산점");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [reels, setReels] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoFileName, setVideoFileName] = useState("");
  const [videoFiles, setVideoFiles] = useState<string[]>([]);

  useEffect(() => {
    loadReels();
    loadVideoFiles(branchName);
  }, []);

  async function loadReels() {
    const res = await fetch("/api/reels");
    const data = await res.json();
    if (data.ok) setReels(data.reels);
  }

  async function loadVideoFiles(branch: string) {
    const res = await fetch(`/api/reels-files?branch=${encodeURIComponent(branch)}`);
    const data = await res.json();

    if (data.ok) {
        setVideoFiles(data.files);
    }
  }

  async function uploadVideo(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/reels-upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!data.ok) {
      alert(data.message || "영상 업로드 실패");
      return;
    }

    setVideoUrl(data.url);
    alert("영상 업로드 완료!");
  }

  async function saveReel() {
    const branchFolderMap: any = {
        철산점: "cheolsan",
        목동점: "mokdong",
        신정점: "sinjeong",
        개봉점: "gaebong",
        영등포점: "yeongdeungpo",
    };

    const folder = branchFolderMap[branchName];

    const finalVideoUrl =
        videoUrl || (videoFileName ? `/videos/${folder}/${videoFileName}` : "");

    if (!title || !finalVideoUrl) {
        alert("제목과 영상을 넣어줘.");
        return;
    }

    setSaving(true);

    const res = await fetch("/api/reels", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        branch_name: branchName,
        title,
        video_url: finalVideoUrl,
        }),
    });

    const data = await res.json();
    setSaving(false);

    if (!data.ok) {
        alert("저장 실패");
        return;
    }

    alert("저장 완료!");
    setTitle("");
    setVideoUrl("");
    setVideoFileName("");
    loadReels();
    }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인으로
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">
        STRONG CLIP
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
        STRONG CLIP
        </h1>

        <p className="mb-10 text-zinc-400">
        홈페이지 메인 영상 관리
        </p>

        <section className="space-y-5 rounded-[30px] border border-white/10 bg-[#171719] p-6">
          <select
            value={branchName}
            onChange={(e) => {
                setBranchName(e.target.value);
                loadVideoFiles(e.target.value);
                setVideoFileName("");
                setVideoUrl("");
            }}
            className="w-full rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>철산점</option>
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>영등포점</option>
          </select>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="짧은 제목 예: 철산점 체력운동 시간"
            className="w-full rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            type="file"
            accept="video/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadVideo(file);
              e.target.value = "";
            }}
            className="w-full rounded-2xl border border-white/10 bg-black p-4"
          />

          <select
            value={videoFileName}
            onChange={(e) => {
                setVideoFileName(e.target.value);
                setVideoUrl("");
            }}
            className="w-full rounded-2xl border border-white/10 bg-black p-4"
            >
            <option value="">서버에 넣어둔 영상 선택</option>
            {videoFiles.map((file) => (
                <option key={file} value={file}>
                {file}
                </option>
            ))}
            </select>

            <p className="text-sm text-zinc-500">
            선택한 지점의 public/videos 폴더에 있는 영상 목록입니다.
            </p>

          {uploading && (
            <p className="font-bold text-[#FC5230]">영상 업로드 중...</p>
          )}

          {videoUrl && (
            <video src={videoUrl} controls className="max-h-[400px] w-full rounded-2xl" />
          )}

          <button
            onClick={saveReel}
            disabled={saving}
            className="w-full rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black disabled:opacity-50"
          >
            {saving ? "저장 중..." : "홈페이지에 추가"}
          </button>
        </section>

        <section className="mt-14">
          <h2 className="mb-5 text-3xl font-black">등록된 영상</h2>

          <div className="grid gap-5 md:grid-cols-3">
            {reels.map((reel) => (
              <div
                key={reel.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#202126]"
              >
                <video src={reel.video_url} controls className="w-full" />

                <div className="p-5">
                  <p className="text-sm text-[#FC5230]">{reel.branch_name}</p>
                  <p className="mt-1 font-bold">{reel.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}