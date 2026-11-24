"use client";

import { useState, useRef } from "react";
import { trackClipPlay } from "@/lib/gtag";
import VisibleClip from "./VisibleClip";
import { uniqueReels } from "@/lib/unique-reels";

const BRANCHES = ["전체", "목동점", "철산점", "신정점", "개봉점", "영등포점"];
const PAGE_SIZE = 8;

export default function ReelsClient({ reels }: { reels: any[] }) {
  const [selectedBranch, setSelectedBranch] = useState("전체");
  const [page, setPage] = useState(0);

  const filteredReels = (() => {
    const clips = uniqueReels(reels);
    if (selectedBranch !== "전체") {
      return uniqueReels(reels.filter((r) => r.branch_name === selectedBranch));
    }
    const groups: Record<string, any[]> = {};
    for (const r of clips) {
      if (!groups[r.branch_name]) groups[r.branch_name] = [];
      groups[r.branch_name].push(r);
    }
    const queues = Object.values(groups);
    const result: any[] = [];
    let hasMore = true;
    while (hasMore) {
      hasMore = false;
      for (const q of queues) {
        if (q.length > 0) { result.push(q.shift()); hasMore = true; }
      }
    }
    return result;
  })();

  const totalPages = Math.ceil(filteredReels.length / PAGE_SIZE);
  const pageReels = filteredReels.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleBranchChange(branch: string) {
    setSelectedBranch(branch);
    setPage(0);
  }

  return (
    <>
      {/* 지점 필터 */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
        {BRANCHES.map((branch) => (
          <button
            key={branch}
            onClick={() => handleBranchChange(branch)}
            className={`shrink-0 rounded-[4px] border px-4 py-2 text-xs font-black transition ${
              selectedBranch === branch
                ? "border-[#D01E2E] bg-[#D01E2E] text-white"
                : "border-white/10 bg-[#1A1A1C] text-[#8A8D91] hover:border-white/30"
            }`}
          >
            {branch}
          </button>
        ))}
      </div>


      {/* 모바일 (sm 미만): 가로 스냅 */}
      <div className="sm:hidden overflow-x-auto pb-3" style={{ scrollSnapType: "x mandatory" }}>
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {filteredReels.map((reel) => (
            <div key={reel.id} style={{ scrollSnapAlign: "start", width: 180 }}>
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>
      </div>

      {/* PC (sm 이상): 4열 그리드 + 페이지네이션 */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {pageReels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-30"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8A8D91" }}
              aria-label="이전"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="h-2 w-2 rounded-full transition"
                style={{ background: i === page ? "#D01E2E" : "rgba(255,255,255,0.2)" }}
                aria-label={`${i + 1}페이지`}
              />
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-30"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "#8A8D91" }}
              aria-label="다음"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function ReelCard({ reel }: { reel: any }) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [hasError, setHasError] = useState(false);
  const playedRef = useRef(false);

  return (
    <figure className="m-0 w-full overflow-hidden rounded-[4px] border border-white/10 bg-[#171719]">
      {hasError ? (
        <div
          className={`flex flex-col items-center justify-center gap-2 ${isPortrait ? "aspect-[9/16]" : "aspect-square"}`}
          style={{ background: "#111113" }}
        >
            <p className="text-center text-xs" style={{ color: "#555" }}>영상을 불러올 수 없습니다</p>
        </div>
      ) : (
        <VisibleClip
          src={reel.video_url}
          title={reel.title}
          aria-label={reel.aria_label || reel.title}
          poster={reel.poster}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setIsPortrait(v.videoHeight > v.videoWidth);
          }}
          onError={() => setHasError(true)}
          onPlay={() => {
            if (playedRef.current) return;
            playedRef.current = true;
            trackClipPlay({
              branch_name: reel.branch_name,
              clip_title: reel.title,
              clip_id: reel.id,
              page_path: window.location.pathname,
              placement: "home",
            });
          }}
          className={`w-full bg-[#0E0E10] object-cover ${isPortrait ? "aspect-[9/16]" : "aspect-square"}`}
        />
      )}
      <figcaption className="border-t border-white/10 px-3 py-2.5">
        <p className="text-xs text-[#B5B5BC]">{reel.branch_name}</p>
        <p className="mt-0.5 break-keep text-sm font-semibold leading-5 text-[#F5F4F1]">{reel.title}</p>
      </figcaption>
    </figure>
  );
}
