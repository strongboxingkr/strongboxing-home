"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, LayoutDashboard, Building2, MessageSquare, Megaphone, FileVideo, Users, FolderOpen, Settings } from "lucide-react";

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

export default function HQMobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/hq") return pathname === "/hq";
    return pathname.startsWith(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:border-[#E53935]"
        style={{ background: "#181C22", borderColor: "#2A313C" }}
      >
        <Menu size={16} color="#94A3B8" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Drawer */}
          <div
            className="w-[260px] flex flex-col h-full border-r"
            style={{ background: "#0F1115", borderColor: "#2A313C" }}
          >
            {/* Brand */}
            <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: "#2A313C" }}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ background: "linear-gradient(135deg,#E53935,#FF6B35)" }}
                >
                  <Zap size={14} fill="white" color="white" />
                </div>
                <span className="text-[13px] font-black tracking-widest" style={{ color: "#F8FAFC" }}>STRONG HQ</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-all"
              >
                <X size={15} color="#94A3B8" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {NAV.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/5"
                    style={{
                      background: active ? "rgba(229,57,53,0.12)" : "transparent",
                      color: active ? "#E53935" : "#94A3B8",
                    }}
                  >
                    <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[13px] font-semibold">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Backdrop */}
          <div className="flex-1 backdrop-blur-sm bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
