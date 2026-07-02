"use client";

import { Search, Bell, Plus, ChevronDown } from "lucide-react";

export default function HQHeader() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  return (
    <header
      className="flex h-[64px] items-center gap-4 px-6"
      style={{ background: "#0F1115", borderBottom: "1px solid #2A313C" }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-3 h-10 rounded-2xl border px-4 flex-1 max-w-sm transition-all duration-200 focus-within:border-[#E53935]/50"
        style={{ background: "#151922", borderColor: "#2A313C" }}
      >
        <Search size={14} color="#94A3B8" strokeWidth={2} />
        <input
          placeholder="검색..."
          className="bg-transparent text-[13px] outline-none flex-1 placeholder:text-[#94A3B8]"
          style={{ color: "#F8FAFC" }}
        />
        <kbd
          className="hidden sm:flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: "#2A313C", color: "#94A3B8" }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Date */}
      <span className="hidden lg:block text-[12px] font-medium" style={{ color: "#94A3B8" }}>
        {today}
      </span>

      {/* Notification */}
      <button
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200 hover:border-[#E53935]/40 hover:bg-[#E53935]/8"
        style={{ background: "#151922", borderColor: "#2A313C" }}
      >
        <Bell size={16} color="#94A3B8" strokeWidth={1.8} />
        <span
          className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full ring-2"
          style={{ background: "#E53935", ringColor: "#0F1115" }}
        />
      </button>

      {/* Profile */}
      <button
        className="flex items-center gap-2.5 h-10 rounded-2xl border px-3 transition-all duration-200 hover:border-white/20"
        style={{ background: "#151922", borderColor: "#2A313C" }}
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white"
          style={{ background: "linear-gradient(135deg,#E53935,#FF5722)" }}
        >
          수
        </div>
        <span className="hidden sm:block text-[13px] font-semibold" style={{ color: "#F8FAFC" }}>수지</span>
        <ChevronDown size={13} color="#94A3B8" />
      </button>

      {/* CTA */}
      <button
        className="flex items-center gap-2 h-10 rounded-2xl px-4 text-[13px] font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
        style={{
          background: "linear-gradient(135deg, #E53935 0%, #FF5722 100%)",
          boxShadow: "0 4px 16px rgba(229,57,53,0.35)",
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        <span className="hidden sm:inline">콘텐츠 등록</span>
      </button>
    </header>
  );
}
