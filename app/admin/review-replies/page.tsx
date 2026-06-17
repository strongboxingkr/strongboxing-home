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
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">

        <h1 className="mb-10 text-5xl font-black">
          리뷰 답글 생성기
        </h1>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="mb-5 w-full rounded-2xl bg-[#171719] p-4"
        >
          <option>목동점</option>
          <option>철산점</option>
        </select>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="네이버 리뷰 붙여넣기"
          className="h-40 w-full rounded-2xl bg-[#171719] p-5"
        />

        <button
          onClick={generateReply}
          className="mt-5 rounded-full bg-[#FC5230] px-8 py-4 font-black"
        >
          답글 생성
        </button>

        {reply && (
          <textarea
            readOnly
            value={reply}
            className="mt-8 h-48 w-full rounded-2xl bg-[#171719] p-5"
          />
        )}
      </div>
    </main>
  );
}