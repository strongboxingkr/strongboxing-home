"use client";

import { useRef } from "react";
import { trackClipPlay } from "@/lib/gtag";

interface Reel {
  id: number;
  branch_name: string;
  title: string;
  aria_label: string;
  video_url: string;
  is_muted: number;
}

export default function BranchReelCard({ reel }: { reel: Reel }) {
  const playedRef = useRef(false);
  const isAutoPlay = Number(reel.is_muted) === 1;

  return (
    <figure
      className="group shrink-0 w-[80vw] sm:w-[260px] overflow-hidden rounded-[12px] border border-[#4A4C50]/30 bg-[#1A1A1C] transition duration-300 hover:-translate-y-1 hover:border-[#4A4C50]/60"
      style={{ margin: 0 }}
    >
      <div className="overflow-hidden">
        <video
          src={reel.video_url}
          title={reel.title}
          aria-label={reel.aria_label || reel.title}
          controls={!isAutoPlay}
          muted
          autoPlay={isAutoPlay}
          loop={isAutoPlay}
          playsInline
          preload="metadata"
          className="w-full bg-[#0E0E10] object-cover aspect-[9/16] transition duration-500 group-hover:scale-[1.03]"
          onPlay={() => {
            if (isAutoPlay || playedRef.current) return;
            playedRef.current = true;
            trackClipPlay({
              branch_name: reel.branch_name,
              clip_title: reel.title,
              clip_id: reel.id,
              page_path: window.location.pathname,
              placement: "branch",
            });
          }}
        />
      </div>
      {reel.title && (
        <figcaption className="px-4 py-3">
          <p className="text-sm font-bold text-[#F5F4F1] line-clamp-1">{reel.title}</p>
        </figcaption>
      )}
    </figure>
  );
}
