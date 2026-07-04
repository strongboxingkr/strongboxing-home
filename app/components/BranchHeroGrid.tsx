"use client";

import { useState, useEffect } from "react";

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

function guessBranchFromGeo(city: string, region: string): string {
  const t = `${city} ${region}`.toLowerCase();
  if (/gwangmyeong|cheolsan|haan|soha|광명|철산|하안|소하/.test(t)) return "cheolsan";
  if (/yangcheon|mokdong|sinjeong|양천|목동|신정/.test(t)) return "mokdong";
  if (/guro|gaebong|gocheok|oryu|천왕|구로|개봉|고척|오류/.test(t)) return "gaebong";
  if (/yeongdeungpo|singil|dorim|영등포|신길|도림/.test(t)) return "yeongdeungpo";
  return "gaebong";
}

/* 큰 카드 */
function FeaturedCard({ branch, onSelect }: { branch: Branch; onSelect: (slug: string) => void }) {
  return (
    <a
      href={`/branches/${branch.slug}`}
      onClick={() => onSelect(branch.slug)}
      className="group relative block overflow-hidden"
      style={{ borderRadius: 14, height: "100%" }}
    >
      <img
        src={branch.image}
        alt={branch.name}
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
          가까운 지점
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
      className="group relative block overflow-hidden"
      style={{ borderRadius: 12, height: "100%" }}
    >
      <img
        src={branch.image}
        alt={branch.name}
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
  const [featuredSlug, setFeaturedSlug] = useState("gaebong");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1순위: localStorage
    const saved = localStorage.getItem("preferredBranch");
    if (saved && branches.find((b) => b.slug === saved)) {
      setFeaturedSlug(saved);
      setMounted(true);
      return;
    }
    // 2순위: IP 기반 지역 추정
    fetch("https://ipwho.is/")
      .then((r) => r.json())
      .then((data) => {
        const slug = guessBranchFromGeo(data.city ?? "", data.region ?? "");
        setFeaturedSlug(slug);
      })
      .catch(() => {})
      .finally(() => setMounted(true));
  }, [branches]);

  const handleSelect = (slug: string) => {
    localStorage.setItem("preferredBranch", slug);
  };

  const featured = branches.find((b) => b.slug === featuredSlug) ?? branches[0];
  const others = branches.filter((b) => b.slug !== featured.slug);

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
          <FeaturedCard branch={featured} onSelect={handleSelect} />
        </div>

        {/* 나머지 4개 지점 — 오른쪽 2×2 */}
        {others.slice(0, 4).map((branch, i) => (
          <div key={branch.slug} style={{ gridColumn: 2, gridRow: i + 1, height: "100%" }}>
            <SmallCard branch={branch} onSelect={handleSelect} />
          </div>
        ))}
      </div>

      {/* 지점 선택 힌트 */}
      <p className="mt-3 text-center text-[11px]" style={{ color: "#3A3A3E" }}>
        카드를 클릭하면 다음 방문 시 해당 지점이 먼저 표시됩니다
      </p>
    </div>
  );
}
