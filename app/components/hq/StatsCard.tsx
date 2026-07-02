interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: string;
  accent?: string;
  delta?: string;
}

export default function StatsCard({
  title, value, description, icon, accent = "#E53935", delta,
}: StatsCardProps) {
  return (
    <div
      className="group relative rounded-2xl border p-5 overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
      style={{
        background: "linear-gradient(145deg, #181C22 0%, #1a1f28 100%)",
        borderColor: "#2A313C",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 70%)` }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
          {title}
        </span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[18px] transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${accent}1A` }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="text-4xl font-black tracking-tight leading-none" style={{ color: "#F8FAFC" }}>
        {value}
      </p>

      {/* Bottom row */}
      <div className="mt-3 flex items-center justify-between">
        {description && (
          <p className="text-[12px]" style={{ color: "#94A3B8" }}>{description}</p>
        )}
        {delta && (
          <span className="text-[11px] font-bold" style={{ color: accent }}>{delta}</span>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </div>
  );
}
