"use client";

import { useState, useRef, useEffect } from "react";

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

/* 지점 좌표·주소 정적 데이터 */
const BRANCH_META: Record<string, { lat: number; lng: number; address: string }> = {
  gaebong:      { lat: 37.4982, lng: 126.8601, address: "서울 구로구 개봉동 166-5 유원빌딩 지하 1층" },
  sinjeong:     { lat: 37.5272, lng: 126.8695, address: "서울 양천구 신정동 1021-7 태화상가 2층" },
  mokdong:      { lat: 37.5258, lng: 126.8738, address: "서울 양천구 목동 909-6 우방빌딩 4층" },
  cheolsan:     { lat: 37.4785, lng: 126.8657, address: "경기 광명시 철산동 56-14 3층" },
  yeongdeungpo: { lat: 37.5167, lng: 126.8982, address: "서울 영등포구 도림로 313 건영상가 2층" },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* 운영시간 파싱: "월–금 10:00~24:00  토 10:00~16:00" → {weekday, weekend} */
function parseHours(raw: string): { weekday: string; weekend: string | null } {
  const parts = raw.split(/\s{2,}/);
  return { weekday: parts[0]?.trim() ?? raw, weekend: parts[1]?.trim() ?? null };
}

/* ── 지점 안내 — 지도 없는 가로 탭 목록 ── */
export function BranchSectionClient({ branches, defaultSlug }: { branches: BranchInfo[]; defaultSlug?: string }) {
  const [openBranch, setOpenBranch]   = useState<string | null>(defaultSlug ?? branches[0]?.slug ?? null);
  const [geoState, setGeoState]       = useState<"idle" | "loading" | "found" | "denied" | "error">("idle");
  const [distances, setDistances]     = useState<Record<string, number>>({});
  const [sortedSlugs, setSortedSlugs] = useState<string[] | null>(null);

  function handleGeoClick() {
    if (!navigator.geolocation) { setGeoState("error"); return; }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist: Record<string, number> = {};
        for (const b of branches) {
          const meta = BRANCH_META[b.slug];
          if (meta) dist[b.slug] = Math.round(haversineKm(latitude, longitude, meta.lat, meta.lng) * 10) / 10;
        }
        const sorted = [...branches].sort((a, b) => (dist[a.slug] ?? 99) - (dist[b.slug] ?? 99));
        setDistances(dist);
        setSortedSlugs(sorted.map((b) => b.slug));
        setOpenBranch(sorted[0]?.slug ?? null);
        setGeoState("found");
      },
      () => setGeoState("denied"),
      { timeout: 8000 },
    );
  }

  function handleReset() {
    setGeoState("idle");
    setDistances({});
    setSortedSlugs(null);
    setOpenBranch(null);
  }

  /* 정렬된 순서 or 기본 순서 */
  const orderedBranches = sortedSlugs
    ? sortedSlugs.map((slug) => branches.find((b) => b.slug === slug)!).filter(Boolean)
    : branches;

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">

      {/* 왼쪽: 제목 + 위치 버튼 */}
      <div className="lg:pt-1">
        <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>BRANCHES</p>
        <h2 className="mb-6 font-black leading-tight" style={{ fontSize: "clamp(24px, 2.8vw, 36px)", letterSpacing: "-0.04em", color: "#0E0E10" }}>
          지점 안내
        </h2>

        {geoState === "idle" && (
          <button
            type="button"
            onClick={handleGeoClick}
            className="inline-flex items-start gap-2 rounded-[12px] px-4 py-3 text-left transition hover:opacity-75 active:scale-95"
            style={{ border: "1.5px solid #E0DDD6", color: "#0E0E10", background: "#F9F8F5" }}
          >
            <span className="mt-px shrink-0" style={{ fontSize: 15 }}>📍</span>
            <span className="text-xs font-bold leading-relaxed">
              내 위치로<br />가까운 지점 찾기
            </span>
          </button>
        )}

        {geoState === "loading" && (
          <p className="text-xs" style={{ color: "#6B6B72" }}>위치 찾는 중…</p>
        )}

        {geoState === "found" && (
          <div className="space-y-2">
            <p className="text-xs font-black" style={{ color: "#D01E2E" }}>📍 거리순 정렬됨</p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-bold transition hover:opacity-70"
              style={{ border: "1px solid #D9D7CF", color: "#6B6B72", background: "#fff" }}
            >
              기본 순서로 보기
            </button>
          </div>
        )}

        {geoState === "denied" && (
          <div className="space-y-2">
            <p className="text-xs leading-relaxed" style={{ color: "#6B6B72" }}>위치 권한이 거부되었습니다.</p>
            <button type="button" onClick={handleReset} className="text-xs underline" style={{ color: "#aaa" }}>
              기본 목록으로
            </button>
          </div>
        )}

        {geoState === "error" && (
          <div className="space-y-2">
            <p className="text-xs leading-relaxed" style={{ color: "#6B6B72" }}>위치를 가져오지 못했습니다.</p>
            <button type="button" onClick={handleReset} className="text-xs underline" style={{ color: "#aaa" }}>
              기본 목록으로
            </button>
          </div>
        )}
      </div>

      {/* 오른쪽: 가로 탭 + 선택된 지점 상세 */}
      <div>
        {/* 가로 탭 행 */}
        <div className="flex overflow-x-auto" style={{ borderBottom: "1.5px solid #E8E6DF", gap: 0 }}>
          {orderedBranches.map((b, idx) => {
            const isOpen  = openBranch === b.slug;
            const dist    = distances[b.slug];
            const nearest = geoState === "found" && idx === 0;
            return (
              <button
                key={b.slug}
                type="button"
                onClick={() => setOpenBranch(isOpen ? null : b.slug)}
                className="relative shrink-0 pb-4 pt-2 text-left transition-colors duration-150"
                style={{ paddingRight: 24, paddingLeft: idx === 0 ? 0 : 24 }}
              >
                {/* 지점명 */}
                <span
                  className="block font-black"
                  style={{ fontSize: 17, color: isOpen ? "#D01E2E" : "#0E0E10", whiteSpace: "nowrap" }}
                >
                  {b.name}
                  {nearest && (
                    <span className="ml-1.5 rounded-[5px] px-1.5 py-0.5 align-middle text-[9px] font-black" style={{ background: "#FFF1F2", color: "#D01E2E" }}>
                      가까운
                    </span>
                  )}
                </span>
                {/* 거리 or 지역 */}
                <span className="block" style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>
                  {dist !== undefined ? `약 ${dist}km` : b.area}
                </span>
                {/* 활성 밑줄 */}
                <span
                  className="absolute bottom-0 left-0 w-full transition-all duration-200"
                  style={{
                    height: 2,
                    background: isOpen ? "#D01E2E" : "transparent",
                    right: 0,
                    paddingLeft: idx === 0 ? 0 : 24,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* 선택된 지점 상세 패널 */}
        {(() => {
          const b    = openBranch ? orderedBranches.find((x) => x.slug === openBranch) : orderedBranches[0];
          const meta = b ? BRANCH_META[b.slug] : null;
          if (!b || !meta) return null;
          const hrs  = parseHours(b.hours);
          return (
            <div className="pt-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="font-black" style={{ fontSize: 20, color: "#0E0E10" }}>{b.name}</p>
                  <p className="mt-2" style={{ fontSize: 14, color: "#4A4A52", lineHeight: 1.7 }}>{meta.address}</p>
                  <div className="mt-1 space-y-0.5">
                    <p style={{ fontSize: 14, color: "#4A4A52" }}>{hrs.weekday}</p>
                    {hrs.weekend && <p style={{ fontSize: 14, color: "#4A4A52" }}>{hrs.weekend}</p>}
                  </div>
                  <a
                    href={`tel:${b.phone}`}
                    className="mt-3 inline-block font-bold hover:underline"
                    style={{ fontSize: 15, color: "#0E0E10", textDecoration: "none" }}
                  >
                    {b.phone}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={b.naverMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[10px] px-5 py-2.5 font-bold transition hover:opacity-80"
                    style={{ fontSize: 14, border: "1.5px solid #D9D7CF", color: "#0E0E10", background: "#fff", whiteSpace: "nowrap" }}
                  >
                    네이버 길찾기
                  </a>
                  <a
                    href={b.slug === "yeongdeungpo" ? `/branches/${b.slug}` : `/renewal/branches/${b.slug}`}
                    className="inline-flex items-center justify-center rounded-[10px] px-5 py-2.5 font-bold transition hover:opacity-80"
                    style={{ fontSize: 14, border: "1.5px solid #D01E2E", color: "#D01E2E", background: "#fff", whiteSpace: "nowrap" }}
                  >
                    지점 자세히 보기
                  </a>
                </div>
              </div>
            </div>
          );
        })()}
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

/* ── 네이버 후기 인라인 노출 (스트롱이야기 아래) ── */
export function InlineReviews({ reviews }: { reviews: any[] }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  if (!reviews || reviews.length === 0) return null;
  const LIMIT = 90; // 90자 이상 → 접기

  return (
    <div className="mt-14 pt-10" style={{ borderTop: "1px solid #E8E6DF" }}>
      <p className="mb-6 text-[10px] font-black tracking-[0.35em]" style={{ color: "#aaa" }}>NAVER REVIEW</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r: any, i: number) => {
          const text  = String(r.content || r.review || r.text || "");
          const short = text.length > LIMIT;
          const show  = expanded[i] ? text : (short ? text.slice(0, LIMIT) + "…" : text);
          return (
            <div key={i} className="rounded-[14px] p-6" style={{ border: "1px solid #E8E6DF", background: "#fff" }}>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} style={{ color: j < (r.rating ?? 5) ? "#D01E2E" : "#E0DDD6", fontSize: 13 }}>★</span>
                  ))}
                </div>
                {r.branch_name && (
                  <span className="rounded-[5px] px-2 py-0.5 text-[11px] font-bold" style={{ background: "#FFF1F2", color: "#D01E2E" }}>
                    {r.branch_name}
                  </span>
                )}
              </div>
              <p className="leading-6" style={{ fontSize: 14, color: "#0E0E10" }}>{show}</p>
              {short && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                  className="mt-2"
                  style={{ fontSize: 13, color: "#888", textDecoration: "underline" }}
                >
                  {expanded[i] ? "접기" : "더 보기"}
                </button>
              )}
              {r.author && (
                <p className="mt-3" style={{ fontSize: 12, color: "#aaa" }}>{r.author}</p>
              )}
            </div>
          );
        })}
      </div>
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
