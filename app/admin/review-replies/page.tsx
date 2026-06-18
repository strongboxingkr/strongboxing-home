"use client";

import { useState } from "react";

export default function ReviewRepliesPage() {
  const [branch, setBranch] = useState("목동점");
  const [review, setReview] = useState("");
  const [reply, setReply] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function generateReply() {
    const res = await fetch("/api/review-replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch,
        review,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("생성 실패");
      return;
    }

    setReply(data.reply);
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "blog");

    const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!data.ok) {
        alert("이미지 업로드 실패");
        return;
    }

    setImageUrl(data.url);
    }

    async function saveReview() {
        setSaving(true);

        const res = await fetch("/api/naver-reviews", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            branch_name: branch,
            reviewer_name: reviewerName,
            rating: 5,
            content: review,
            image_url: imageUrl,
            review_date: reviewDate,
            is_active: isActive,
            }),
        });

        const data = await res.json();
        setSaving(false);

        if (!data.ok) {
            alert("저장 실패");
            return;
        }

        alert("홈페이지 리뷰 저장 완료!");
        }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-10 text-5xl font-black">
          리뷰 답글 생성기
        </h1>

        <p className="mb-10 text-zinc-500">
        목동점 · 철산점 네이버 리뷰 답글 생성
        </p>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="mb-5 w-full rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <option>목동점</option>
          <option>철산점</option>
        </select>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="네이버 리뷰 붙여넣기"
          className="h-40 w-full rounded-2xl border border-zinc-200 bg-white p-5"
        />

        <button
          onClick={generateReply}
          className="mt-5 rounded-full bg-[#FC5230] px-8 py-4 font-black"
        >
          답글 생성
        </button>

        {reply && (
        <>
            <textarea
            readOnly
            value={reply}
            className="mt-8 h-48 w-full rounded-2xl border border-zinc-200 bg-white p-5"
            />

            <div className="mt-5 flex flex-wrap gap-3">
            <button
                className="rounded-full border border-green-300 bg-green-50 px-5 py-3 font-black text-green-700"
            >
                👍 마음에 듦
            </button>

            <button
                onClick={generateReply}
                className="rounded-full border border-orange-300 bg-orange-50 px-5 py-3 font-black text-orange-700"
            >
                🔄 다시 생성
            </button>

            <button
                onClick={() => {
                navigator.clipboard.writeText(reply);
                alert("복사 완료!");
                }}
                className="rounded-full border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700"
            >
                📋 복사하기
            </button>
            </div>
        </>
        )}

        <hr className="my-14 border-zinc-200" />

            <div className="rounded-[30px] border border-zinc-200 bg-white p-8">
            <h2 className="text-3xl font-black">
                홈페이지 리뷰 등록
            </h2>

            <p className="mt-2 text-zinc-500">
                답글 작성 후 바로 홈페이지 리뷰로 저장할 수 있습니다.
            </p>

           <div className="mt-8 grid gap-5 md:grid-cols-2">
            <input
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="리뷰어 이름 예: 김○○"
                className="rounded-2xl border border-zinc-200 bg-white p-4"
            />

            <input
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                placeholder="리뷰 날짜 예: 2026.06"
                className="rounded-2xl border border-zinc-200 bg-white p-4"
            />
            </div>

            <textarea
            rows={6}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="네이버 리뷰 내용"
            className="mt-5 w-full rounded-2xl border border-zinc-200 bg-white p-5"
            />

            <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
                e.target.value = "";
            }}
            className="mt-5 w-full rounded-2xl border border-zinc-200 bg-white p-4"
            />

            {imageUrl && (
            <img
                src={imageUrl}
                alt="리뷰 캡처"
                className="mt-5 max-h-[300px] rounded-2xl border border-zinc-200 object-contain"
            />
            )}

            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-zinc-200 p-5 font-bold">
            <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
            />
            홈페이지 노출 승인
            </label>

            <button
            onClick={saveReview}
            disabled={saving}
            className="mt-6 w-full rounded-full bg-[#22C55E] px-8 py-5 text-lg font-black text-white disabled:opacity-50"
            >
            {saving ? "저장 중..." : "홈페이지 리뷰 저장"}
            </button>
            </div>
      </div>
    </main>
  );
}