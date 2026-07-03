"use client";

import { useState } from "react";

const branches = ["전체", "개봉점", "신정점", "목동점", "철산점"];

export default function NaverReviewsClient({ reviews }: { reviews: any[] }) {
  const [selectedBranch, setSelectedBranch] = useState("전체");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered =
    selectedBranch === "전체"
      ? reviews
      : reviews.filter((review) => review.branch_name === selectedBranch);

  const visibleReviews = filtered.slice(0, visibleCount);

  function changeBranch(branch: string) {
    setSelectedBranch(branch);
    setVisibleCount(6);
  }

  return (
    <>
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => changeBranch(branch)}
            className={`shrink-0 rounded-[10px] border px-5 py-2.5 text-sm font-black transition ${
              selectedBranch === branch
                ? "border-[#22C55E] bg-[#22C55E] text-black"
                : "border-white/10 bg-[#141416] text-[#8A8D91] hover:border-[#22C55E]"
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-[14px] border border-[#22C55E]/15 bg-[#141416] p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-[#22C55E]">
                {review.branch_name}
              </p>

              <p className="text-sm text-[#4A4C50]">
                {review.review_date || ""}
              </p>
            </div>

            <p className="text-sm font-black tracking-[0.2em] text-[#22C55E]">
              NAVER REVIEW
            </p>

            <p className="mt-3 text-sm text-[#8A8D91]">
              {review.reviewer_name || "네이버 리뷰"}
            </p>

            <p className="mt-4 line-clamp-6 whitespace-pre-wrap leading-7 text-[#8A8D91]">
              {review.content}
            </p>

            {review.image_url && (
              <img
                src={review.image_url}
                alt="네이버 리뷰 캡처"
                className="mt-5 h-48 w-full rounded-2xl border border-white/10 object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {filtered.length > visibleCount && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="rounded-[10px] border border-[#22C55E]/40 px-8 py-3.5 font-black text-[#22C55E] transition hover:bg-[#22C55E]/5"
          >
            리뷰 더보기
          </button>
        </div>
      )}
    </>
  );
}