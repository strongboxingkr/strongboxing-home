"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function HomeHeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void ref.current?.play().catch(() => {});
    }
  }, []);

  function togglePlayback() {
    const video = ref.current;
    if (!video) return;
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  return (
    <div className="relative aspect-video bg-[#141416]">
      <video
        ref={ref}
        className="block h-full w-full object-cover"
        src="/videos/brand/home-hero.mp4?v=4"
        poster="/images/home-hero-poster.webp"
        muted
        playsInline
        preload="metadata"
        aria-label="스트롱복싱 소개 영상"
        onPlaying={() => { setPlaying(true); setShowPoster(false); }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setShowPoster(true); }}
        onError={() => { setPlaying(false); setShowPoster(true); }}
      />
      {showPoster && <img src="/images/home-hero-poster.webp" alt="코치와 회원의 미트 훈련" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? "소개 영상 일시정지" : "소개 영상 재생"}
        className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-[4px] border border-white/30 bg-black/75 text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
