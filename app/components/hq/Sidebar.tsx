"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, MessageSquare,
  Megaphone, Clapperboard, Users, Archive, Settings,
} from "lucide-react";

const NAV = [
  { label: "대시보드",  href: "/hq",               icon: LayoutDashboard },
  { label: "지점 관리", href: "/hq/branches",       icon: Building2 },
  { label: "상담 센터", href: "/hq/consultations",  icon: MessageSquare },
  { label: "콘텐츠",    href: "/hq/contents",       icon: Clapperboard },
  { label: "마케팅",    href: "/hq/marketing",      icon: Megaphone },
  { label: "직원",      href: "/hq/staff",          icon: Users },
  { label: "자료실",    href: "/hq/assets",         icon: Archive },
  { label: "설정",      href: "/hq/settings",       icon: Settings },
];

export default function HQSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/hq" ? pathname === "/hq" : pathname.startsWith(href);

  return (
    <aside
      className="hidden md:flex flex-col h-screen w-[280px] shrink-0 select-none"
      style={{ background: "#151922", borderRight: "1px solid #2A313C" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3.5 px-7 py-7">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xl"
          style={{
            background: "linear-gradient(135deg,#E53935 0%,#FF6030 100%)",
            boxShadow: "0 0 24px rgba(229,57,53,0.45)",
          }}
        >
          🥊
        </div>
        <div>
          <p className="text-[13px] font-black tracking-tight leading-none" style={{ color: "#F8FAFC" }}>
            STRONG OS
          </p>
          <p className="mt-1 text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: "#94A3B8" }}>
            Management System
          </p>
        </div>
      </div>

      <div className="mx-6 h-px" style={{ background: "#2A313C" }} />

      {/* Nav */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 transition-all duration-200"
              style={{
                background: active ? "rgba(229,57,53,0.13)" : "transparent",
                border: `1px solid ${active ? "rgba(229,57,53,0.22)" : "transparent"}`,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.borderColor = "#2A313C";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "transparent";
                }
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                  style={{ background: "#E53935" }}
                />
              )}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: active ? "rgba(229,57,53,0.18)" : "rgba(255,255,255,0.05)",
                }}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.7}
                  color={active ? "#E53935" : "#94A3B8"}
                  className="transition-all duration-200"
                />
              </div>
              <span
                className="text-[14px] font-semibold transition-colors duration-200"
                style={{ color: active ? "#F8FAFC" : "#94A3B8" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 pb-6 pt-2">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(229,57,53,0.07)",
            border: "1px solid rgba(229,57,53,0.18)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#E53935" }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#E53935" }}>LIVE</span>
          </div>
          <p className="text-[12px] font-bold" style={{ color: "#F8FAFC" }}>5개 지점 운영 중</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>개봉 · 신정 · 목동 · 철산 · 영등포</p>
        </div>
      </div>
    </aside>
  );
}
