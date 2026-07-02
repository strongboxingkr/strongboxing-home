"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/hq/navigation";

export default function HQMobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 text-zinc-600">☰</button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-56 bg-white shadow-xl py-6">
            <div className="mb-4 flex items-center justify-between px-4">
              <span className="text-sm font-black text-[#FC5230]">STRONGBOXING HQ</span>
              <button onClick={() => setOpen(false)} className="text-zinc-400">✕</button>
            </div>
            <nav className="flex flex-col gap-1 px-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
