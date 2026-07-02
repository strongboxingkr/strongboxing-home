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

  function isActive(href: string) {
    return href === "/hq" ? pathname === "/hq" : pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden md:flex flex-col w-[280px] shrink-0 h-screen"
      style={{ background: "#151922", borderRight: "1px solid #2A313C" }}
    >
      {/* Logo */}
      <div className="px-7 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-black shadow-lg"
            style={{
              background: "linear-gradient(135deg, #E53935 0%, #FF5722 100%)",
              boxShadow: "0 8px 24px rgba(229,57,53,0.4)",
            }}
          >
            🥊
          </div>
          <div>
            <p className="text-[14px] font-black tracking-tight" style={{ color: "#F8FAFC" }}>STRONG HQ</p>
            <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "#94A3B8" }}>Management System</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-5 h-px" style={{ background: "#2A313C" }} />

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200"
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(229,57,53,0.18) 0%, rgba(229,57,53,0.06) 100%)"
                  : "transparent",
                border: active ? "1px solid rgba(229,57,53,0.25)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2A313C";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                }
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: "#E53935" }}
                />
              )}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: active ? "rgba(229,57,53,0.2)" : "rgba(255,255,255,0.05)",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                  color={active ? "#E53935" : "#94A3B8"}
                />
              </div>
              <span
                className="text-[14px] font-semibold"
                style={{ color: active ? "#F8FAFC" : "#94A3B8" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer badge */}
      <div className="px-5 py-6">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(229,57,53,0.12) 0%, rgba(255,87,34,0.06) 100%)",
            border: "1px solid rgba(229,57,53,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#E53935" }} />
            <span className="text-[11px] font-black tracking-widest" style={{ color: "#E53935" }}>LIVE</span>
          </div>
          <p className="text-[12px] font-semibold" style={{ color: "#F8FAFC" }}>5개 지점 운영 중</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>개봉 · 신정 · 목동 · 철산 · 영등포</p>
        </div>
      </div>
    </aside>
  );
}
