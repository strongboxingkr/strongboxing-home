"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, LayoutDashboard, Building2, MessageSquare,
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

export default function HQMobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/hq" ? pathname === "/hq" : pathname.startsWith(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl border"
        style={{ background: "#151922", borderColor: "#2A313C" }}
      >
        <Menu size={17} color="#94A3B8" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="w-[280px] flex flex-col h-full"
            style={{ background: "#151922", borderRight: "1px solid #2A313C" }}
          >
            <div className="flex items-center justify-between px-6 py-6 border-b" style={{ borderColor: "#2A313C" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-2xl text-lg"
                  style={{ background: "linear-gradient(135deg,#E53935,#FF5722)", boxShadow: "0 6px 16px rgba(229,57,53,0.4)" }}
                >
                  🥊
                </div>
                <div>
                  <p className="text-[13px] font-black" style={{ color: "#F8FAFC" }}>STRONG HQ</p>
                  <p className="text-[10px] tracking-widest uppercase" style={{ color: "#94A3B8" }}>Management System</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <X size={15} color="#94A3B8" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {NAV.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200"
                    style={{
                      background: active ? "rgba(229,57,53,0.15)" : "transparent",
                      border: active ? "1px solid rgba(229,57,53,0.25)" : "1px solid transparent",
                    }}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ background: active ? "rgba(229,57,53,0.2)" : "rgba(255,255,255,0.05)" }}
                    >
                      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} color={active ? "#E53935" : "#94A3B8"} />
                    </div>
                    <span className="text-[14px] font-semibold" style={{ color: active ? "#F8FAFC" : "#94A3B8" }}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
