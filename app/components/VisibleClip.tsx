"use client";

import { browserCompatibleClip } from "@/lib/browser-compatible-clip";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

export default function VisibleClip({ src, onPlay, ...props }: ComponentPropsWithoutRef<"video">) {
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
  }, [src]);

  return <video {...props} ref={ref} src={typeof src === "string" ? browserCompatibleClip(src) : src} muted playsInline controls loop preload="none" onPlay={(event) => {
    if (!automaticPlay.current) onPlay?.(event);
    automaticPlay.current = false;
  }} />;
}
