"use client";

import { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import { ArrowRight, LocateFixed, MapPin } from "lucide-react";

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

/* ── 지점 안내 ── */
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>BRANCHES</p>
          <h2 className="font-black leading-tight" style={{ fontSize: "clamp(24px, 2.8vw, 36px)", letterSpacing: "-0.04em", color: "#0E0E10" }}>
            지점 안내
          </h2>
        </div>

        {geoState === "idle" && (
          <button
            type="button"
            onClick={handleGeoClick}
            className="inline-flex min-h-11 items-center gap-2 text-left text-sm font-bold text-[#4A4A52] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D01E2E]"
          >
            <LocateFixed aria-hidden="true" className="size-4 shrink-0 text-[#B81933]" />
            내 위치로 가까운 지점 찾기
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

      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-3.5">
          {orderedBranches.map((branch, index) => {
            const selected = (openBranch ?? orderedBranches[0]?.slug) === branch.slug;
            const distance = distances[branch.slug];
            return (
              <button
                key={branch.slug}
                type="button"
                aria-pressed={selected}
                aria-controls="renewal-branch-details"
                onClick={() => setOpenBranch(branch.slug)}
                className="group min-w-0 overflow-hidden rounded-md border border-[#E8E6DF] bg-white text-left transition-colors hover:border-[#AAA59C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D01E2E] aria-pressed:border-b-[#D01E2E]"
              >
                <span className="relative block aspect-[5/4] overflow-hidden bg-[#EEECE6]">
                  <Image
                    src={branch.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 240px, (min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]"
                  />
                  {geoState === "found" && index === 0 && (
                    <span className="absolute left-2 top-2 rounded bg-white px-2 py-1 text-[11px] font-bold text-[#B81933]">가장 가까운 지점</span>
                  )}
                </span>
                <span className="block border-b border-transparent px-3 py-2.5 group-aria-pressed:border-[#D01E2E] sm:px-3.5">
                  <span className="block text-base font-black text-[#0E0E10] group-aria-pressed:text-[#B81933]">{branch.name}</span>
                  <span className="mt-0.5 block text-xs text-[#606069]">{distance !== undefined ? `약 ${distance}km` : branch.area}</span>
                </span>
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
            <div id="renewal-branch-details" className="mt-5 border-t border-[#E8E6DF] pt-4 sm:pt-5">
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 sm:gap-x-5">
                  <a
                    href={b.naverMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold whitespace-nowrap text-[#4A4A52] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D01E2E]"
                  >
                    <MapPin aria-hidden="true" className="size-4" />
                    네이버 길찾기
                  </a>
                  <a
                    href={b.slug === "yeongdeungpo" ? `/branches/${b.slug}` : `/renewal/branches/${b.slug}`}
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold whitespace-nowrap text-[#B81933] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D01E2E]"
                  >
                    지점 자세히 보기
                    <ArrowRight aria-hidden="true" className="size-4" />
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
  linkedTab,
}: {
  tabs: string[];
  panels: React.ReactNode[];
  dark?: boolean;
  linkedTab?: { hash: string; name: string };
}) {
  const [active, setActive] = useState(0);
  const hash = linkedTab?.hash;
  const linkedIndex = linkedTab ? tabs.indexOf(linkedTab.name) : -1;
  useEffect(() => {
    if (!hash || linkedIndex < 0) return;
    const selectLinkedTab = () => {
      if (window.location.hash === hash) setActive(linkedIndex);
    };
    selectLinkedTab();
    window.addEventListener("hashchange", selectLinkedTab);
    return () => window.removeEventListener("hashchange", selectLinkedTab);
  }, [hash, linkedIndex]);
  return (
    <div>
      <div
        className="mb-8 flex gap-6 overflow-x-auto"
        style={{ borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E8E6DF" }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => {
              if (hash && window.location.hash === hash && i !== linkedIndex) {
                window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
              }
              setActive(i);
            }}
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
  const weightId = useId();
  const minutesId = useId();
  return (
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <div className="space-y-5 py-1">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={weightId} className="text-sm font-bold text-[#0E0E10]">체중</label>
            <span className="text-sm font-black tabular-nums text-[#0E0E10]">{weight} <span className="font-medium text-[#606069]">kg</span></span>
          </div>
          <input
            id={weightId}
            type="range" min={40} max={120} step={1} value={weight}
            aria-valuetext={`${weight}킬로그램`}
            onChange={e => setWeight(+e.target.value)}
            className="mt-1 block h-9 w-full cursor-pointer accent-[#D01E2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D01E2E]"
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={minutesId} className="text-sm font-bold text-[#0E0E10]">운동 시간</label>
            <span className="text-sm font-black tabular-nums text-[#0E0E10]">{minutes} <span className="font-medium text-[#606069]">분</span></span>
          </div>
          <input
            id={minutesId}
            type="range" min={30} max={120} step={10} value={minutes}
            aria-valuetext={`${minutes}분`}
            onChange={e => setMinutes(+e.target.value)}
            className="mt-1 block h-9 w-full cursor-pointer accent-[#D01E2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D01E2E]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center border-t border-[#D9D7CF] pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-7">
        <p className="text-sm font-bold text-[#0E0E10]">예상 소모 칼로리</p>
        <output htmlFor={`${weightId} ${minutesId}`} className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-5xl leading-none font-black tracking-tight tabular-nums text-[#B81933]">{kcal.toLocaleString()}</span>
          <span className="text-sm font-medium text-[#606069]">kcal</span>
        </output>
      </div>
      <p className="text-xs leading-relaxed text-[#606069] sm:col-span-2">※ 실제 소모량은 운동 강도·체형에 따라 다를 수 있습니다.</p>
    </div>
  );
}
