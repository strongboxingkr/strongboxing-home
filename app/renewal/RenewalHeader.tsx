"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import ReservationButton from "@/app/components/ReservationButton";

const NAV = [
  { label: "소개", href: "/about" },
  { label: "지점", anchor: "branches" },
  { label: "운동", anchor: "workout" },
  { label: "소식", href: "/blog" },
  { label: "상담", anchor: "contact" },
] as const;

export default function RenewalHeader() {
  const [open, setOpen] = useState(false);

  const go = (anchor: string) => {
    setOpen(false);
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full"
      style={{ background: "#fff", borderBottom: "1px solid #E8E6DF" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* 로고: 기존 에셋 그대로, 흰 배경이므로 STRONG 글자색만 어둡게 */}
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/icon.png" alt="스트롱복싱" className="h-7 w-7 object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-black tracking-[0.08em]" style={{ color: "#0E0E10" }}>
              STRONG
            </span>
            <span className="text-[9px] font-black tracking-[0.22em]" style={{ color: "#D01E2E" }}>
              — BOXING —
            </span>
          </div>
        </a>

        {/* 데스크탑 nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            "href" in item ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold transition-colors hover:text-[#0E0E10]"
                style={{ color: "#6B6B72" }}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.anchor)}
                className="text-sm font-semibold transition-colors hover:text-[#0E0E10]"
                style={{ color: "#6B6B72" }}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ReservationButton className="hidden lg:block rounded-[10px] bg-[#D01E2E] px-5 py-2.5 text-sm font-black text-white transition-opacity hover:opacity-90">
            방문 상담 예약
          </ReservationButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] lg:hidden"
            style={{ border: "1px solid #E8E6DF", color: "#6B6B72" }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* 모바일 드로어 */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? "max-h-screen" : "max-h-0"}`}
        style={{ borderTop: open ? "1px solid #E8E6DF" : "none", background: "#fff" }}
      >
        <nav className="flex flex-col px-6 py-3">
          {NAV.map((item, i) => {
            const style: React.CSSProperties = {
              borderBottom: i < NAV.length - 1 ? "1px solid #E8E6DF" : "none",
              color: "#6B6B72",
            };
            return "href" in item ? (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-4 text-sm font-semibold"
                style={style}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.anchor)}
                className="py-4 text-left text-sm font-semibold w-full"
                style={style}
              >
                {item.label}
              </button>
            );
          })}
          <div className="py-4">
            <ReservationButton className="w-full rounded-[10px] bg-[#D01E2E] py-3.5 text-sm font-black text-white">
              방문 상담 예약
            </ReservationButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
