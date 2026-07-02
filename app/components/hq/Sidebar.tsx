"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, MessageSquare, Megaphone,
  FileVideo, Users, FolderOpen, Settings, ChevronRight, Zap
} from "lucide-react";

const NAV = [
  { label: "대시보드",   href: "/hq",               icon: LayoutDashboard },
  { label: "지점 관리",  href: "/hq/branches",       icon: Building2 },
  { label: "상담 관리",  href: "/hq/consultations",  icon: MessageSquare },
  { label: "마케팅",     href: "/hq/marketing",      icon: Megaphone },
  { label: "콘텐츠",     href: "/hq/contents",       icon: FileVideo },
  { label: "직원 관리",  href: "/hq/staff",          icon: Users },
  { label: "자산 관리",  href: "/hq/assets",         icon: FolderOpen },
  { label: "설정",       href: "/hq/settings",       icon: Settings },
];

export default function HQSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/hq") return pathname === "/hq";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] shrink-0 h-screen border-r"
      style={{ background: "#0F1115", borderColor: "#2A313C" }}
    >
      {/* Brand */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "#2A313C" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg"
            style={{ background: "linear-gradient(135deg,#E53935 0%,#FF6B35 100%)" }}
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <div>
            <p className="text-[13px] font-black tracking-widest" style={{ color: "#F8FAFC" }}>STRONG HQ</p>
            <p className="text-[10px]" style={{ color: "#94A3B8" }}>운영 관리 시스템</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/5"
              style={{
                background: active ? "rgba(229,57,53,0.12)" : "transparent",
                color: active ? "#E53935" : "#94A3B8",
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[13px] font-semibold">{label}</span>
              </div>
              {active && <ChevronRight size={13} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5">
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(229,57,53,0.08)", border: "1px solid rgba(229,57,53,0.18)" }}
        >
          <p className="text-[11px] font-black tracking-widest" style={{ color: "#E53935" }}>STRONG BOXING</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>5개 지점 운영 중</p>
        </div>
      </div>
    </aside>
  );
}
