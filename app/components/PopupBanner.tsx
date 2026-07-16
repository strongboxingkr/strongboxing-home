"use client";

import { useEffect, useState } from "react";

type Popup = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  branch_name: string;
  popup_start: string;
  popup_end: string;
};

export default function PopupBanner() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/popups")
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok || data.popups.length === 0) return;

        // localStorage에서 숨긴 팝업 제거
        const now = Date.now();
        const filtered = data.popups.filter((p: Popup) => {
          const hiddenUntil = localStorage.getItem(`popup_hide_${p.id}`);
          if (!hiddenUntil) return true;
          if (hiddenUntil === "forever") return false;
          return now > Number(hiddenUntil);
        });

        if (filtered.length > 0) {
          setPopups(filtered);
          setVisible(true);
        }
      });
  }, []);

  if (!visible || popups.length === 0) return null;

  const popup = popups[current];

  function hideToday() {
    localStorage.setItem(`popup_hide_${popup.id}`, String(Date.now() + 86400000));
    next();
  }

  function hideForever() {
    localStorage.setItem(`popup_hide_${popup.id}`, "forever");
    next();
  }

  function next() {
    if (current < popups.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setVisible(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={next}
      />

      {/* 팝업 카드 */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[20px] bg-[#111214] shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={next}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
        >
          ✕
        </button>

        {/* 여러 팝업일 때 인디케이터 */}
        {popups.length > 1 && (
          <div className="absolute left-4 top-4 z-10 flex gap-1.5">
            {popups.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === current ? 20 : 6,
                  background: i === current ? "#D01E2E" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        )}

        {/* 썸네일 이미지 */}
        {popup.thumbnail ? (
          <img
            src={popup.thumbnail}
            alt={popup.title}
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-[#D01E2E]/10">
            <span className="text-5xl">🥊</span>
          </div>
        )}

        {/* 내용 */}
        <div className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-[#D01E2E] px-3 py-0.5 text-[11px] font-black text-white">
              이벤트
            </span>
            <span className="text-[11px] text-[#5A5C61]">
              {popup.branch_name === "전체" ? "스트롱복싱 전점" : popup.branch_name}
            </span>
          </div>
          <h3 className="mb-2 text-lg font-black leading-snug tracking-tight text-[#F5F4F1]">
            {popup.title}
          </h3>
          {popup.description && (
            <p className="mb-4 text-sm leading-6 text-[#8A8D91]">{popup.description}</p>
          )}
          <a
            href={`/blog/${popup.slug}`}
            className="block w-full rounded-[12px] bg-[#D01E2E] py-3 text-center text-sm font-black text-white transition hover:bg-[#B71C2B]"
          >
            자세히 보기 →
          </a>
        </div>

        {/* 하단 버튼 */}
        <div className="flex border-t border-white/5">
          <button
            onClick={hideToday}
            className="flex-1 py-3 text-[12px] font-bold text-[#5A5C61] transition hover:text-white"
          >
            오늘 하루 보지 않기
          </button>
          <div className="w-px bg-white/5" />
          <button
            onClick={hideForever}
            className="flex-1 py-3 text-[12px] font-bold text-[#5A5C61] transition hover:text-white"
          >
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
