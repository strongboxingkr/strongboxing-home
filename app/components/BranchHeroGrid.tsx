"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

interface Branch {
  slug: string;
  name: string;
  image: string;
  score: string;
  reviewCount: number;
  review: string;
  badges: string[];
  // badges[0]: 타깃 태그라인, badges[1]: SEO 키워드
}

interface Props {
  branches: Branch[];
}

// 지점 좌표 — 지점 페이지 주소 기준 대략값 (수백 m 오차 가능, 정확한 값은 네이버/카카오 지도에서 확인 후 교체)
const BRANCH_COORDS: Record<string, [number, number]> = {
  gaebong: [37.4950, 126.8580], // 서울 구로구 개봉동 166-5
  sinjeong: [37.5185, 126.8560], // 서울 양천구 신정동 1021-7
  mokdong: [37.5290, 126.8720], // 서울 양천구 목동 909-6
  cheolsan: [37.4775, 126.8665], // 경기 광명시 철산동 56-14
  yeongdeungpo: [37.5075, 126.8990], // 서울 영등포구 도림로 313
};

const DEFAULT_SLUG = "gaebong";
const STORAGE_KEY = "strong_nearest_branch";

type Source = "default" | "ip" | "gps";

function distanceKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

function nearestBranch(pos: [number, number], slugs: string[]): { slug: string; km: number } | null {
  let best: { slug: string; km: number } | null = null;
  for (const slug of slugs) {
    const c = BRANCH_COORDS[slug];
    if (!c) continue;
    const km = distanceKm(pos, c);
    if (!best || km < best.km) best = { slug, km };
  }
  return best;
}

/** IP 기반 추정 — 구 단위까지 나올 때만 사용, 못 맞추면 null */
function guessBranchFromGeo(city: string, region: string): string | null {
  const t = `${city} ${region}`.toLowerCase();
  if (/gwangmyeong|cheolsan|haan|soha|광명|철산|하안|소하/.test(t)) return "cheolsan";
  if (/sinjeong|신정/.test(t)) return "sinjeong";
  if (/yangcheon|mokdong|양천|목동/.test(t)) return "mokdong";
  if (/guro|gaebong|gocheok|oryu|천왕|구로|개봉|고척|오류/.test(t)) return "gaebong";
  if (/yeongdeungpo|singil|dorim|영등포|신길|도림/.test(t)) return "yeongdeungpo";
  return null;
}

