"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Plus } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/hq": "대시보드",
  "/hq/branches": "지점 관리",
  "/hq/consultations": "상담 관리",
  "/hq/marketing": "마케팅",
  "/hq/contents": "콘텐츠",
  "/hq/staff": "직원 관리",
  "/hq/assets": "자산 관리",
  "/hq/settings": "설정",
};

export default function HQHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "STRONG HQ";
  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });

  return (
    <header
      className="flex h-[60px] items-center justify-between px-6 border-b"
      style={{ background: "#0F1115", borderColor: "#2A313C" }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-black" style={{ color: "#F8FAFC" }}>{title}</h1>
        <span
          className="hidden sm:block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide"
          style={{ background: "rgba(148,163,184,0.1)", color: "#94A3B8" }}
        >
          {today}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl border px-3 h-9 w-48 transition-all"
          style={{ background: "#181C22", borderColor: "#2A313C" }}
        >
          <Search size={13} color="#94A3B8" />
          <input
            placeholder="검색..."
            className="bg-transparent outline-none text-[13px] w-full placeholder:text-[#94A3B8]"
            style={{ color: "#F8FAFC" }}
          />
        </div>

        {/* Bell */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:border-[#E53935] hover:bg-[#E53935]/10"
          style={{ background: "#181C22", borderColor: "#2A313C" }}
        >
          <Bell size={15} color="#94A3B8" />
          <span
            className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
            style={{ background: "#E53935" }}
          />
        </button>

        {/* CTA */}
        <button
          className="flex items-center gap-1.5 rounded-xl px-3 h-9 text-[13px] font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg,#E53935,#FF6B35)" }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">콘텐츠 등록</span>
        </button>
      </div>
    </header>
  );
}
