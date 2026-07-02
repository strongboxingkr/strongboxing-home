interface Props {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  accent?: string;
}

export default function StatsCard({ label, value, unit = "", sub = "", accent = "#EF3B2D" }: Props) {
  return (
    <div
      className="rounded-2xl border p-4 transition-shadow hover:shadow-md"
      style={{
        background: "#FFFFFF",
        borderColor: "#E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "#9CA3AF" }}>
        {label}
      </p>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black tracking-tight" style={{ color: "#111827" }}>{value}</span>
        {unit && <span className="mb-0.5 text-[13px] font-semibold" style={{ color: "#6B7280" }}>{unit}</span>}
      </div>
      {sub && <p className="mt-1 text-[11px]" style={{ color: "#9CA3AF" }}>{sub}</p>}
      <div className="mt-3 h-[2px] w-6 rounded-full" style={{ background: accent }} />
    </div>
  );
}
