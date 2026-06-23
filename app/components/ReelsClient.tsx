"use client";

import { useState } from "react";

const branches = ["전체", "목동점", "철산점", "신정점", "개봉점", "영등포점"];

export default function ReelsClient({ reels }: { reels: any[] }) {
  const [selectedBranch, setSelectedBranch] = useState("전체");

  const filteredReels =
    selectedBranch === "전체"
      ? reels
      : reels.filter((reel) => reel.branch_name === selectedBranch);

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
            className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition ${
              selectedBranch === branch
                ? "border-[#FC5230] bg-[#FC5230] text-white"
                : "border-white/10 bg-[#202126] text-zinc-300 hover:border-[#FC5230]"
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
    <div className={`shrink-0 overflow-hidden rounded-2xl border border-[#FC5230]/20 bg-[#202126] ${isPortrait ? "w-[160px]" : "w-[240px]"}`}>
      <video
        src={reel.video_url}
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
        className={`w-full bg-black object-cover ${isPortrait ? "aspect-[9/16]" : "aspect-square"}`}
      />
      <div className="px-3 py-2">
        <p className="text-[10px] font-black tracking-[0.2em] text-[#FC5230]">{reel.branch_name}</p>
        <p className="text-xs font-bold text-white">{reel.title}</p>
      </div>
    </div>
  );
}
