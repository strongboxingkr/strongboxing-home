"use client";

import { useState } from "react";

export default function ReviewRepliesPage() {
  const [branch, setBranch] = useState("목동점");
  const [review, setReview] = useState("");
  const [reply, setReply] = useState("");

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
      </div>
    </main>
  );
}