"use client";

import { useState } from "react";

const branches = ["전체", "목동점", "철산점", "신정점", "개봉점", "영등포점"];

export default function ReelsClient({ reels }: { reels: any[] }) {
  const [selectedBranch, setSelectedBranch] = useState("전체");

  const filteredReels = (() => {
    if (selectedBranch !== "전체") {
      return reels.filter((reel) => reel.branch_name === selectedBranch);
    }
    // 전체: 지점별로 그룹화 후 라운드로빈으로 섞기
    const groups: Record<string, any[]> = {};
    for (const reel of reels) {
      if (!groups[reel.branch_name]) groups[reel.branch_name] = [];
      groups[reel.branch_name].push(reel);
    }
    const queues = Object.values(groups);
    const result: any[] = [];
    let hasMore = true;
    while (hasMore) {
      hasMore = false;
      for (const q of queues) {
        if (q.length > 0) {
          result.push(q.shift());
          hasMore = true;
        }
      }
    }
    return result;
  })();

  const rows = [
    filteredReels.filter((_, i) => i % 2 === 0),
    filteredReels.filter((_, i) => i % 2 === 1),
  ];

  return (
    <>
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`shrink-0 rounded-[10px] border px-5 py-2.5 text-sm font-black transition ${
              selectedBranch === branch
                ? "border-[#D01E2E] bg-[#D01E2E] text-white"
                : "border-white/10 bg-[#1A1A1C] text-[#8A8D91] hover:border-white/30"
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col gap-4">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-4">
              {row.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ReelCard({ reel }: { reel: any }) {
  const [isPortrait, setIsPortrait] = useState(false);

  return (
    <div className={`shrink-0 overflow-hidden rounded-[10px] border border-white/10 bg-[#1A1A1C] ${isPortrait ? "w-[160px]" : "w-[240px]"}`}>
      <video
        src={reel.video_url}
        title={reel.title}
        aria-label={reel.aria_label || reel.title}
        controls={Number(reel.is_muted) !== 1}
        muted
        autoPlay={Number(reel.is_muted) === 1}
        loop={Number(reel.is_muted) === 1}
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setIsPortrait(v.videoHeight > v.videoWidth);
        }}
        className={`w-full bg-[#0E0E10] object-cover ${isPortrait ? "aspect-[9/16]" : "aspect-square"}`}
      />
      <div className="px-3 py-2">
        <p className="text-[10px] font-black tracking-[0.2em] text-[#D01E2E]">{reel.branch_name}</p>
        <p className="text-xs font-bold text-white">{reel.title}</p>
      </div>
    </div>
  );
}
