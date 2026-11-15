"use client";

import { useState } from "react";

const BRANCHES = [
  { name: "신정점",    area: "서울 양천구", top: "16%", left: "60%", flip: false, slug: "sinjeong",     phone: "02-2647-3373", booking: "https://booking.naver.com/booking/13/bizes/1367177" },
  { name: "목동점",    area: "서울 양천구", top: "40%", left: "22%", flip: true,  slug: "mokdong",      phone: "02-2643-5971", booking: "https://booking.naver.com/booking/13/bizes/1510638" },
  { name: "철산점",    area: "경기 광명시", top: "52%", left: "74%", flip: false, slug: "cheolsan",     phone: "02-2066-0406", booking: "https://booking.naver.com/booking/12/bizes/1673598" },
  { name: "개봉점",    area: "서울 구로구", top: "74%", left: "24%", flip: true,  slug: "gaebong",      phone: "02-2060-1279", booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll" },
  { name: "영등포점",  area: "서울 영등포", top: "84%", left: "62%", flip: false, slug: "yeongdeungpo", phone: "02-831-9312",  booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll" },
];

/* 섹션 래퍼 없이 지도 div만 렌더링 — /renewal 임베딩용 */
export default function BranchMapLight() {
  const [active, setActive] = useState<string | null>(null);
  const activeBranch = BRANCHES.find((b) => b.name === active);

  return (
    <div
      className="relative overflow-hidden rounded-[20px]"
      style={{ height: 420, background: "#0E0E11", border: "1px solid rgba(255,255,255,0.08)" }}
      onClick={() => setActive(null)}
    >
      {/* SVG 배경 */}
      <svg
        viewBox="0 0 440 520"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path d="M-20 250 Q120 300 200 380 T460 470" fill="none" stroke="#0D131A" strokeWidth="34" opacity=".9" />
        <path d="M-20 250 Q120 300 200 380 T460 470" fill="none" stroke="#11202c" strokeWidth="2" opacity=".5" />
        <g stroke="#23232a" strokeWidth="3" fill="none" opacity=".9">
          <path d="M-10 120 Q200 90 460 150" />
          <path d="M40 -10 Q90 200 70 540" />
          <path d="M330 -10 Q300 230 380 540" />
          <path d="M-10 360 Q200 330 460 300" />
        </g>
        <g stroke="#16161a" strokeWidth="1.2" fill="none">
          <path d="M-10 60 L460 30" /><path d="M-10 180 L460 200" />
          <path d="M-10 240 L460 250" /><path d="M-10 300 L460 280" />
          <path d="M-10 420 L460 400" /><path d="M-10 480 L460 460" />
          <path d="M100 -10 L130 540" /><path d="M170 -10 L150 540" />
          <path d="M240 -10 L260 540" /><path d="M290 -10 L270 540" />
          <path d="M400 -10 L420 540" />
        </g>
      </svg>

      {/* 비네트 */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{ background: "radial-gradient(120% 80% at 50% 30%, transparent 40%, #08080A 100%)" }}
      />

      {/* 핀 */}
      {BRANCHES.map((b, i) => (
        <button
          key={b.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: b.top, left: b.left }}
          onClick={(e) => { e.stopPropagation(); setActive(active === b.name ? null : b.name); }}
        >
          {/* 글로우 */}
          <span
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(208,30,46,0.25) 0%, transparent 70%)",
              animationDelay: `${i * 0.7}s`,
            }}
          />
          {/* 점 */}
          <span
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
            style={{
              width: active === b.name ? 12 : 9,
              height: active === b.name ? 12 : 9,
              background: "#D01E2E",
              boxShadow: active === b.name ? "0 0 14px 4px rgba(208,30,46,0.6), 0 0 4px 2px #fff" : "0 0 8px 2px rgba(208,30,46,0.4)",
            }}
          />
          {/* 라벨 */}
          <span
            className={`absolute top-[-14px] whitespace-nowrap ${b.flip ? "right-[14px] text-right" : "left-[14px] text-left"}`}
          >
            <b className="block text-[13px] font-bold leading-tight text-white">{b.name}</b>
            <small className="block text-[10px] text-zinc-500 mt-0.5">{b.area}</small>
          </span>
        </button>
      ))}

      {/* 선택 카드 */}
      {activeBranch && (
        <div
          className="absolute bottom-3 left-3 right-3 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="rounded-[16px] p-4 shadow-2xl"
            style={{ background: "#131316", border: "1px solid rgba(255,255,255,0.08)", animation: "slideUp .3s cubic-bezier(.16,1,.3,1) both" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-black text-white">{activeBranch.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{activeBranch.area}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-[10px] font-semibold"
                style={{ background: "rgba(208,30,46,0.1)", color: "#D01E2E", border: "1px solid rgba(208,30,46,0.2)" }}>
                복싱 · 권투장
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <a href={`tel:${activeBranch.phone.replaceAll("-", "")}`}
                className="rounded-[10px] py-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-80"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
                전화하기
              </a>
              <a href={`/branches/${activeBranch.slug}`}
                className="rounded-[10px] py-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-80"
                style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
                지점 정보
              </a>
              <a href={activeBranch.booking} target="_blank" rel="noopener noreferrer"
                className="rounded-[10px] py-2.5 text-center text-xs font-bold transition-opacity hover:opacity-90"
                style={{ background: "#D01E2E", color: "#fff" }}>
                예약하기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
