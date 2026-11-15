"use client";

import { useState, useRef, useEffect } from "react";
import BranchMapLight from "@/app/components/BranchMapLight";

/* ── 지점 타입 ── */
interface BranchInfo {
  slug: string;
  name: string;
  area: string;
  hours: string;
  phone: string;
  booking: string;
  naverMap: string;
  image: string;
}

/* ── 지점 안내 — 지도↔목록 연동 ── */
export function BranchSectionClient({ branches }: { branches: BranchInfo[] }) {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  /* 목록 아이템 높이에 맞춰 지도 높이 계산 (5개 × ~58px + padding) */
  const mapHeight = Math.max(300, branches.length * 58 + 20);

  return (
    <div className="grid gap-10 lg:grid-cols-[160px_1fr_280px] lg:gap-8">

      {/* 왼쪽 제목 */}
      <div className="lg:pt-2">
        <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>BRANCHES</p>
        <h2 className="font-black leading-tight" style={{ fontSize: "clamp(24px, 2.8vw, 36px)", letterSpacing: "-0.04em", color: "#0E0E10" }}>
          지점 안내
        </h2>
      </div>

      {/* 가운데 지도 */}
      <BranchMapLight
        activeBranch={activeBranch}
        onBranchSelect={setActiveBranch}
        height={mapHeight}
      />

      {/* 오른쪽 목록 — 얇은 구분선 */}
      <div>
        {branches.map((b, i) => {
          const isActive = activeBranch === b.slug;
          return (
            <div
              key={b.slug}
              style={{ borderBottom: "1px solid #E8E6DF" }}
            >
              <button
                type="button"
                className="w-full py-3.5 text-left transition-colors duration-150"
                onClick={() => setActiveBranch(isActive ? null : b.slug)}
              >
                <div className="flex items-center gap-3">
                  {/* 색 점 인디케이터 */}
                  <span
                    className="shrink-0 h-1.5 w-1.5 rounded-full transition-colors duration-150"
                    style={{ background: isActive ? "#D01E2E" : "#D9D7CF" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="font-black text-sm transition-colors duration-150"
                        style={{ color: isActive ? "#D01E2E" : "#0E0E10" }}
                      >
                        {b.name}
                      </span>
                      <span className="text-[10px]" style={{ color: "#aaa" }}>{b.area}</span>
                    </div>
                    <p className="text-[11px] truncate" style={{ color: "#6B6B72" }}>
                      {b.hours.split("  ")[0]}
                    </p>
                  </div>
                  <a
                    href={`/branches/${b.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 text-sm font-black transition-opacity hover:opacity-60"
                    style={{ color: "#D01E2E" }}
                    aria-label={`${b.name} 상세 보기`}
                  >
                    →
                  </a>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab 섹션 — 글자 + 빨간 밑줄 ── */
export function TabSection({
  tabs,
  panels,
  dark = false,
}: {
  tabs: string[];
  panels: React.ReactNode[];
  dark?: boolean;
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div
        className="mb-8 flex gap-6 overflow-x-auto"
        style={{ borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E8E6DF" }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className="relative shrink-0 pb-3 text-sm font-black transition-colors duration-200"
            style={{ color: active === i ? (dark ? "#F5F4F1" : "#0E0E10") : dark ? "#6B6B72" : "#aaa" }}
          >
            {tab}
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-200"
              style={{ background: active === i ? "#D01E2E" : "transparent" }}
            />
          </button>
        ))}
      </div>
      <div>{panels[active]}</div>
    </div>
  );
}

/* ── 처음 방문 아코디언 ── */
const FAQ_ITEMS = [
  {
    q: "무엇을 준비해야 하나요?",
    a: "편한 운동복과 실내용 운동화만 챙겨오세요. 그 외 모든 준비물은 체육관에서 제공됩니다.",
  },
  {
    q: "요금은 어떻게 되나요?",
    a: "원데이 클래스 30,000원 현장 결제입니다. 당일 등록 시 회원권에서 전액 차감됩니다.",
  },
  {
    q: "운동을 한 번도 안 해봤는데 괜찮을까요?",
    a: "처음 오시는 분들이 더 많습니다. 기초 자세부터 개인 수준에 맞춰 1:1로 안내해드립니다.",
  },
  {
    q: "예약 없이 방문해도 되나요?",
    a: "방문 상담은 언제든 가능합니다. 다만 원데이 수업은 사전 예약을 추천드립니다.",
  },
];

export function FirstVisitAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[14px] transition-all duration-200"
          style={{ border: "1.5px solid #E0DDD6", background: open === i ? "#fff" : "#F7F6F3" }}
        >
          <button
            className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-black text-sm md:text-base" style={{ color: "#0E0E10" }}>{item.q}</span>
            <span
              className="shrink-0 font-black text-lg transition-transform duration-200"
              style={{ color: "#D01E2E", transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="px-7 pb-6 text-sm leading-7" style={{ color: "#6B6B72" }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── 칼로리 계산기 (탭 패널용) ── */
export function CalorieCalcPanel() {
  const [weight, setWeight] = useState(65);
  const [minutes, setMinutes] = useState(60);
  const kcal = Math.round(weight * 0.085 * minutes);
  return (
    <div className="rounded-[16px] border border-[#E0DDD6] bg-white p-8">
      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-black tracking-[0.1em]" style={{ color: "#6B6B72" }}>체중 (kg)</label>
          <input
            type="range" min={40} max={120} step={1} value={weight}
            onChange={e => setWeight(+e.target.value)}
            className="w-full accent-[#D01E2E]"
          />
          <p className="mt-1 text-right text-sm font-black" style={{ color: "#0E0E10" }}>{weight} kg</p>
        </div>
        <div>
          <label className="mb-2 block text-xs font-black tracking-[0.1em]" style={{ color: "#6B6B72" }}>운동 시간 (분)</label>
          <input
            type="range" min={30} max={120} step={10} value={minutes}
            onChange={e => setMinutes(+e.target.value)}
            className="w-full accent-[#D01E2E]"
          />
          <p className="mt-1 text-right text-sm font-black" style={{ color: "#0E0E10" }}>{minutes} 분</p>
        </div>
      </div>
      <div className="rounded-[12px] p-6 text-center" style={{ background: "#FFF1F2" }}>
        <p className="text-xs font-black tracking-[0.15em] mb-2" style={{ color: "#D01E2E" }}>예상 소모 칼로리</p>
        <p className="font-black" style={{ fontSize: "clamp(48px, 8vw, 72px)", color: "#D01E2E", lineHeight: 1 }}>
          {kcal.toLocaleString()}
        </p>
        <p className="mt-1 text-sm" style={{ color: "#6B6B72" }}>kcal</p>
      </div>
      <p className="mt-4 text-xs text-center" style={{ color: "#aaa" }}>※ 실제 소모량은 운동 강도·체형에 따라 다를 수 있습니다.</p>
    </div>
  );
}
