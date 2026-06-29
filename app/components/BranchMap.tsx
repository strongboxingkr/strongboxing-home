"use client";

import { useState } from "react";

const branches = [
  {
    name: "신정점",
    area: "서울 양천구",
    top: "16%",
    left: "60%",
    flip: false,
    slug: "sinjeong",
    phone: "02-2647-3373",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
  },
  {
    name: "목동점",
    area: "서울 양천구",
    top: "40%",
    left: "22%",
    flip: true,
    slug: "mokdong",
    phone: "02-2643-5971",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
  },
  {
    name: "철산점",
    area: "경기 광명시",
    top: "52%",
    left: "74%",
    flip: false,
    slug: "cheolsan",
    phone: "02-2066-0406",
    booking: "https://booking.naver.com/booking/12/bizes/1673598",
  },
  {
    name: "개봉점",
    area: "서울 구로구",
    top: "74%",
    left: "24%",
    flip: true,
    slug: "gaebong",
    phone: "02-2060-1279",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
  },
  {
    name: "영등포점",
    area: "서울 영등포구",
    top: "84%",
    left: "62%",
    flip: false,
    slug: "yeongdeungpo",
    phone: "02-831-9312",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
  },
];

export default function BranchMap() {
  const [active, setActive] = useState<string | null>(null);

  const activeBranch = branches.find((b) => b.name === active);

  return (
    <section className="reveal bg-[#08080A] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="reveal mb-4 text-sm font-black tracking-[0.35em] text-[#FF8A3D]">LOCATIONS</p>
          <h2 className="reveal d1 text-5xl font-black leading-[0.95] tracking-[-0.07em] text-white md:text-7xl">
            가까운 지점을
            <br />
            찾아보세요
          </h2>
          <p className="reveal d2 mt-4 text-zinc-500">핀을 눌러 지점 정보를 확인하세요</p>
        </div>

        <div className="relative mx-auto max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#0E0E11]"
          style={{ height: 480 }}
          onClick={() => setActive(null)}
        >
          {/* SVG map background */}
          <svg viewBox="0 0 440 520" preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M-20 250 Q120 300 200 380 T460 470" fill="none" stroke="#0D131A" strokeWidth="34" opacity=".9"/>
            <path d="M-20 250 Q120 300 200 380 T460 470" fill="none" stroke="#11202c" strokeWidth="2" opacity=".5"/>
            <g stroke="#23232a" strokeWidth="3" fill="none" opacity=".9">
              <path d="M-10 120 Q200 90 460 150"/>
              <path d="M40 -10 Q90 200 70 540"/>
              <path d="M330 -10 Q300 230 380 540"/>
              <path d="M-10 360 Q200 330 460 300"/>
            </g>
            <g stroke="#16161a" strokeWidth="1.2" fill="none">
              <path d="M-10 60 L460 30"/><path d="M-10 180 L460 200"/>
              <path d="M-10 240 L460 250"/><path d="M-10 300 L460 280"/>
              <path d="M-10 420 L460 400"/><path d="M-10 480 L460 460"/>
              <path d="M100 -10 L130 540"/><path d="M170 -10 L150 540"/>
              <path d="M240 -10 L260 540"/><path d="M290 -10 L270 540"/>
              <path d="M400 -10 L420 540"/>
            </g>
          </svg>

          {/* vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ background: "radial-gradient(120% 80% at 50% 30%, transparent 40%, #08080A 100%)" }} />

          {/* pins */}
          {branches.map((b, i) => (
            <button
              key={b.name}
              className="pin-btn absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: b.top, left: b.left }}
              onClick={(e) => { e.stopPropagation(); setActive(active === b.name ? null : b.name); }}
            >
              {/* glow */}
              <span className={`pin-glow absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full ${active === b.name ? "pin-glow-active" : ""}`}
                style={{ animationDelay: `${i * 0.7}s` }} />
              {/* dot */}
              <span className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${active === b.name ? "h-3 w-3" : "h-[9px] w-[9px]"}`}
                style={{ background: "#FFD9A8", boxShadow: active === b.name ? "0 0 14px 4px #FF8A3D, 0 0 4px 2px #fff" : "0 0 8px 2px #FF8A3D, 0 0 2px 1px #fff" }} />
              {/* label */}
              <span className={`absolute top-[-14px] whitespace-nowrap ${b.flip ? "right-[14px] text-right" : "left-[14px] text-left"}`}>
                <b className="block text-[14px] font-bold leading-tight text-white">{b.name}</b>
                <small className="block text-[10px] text-zinc-500 mt-0.5">{b.area}</small>
              </span>
            </button>
          ))}

          {/* detail card */}
          {activeBranch && (
            <div className="absolute bottom-4 left-4 right-4 z-50" onClick={(e) => e.stopPropagation()}>
              <div className="rounded-[18px] border border-white/10 bg-[#131316] p-4 shadow-2xl"
                style={{ animation: "slideUp .4s cubic-bezier(.16,1,.3,1) both" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{activeBranch.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{activeBranch.area}</p>
                  </div>
                  <span className="rounded-full border border-[#3a2a1c] bg-[#FF8A3D]/10 px-3 py-1 text-[10px] font-semibold text-[#FFD9A8]">
                    복싱 · 권투장
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <a href={`tel:${activeBranch.phone.replaceAll("-", "")}`}
                    className="rounded-xl border border-white/10 py-3 text-center text-xs font-bold text-white">
                    전화하기
                  </a>
                  <a href={`/branches/${activeBranch.slug}`}
                    className="rounded-xl border border-white/10 py-3 text-center text-xs font-bold text-white">
                    지점 정보
                  </a>
                  <a href={activeBranch.booking} target="_blank"
                    className="rounded-xl bg-white py-3 text-center text-xs font-bold text-black">
                    예약하기
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
