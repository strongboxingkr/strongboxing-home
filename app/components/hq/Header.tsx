"use client";

import { Search, Bell, Plus } from "lucide-react";

export default function HQHeader() {
  const today = new Date().toLocaleDateString("ko-KR", {
    month: "long", day: "numeric", weekday: "short",
  });

  return (
    <header
      className="flex h-[62px] shrink-0 items-center gap-3 px-6"
      style={{ background: "#0F1115", borderBottom: "1px solid #2A313C" }}
    >
      {/* Search */}
      <div
        className="group flex h-9 flex-1 max-w-[320px] items-center gap-2.5 rounded-xl border px-3.5 transition-colors duration-200 focus-within:border-[rgba(229,57,53,0.5)]"
        style={{ background: "#151922", borderColor: "#2A313C" }}
      >
        <Search size={13} color="#94A3B8" strokeWidth={2} />
        <input
          placeholder="검색..."
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#94A3B8]"
          style={{ color: "#F8FAFC" }}
        />
        <kbd
          className="hidden sm:block rounded-md px-1.5 py-0.5 text-[10px] font-bold"
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

      {/* Bell */}
      <button
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:border-[rgba(229,57,53,0.4)] hover:bg-[rgba(229,57,53,0.08)]"
        style={{ background: "#151922", borderColor: "#2A313C" }}
      >
        <Bell size={15} color="#94A3B8" strokeWidth={1.8} />
        <span
          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
          style={{ background: "#E53935", outline: "2px solid #0F1115" }}
        />
      </button>

      {/* CTA */}
      <button
        className="flex h-9 items-center gap-2 rounded-xl px-4 text-[13px] font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
        style={{
          background: "linear-gradient(135deg,#E53935 0%,#FF6030 100%)",
          boxShadow: "0 4px 18px rgba(229,57,53,0.38)",
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        <span className="hidden sm:inline">콘텐츠 등록</span>
      </button>
    </header>
  );
}
