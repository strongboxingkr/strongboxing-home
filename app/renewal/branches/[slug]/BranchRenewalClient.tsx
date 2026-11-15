"use client";

import { useState } from "react";

export function BranchTabSection({
  tabs,
  panels,
}: {
  tabs: string[];
  panels: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="mb-8 flex gap-2 flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className="rounded-full px-5 py-2 text-sm font-black transition-all duration-200"
            style={{
              background: active === i ? "#D01E2E" : "rgba(255,255,255,0.05)",
              color: active === i ? "#fff" : "#8A8D91",
              border: active === i ? "1.5px solid #D01E2E" : "1.5px solid rgba(255,255,255,0.08)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{panels[active]}</div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const show = items.slice(0, 6);
  return (
    <div className="space-y-3">
      {show.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[14px] transition-all duration-200"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: open === i ? "#1A1A1C" : "#141416" }}
        >
          <button
            className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-black text-sm md:text-base" style={{ color: "#F5F4F1" }}>{item.question}</span>
            <span
              className="shrink-0 font-black text-lg transition-transform duration-200"
              style={{ color: "#D01E2E", transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="px-7 pb-6 text-sm leading-7" style={{ color: "#8A8D91" }}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
