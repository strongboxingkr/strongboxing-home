"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ReservationButton from "./ReservationButton";

type NavItem =
  | { label: string; id: string }
  | { label: string; href: string };

const NAV: NavItem[] = [
  { label: "지점",       id: "branches" },
  { label: "프로그램",   id: "programs" },
  { label: "클립",       id: "clips" },
  { label: "네이버 후기", id: "reviews" },
  { label: "지도진",     id: "coaches" },
  { label: "소식",       href: "/blog" },
  { label: "문의",       id: "contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBlog = pathname.startsWith("/blog");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active section tracking via IntersectionObserver (home only)
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = NAV
      .filter((n): n is { label: string; id: string } => "id" in n)
      .map((n) => n.id);

    const visibility: Record<string, number> = {};

    const observers = sectionIds.flatMap((id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibility[id] = entry.intersectionRatio;
          const best = Object.entries(visibility).sort((a, b) => b[1] - a[1])[0];
          if (best && best[1] > 0.05) setActiveId(best[0]);
        },
        { threshold: [0, 0.05, 0.15, 0.3], rootMargin: "-72px 0px -45% 0px" }
      );
      obs.observe(el);
      return [obs];
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const isActive = (item: NavItem) => {
    if ("href" in item) return isBlog;
    return isHome && activeId === item.id;
  };

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full"
      style={{
        background: "rgba(14,14,16,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* 로고 */}
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/icon.png" alt="스트롱복싱" className="h-7 w-7 object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-black tracking-[0.08em]" style={{ color: "#F5F4F1" }}>STRONG</span>
            <span className="text-[9px] font-black tracking-[0.22em]" style={{ color: "#D01E2E" }}>— BOXING —</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item);
            const cls =
              "relative pb-0.5 text-sm font-semibold transition-colors hover:text-white";
            const color = active ? "#F5F4F1" : "#8A8D91";
            const dot = active ? (
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-full rounded-full"
                style={{ background: "#D01E2E" }}
              />
            ) : null;

            if ("href" in item) {
              return (
                <a key={item.label} href={item.href} className={cls} style={{ color }}>
                  {item.label}
                  {dot}
                </a>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={cls}
                style={{ color }}
              >
                {item.label}
                {dot}
              </button>
            );
          })}
        </nav>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <ReservationButton className="hidden rounded-[10px] bg-[#D01E2E] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#B71C2B] lg:block">
            방문 상담 예약
          </ReservationButton>

          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] lg:hidden"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8A8D91" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileOpen ? "max-h-screen" : "max-h-0"}`}
        style={{ borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.06)" : "none", background: "rgba(14,14,16,0.97)" }}
      >
        <nav className="flex flex-col px-6 py-3">
          {NAV.map((item, i) => {
            const active = isActive(item);
            const isLast = i === NAV.length - 1;
            const baseStyle: React.CSSProperties = {
              borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
              color: active ? "#F5F4F1" : "#8A8D91",
            };

            if ("href" in item) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-4 text-sm font-semibold"
                  style={baseStyle}
                >
                  {item.label}
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#D01E2E" }} />
                  )}
                </a>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="flex w-full items-center justify-between py-4 text-sm font-semibold"
                style={baseStyle}
              >
                {item.label}
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#D01E2E" }} />
                )}
              </button>
            );
          })}

          <div className="pb-4 pt-3">
            <ReservationButton className="w-full rounded-[10px] bg-[#D01E2E] py-3.5 text-sm font-black text-white transition hover:bg-[#B71C2B]">
              방문 상담 예약
            </ReservationButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
