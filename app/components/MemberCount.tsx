"use client";

import { useEffect, useRef } from "react";

const duration = 600;
const format = new Intl.NumberFormat("ko-KR");

export default function MemberCount({ total }: { total: number }) {
  const counter = useRef<HTMLSpanElement>(null);
  const finalText = format.format(total) + "명";

  useEffect(() => {
    const element = counter.current;
    if (!element) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let frame = 0;
    let startedAt: number | undefined;
    const finish = () => {
      cancelAnimationFrame(frame);
      element.textContent = finalText;
    };
    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = format.format(Math.round(total * eased)) + "명";
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!motion.matches) frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    motion.addEventListener("change", finish);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", finish);
      finish();
    };
  }, [finalText, total]);

  return (
    <span className="relative inline-block tabular-nums">
      <span className="invisible" aria-hidden="true">{finalText}</span>
      <span ref={counter} className="absolute inset-0 text-right" aria-hidden="true">{finalText}</span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
