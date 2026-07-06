"use client";

import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-4 transition-all duration-500 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(to top, rgba(14,14,16,0.98) 70%, transparent 100%)",
      }}
    >
      <a
        href="/reservation"
        className="flex items-center justify-center gap-2 w-full rounded-[12px] py-4 text-sm font-black text-white transition-all duration-300 active:scale-[0.98]"
        style={{ background: "#D01E2E" }}
      >
        원데이 클래스 예약하기
        <span>→</span>
      </a>
      <p className="mt-2 text-center text-[11px]" style={{ color: "#5A5C61" }}>
        30,000원 현장결제 · 당일 등록 시 회원권에서 전액 페이백
      </p>
    </div>
  );
}
