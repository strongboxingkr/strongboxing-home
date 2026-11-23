"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

const labels = { home: "홈", workout: "운동 안내", blog: "블로그", videos: "영상", reviews: "리뷰", location: "시설·위치" };
type Tab = keyof typeof labels;
const tabs = Object.keys(labels) as Tab[];
const Navigate = createContext<(tab: Tab) => void>(() => {});

export function ConsultationLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a href="#contact" className={className} onClick={() => {
      const details = document.getElementById("contact");
      if (details instanceof HTMLDetailsElement) details.open = true;
    }}>{children}</a>
  );
}

export function TabLink({ tab, children }: { tab: Tab; children: ReactNode }) {
  const navigate = useContext(Navigate);
  return <button type="button" onClick={() => navigate(tab)} className="text-sm font-bold text-[#D01E2E] hover:underline">{children}</button>;
}

export default function BranchPreviewTabs({ panels, sidebar }: { panels: Record<Tab, ReactNode>; sidebar: ReactNode }) {
  const [active, setActive] = useState<Tab>("home");
  const buttons = useRef<Partial<Record<Tab, HTMLButtonElement>>>({});

  function navigate(tab: Tab) {
    setActive(tab);
    buttons.current[tab]?.focus();
  }

  return (
    <Navigate.Provider value={navigate}>
      <div role="tablist" aria-label="지점 정보" className="grid grid-cols-3 border-y border-[#29292D] bg-[#0E0E10] sm:grid-cols-6">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(button) => { if (button) buttons.current[tab] = button; }}
            type="button"
            id={`branch-tab-${tab}`}
            role="tab"
            aria-selected={active === tab}
            aria-controls={`branch-panel-${tab}`}
            tabIndex={active === tab ? 0 : -1}
            onClick={() => setActive(tab)}
            onKeyDown={(event) => {
              const next = { ArrowLeft: (index + tabs.length - 1) % tabs.length, ArrowRight: (index + 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
              if (next === undefined) return;
              event.preventDefault();
              navigate(tabs[next]);
            }}
            className="min-h-12 border-b-2 border-transparent px-1 text-sm font-semibold text-[#B5B5BC] hover:text-[#D01E2E] aria-selected:border-[#D01E2E] aria-selected:text-[#F5F4F1]"
          >{labels[tab]}</button>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 py-5 md:grid-cols-[minmax(0,1fr)_minmax(245px,0.43fr)] md:gap-6 md:py-7">
        <div className="min-w-0">
          {tabs.map((tab) => (
            <div key={tab} role="tabpanel" id={`branch-panel-${tab}`} aria-labelledby={`branch-tab-${tab}`} hidden={active !== tab} tabIndex={0} className="space-y-5">
              {active === tab && panels[tab]}
            </div>
          ))}
        </div>
        <aside className="min-w-0 space-y-5 md:self-start">{sidebar}</aside>
      </div>
    </Navigate.Provider>
  );
}
