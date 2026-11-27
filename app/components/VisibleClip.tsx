"use client";

import { browserCompatibleClip } from "@/lib/browser-compatible-clip";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

export default function VisibleClip({ src, onPlay, onError, fallbackSrc, ...props }: ComponentPropsWithoutRef<"video"> & { fallbackSrc?: string }) {
  const [retry, setRetry] = useState(0);
  const [failure, setFailure] = useState<{ source: typeof src; attempt: number }>();
  const failed = failure?.source === src && failure?.attempt === retry;
  const chosenSource = retry > 0 && fallbackSrc ? fallbackSrc : src;
  const ref = useRef<HTMLVideoElement>(null);

  const automaticPlay = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.25) {
        if (!video.paused) return;
        video.muted = true;
        automaticPlay.current = true;
        void video.play().catch(() => { automaticPlay.current = false; });
      } else {
        video.pause();
      }
    }, { threshold: 0.25 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [chosenSource, failed, retry]);

  if (failed && props.poster) {
    return <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.poster} alt="" className={props.className} />
      <button type="button" onClick={() => setRetry((attempt) => attempt + 1)}
        className="absolute inset-x-2 bottom-2 min-h-11 rounded bg-black/80 px-2 text-xs font-bold text-white">
        {retry === 0 && fallbackSrc ? "▶ 대체 영상 재생" : "▶ 다시 재생"}
      </button>
    </div>;
  }

  return <video {...props} key={retry} ref={ref} src={typeof chosenSource === "string" ? browserCompatibleClip(chosenSource) : chosenSource}
    onError={(event) => { setFailure({ source: src, attempt: retry }); onError?.(event); }} muted playsInline controls loop preload="none" onPlay={(event) => {
    if (!automaticPlay.current) onPlay?.(event);
    automaticPlay.current = false;
  }} />;
}
