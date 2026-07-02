"use client";

interface Props {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent?: string;
  emoji?: string;
  delta?: string;
}

export default function StatsCard({
  label, value, unit = "", sub = "", accent = "#E53935", emoji = "📊", delta,
}: Props) {
  return (
    <div
      className="group relative cursor-default overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "linear-gradient(145deg,#181C22 0%,#1C2128 100%)",
        borderColor: "#2A313C",
        boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* hover radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
        style={{ background: `radial-gradient(ellipse at 30% 0%,${accent}22 0%,transparent 65%)` }}
      />

      {/* animated bottom bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full rounded-b-3xl"
        style={{ background: `linear-gradient(90deg,${accent},transparent)` }}
      />

      <div className="relative flex flex-col h-full">
        {/* top row */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>
            {label}
          </span>
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{emoji}</span>
        </div>

        {/* value */}
        <div className="flex items-end gap-1.5 mb-3">
          <span className="text-5xl font-black leading-none tracking-tight" style={{ color: "#F8FAFC" }}>
            {value}
          </span>
          {unit && (
            <span className="mb-1 text-lg font-bold" style={{ color: "#94A3B8" }}>{unit}</span>
          )}
        </div>

        {/* bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-[12px]" style={{ color: "#94A3B8" }}>{sub}</span>
          {delta && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-black"
              style={{ background: `${accent}18`, color: accent }}
            >
              {delta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