function formatKm(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

/* 큰 카드 */
function FeaturedCard({ branch, onSelect, badge }: { branch: Branch; onSelect: (slug: string) => void; badge: string }) {
  return (
    <a
      href={`/branches/${branch.slug}`}
      onClick={() => onSelect(branch.slug)}
      aria-label={`스트롱복싱 ${branch.name} 자세히 보기`}
      className="group relative block overflow-hidden"
      style={{ borderRadius: 14, height: "100%" }}
    >
      <img
        src={branch.image}
        alt={`스트롱복싱 ${branch.name}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ filter: "brightness(0.55) grayscale(0.12)" }}
      />
      {/* 기본 오버레이 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
        style={{ background: "linear-gradient(to top, rgba(14,14,16,0.88) 0%, rgba(14,14,16,0.15) 60%, transparent 100%)" }}
      />
      {/* hover 시 조금 밝은 오버레이 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(to top, rgba(14,14,16,0.70) 0%, rgba(14,14,16,0.08) 60%, transparent 100%)" }}
      />

      {/* 콘텐츠 */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <p className="mb-1 text-[10px] font-black tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.45)" }}>
          STRONG BOXING
        </p>
        <h3 className="font-black leading-none" style={{ fontSize: 36, letterSpacing: "-0.04em", color: "#F5F4F1" }}>
          {branch.name}
        </h3>
        <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          ★ {branch.score} &nbsp;·&nbsp; 리뷰 {branch.reviewCount}개
        </p>
        {branch.badges[0] && (
          <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{branch.badges[0]}</p>
        )}
        {/* CTA — hover 시 등장 */}
        <div
          className="mt-5 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span
            className="inline-block rounded-sm px-5 py-2.5 text-xs font-black"
            style={{ background: "#D01E2E", color: "#fff" }}
          >
            지점 자세히 보기 →
          </span>
        </div>
      </div>

      {/* 대표 지점 뱃지 */}
      <div className="absolute left-5 top-5">
        <span
          className="rounded-sm px-2.5 py-1 text-[10px] font-black"
          style={{ background: "rgba(14,14,16,0.75)", border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}
        >
          {badge}
        </span>
      </div>
    </a>
  );
}

/* 작은 카드 */
function SmallCard({ branch, onSelect }: { branch: Branch; onSelect: (slug: string) => void }) {
  return (
    <a
      href={`/branches/${branch.slug}`}
      onClick={() => onSelect(branch.slug)}
      aria-label={`스트롱복싱 ${branch.name} 자세히 보기`}
      className="group relative block overflow-hidden"
      style={{ borderRadius: 12, height: "100%" }}
    >
      <img
        src={branch.image}
        alt={`스트롱복싱 ${branch.name}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        style={{ filter: "brightness(0.5) grayscale(0.15)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
        style={{ background: "linear-gradient(to top, rgba(14,14,16,0.9) 0%, rgba(14,14,16,0.2) 55%, transparent 100%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(to top, rgba(14,14,16,0.72) 0%, rgba(14,14,16,0.05) 55%, transparent 100%)" }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="mb-0.5 text-[9px] font-black" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
          {branch.badges[0]}
        </p>
        <h3 className="font-black" style={{ fontSize: 16, letterSpacing: "-0.03em", color: "#F5F4F1" }}>
          {branch.name}
        </h3>
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          ★ {branch.score} · {branch.reviewCount}개
        </p>
        {/* CTA */}
        <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="mt-2 inline-block text-[10px] font-black" style={{ color: "#D01E2E" }}>
            자세히 보기 →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function BranchHeroGrid({ branches }: Props) {
  const [featuredSlug, setFeaturedSlug] = useState(DEFAULT_SLUG);
  const [source, setSource] = useState<Source>("default");
  const [distance, setDistance] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1) 이전에 '내 위치로 찾기'를 한 방문자는 그 결과를 그대로 사용
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.slug && branches.some((b) => b.slug === saved.slug)) {
        setFeaturedSlug(saved.slug);
        setDistance(typeof saved.km === "number" ? saved.km : null);
        setSource("gps");
        setMounted(true);
        return;
      }
    } catch {}

    // 2) 아니면 IP로 대략 추정 (구 단위가 나올 때만), 못 맞추면 기본 지점
    fetch("https://ipwho.is/")
      .then((r) => r.json())
      .then((data) => {
        const slug = guessBranchFromGeo(data.city ?? "", data.region ?? "");
        if (slug) {
          setFeaturedSlug(slug);
          setSource("ip");
        }
      })
      .catch(() => {})
      .finally(() => setMounted(true));
  }, [branches]);

  function locate() {
    if (!navigator.geolocation) {
      setLocateMsg("이 브라우저에서는 위치 확인을 지원하지 않습니다.");
      return;
    }
    setLocating(true);
    setLocateMsg("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const best = nearestBranch(
          [pos.coords.latitude, pos.coords.longitude],
          branches.map((b) => b.slug)
        );
        if (!best) return;
        setFeaturedSlug(best.slug);
        setDistance(best.km);
        setSource("gps");
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug: best.slug, km: best.km, at: Date.now() }));
        } catch {}
        const name = branches.find((b) => b.slug === best.slug)?.name;
        trackEvent("nearest_branch_locate", { result: "ok", branch_name: name, distance_km: Math.round(best.km * 10) / 10 });
      },
      (err) => {
        setLocating(false);
        setLocateMsg(
          err.code === err.PERMISSION_DENIED
            ? "위치 권한이 꺼져 있어요. 아래 지점 중에서 직접 골라 주세요."
            : "위치를 확인하지 못했어요. 잠시 후 다시 시도해 주세요."
        );
        trackEvent("nearest_branch_locate", { result: err.code === err.PERMISSION_DENIED ? "denied" : "error" });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }

  const handleSelect = (_slug: string) => {};

  const featured = branches.find((b) => b.slug === featuredSlug) ?? branches[0];
  const others = branches.filter((b) => b.slug !== featured.slug);
  const badge =
    source === "gps"
      ? `가까운 지점${distance != null ? ` · 약 ${formatKm(distance)}` : ""}`
      : source === "ip"
        ? "가까운 지점"
        : "추천 지점";

  return (
    <div
      id="branch"
      className="transition-opacity duration-500"
      style={{ opacity: mounted ? 1 : 0.6 }}
    >
      {/* Magazine Grid: 왼쪽 대표 카드 + 오른쪽 2×2 소형 카드 4개 */}
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(4, 1fr)",
          height: "clamp(480px, 62vw, 660px)",
        }}
      >
        {/* 대표 지점 — 왼쪽 전체 (4행 span) */}
        <div style={{ gridColumn: 1, gridRow: "1 / 5" }}>
          <FeaturedCard branch={featured} onSelect={handleSelect} badge={badge} />
        </div>

        {/* 나머지 4개 지점 — 오른쪽 2×2 */}
        {others.slice(0, 4).map((branch, i) => (
          <div key={branch.slug} style={{ gridColumn: 2, gridRow: i + 1, height: "100%" }}>
            <SmallCard branch={branch} onSelect={handleSelect} />
          </div>
        ))}
      </div>

      {/* 내 위치로 가까운 지점 찾기 — 누를 때만 위치 권한 요청 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-xs font-bold text-[#C8CACD] transition hover:border-[#D01E2E]/60 hover:text-white disabled:opacity-60"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="9.5" r="2.5" fill="#D01E2E" />
          </svg>
          {locating ? "위치 확인 중..." : source === "gps" ? "내 위치로 다시 찾기" : "내 위치로 가까운 지점 찾기"}
        </button>
        {locateMsg && <span className="text-xs text-[#8A8D91]">{locateMsg}</span>}
      </div>

    </div>
  );
}
