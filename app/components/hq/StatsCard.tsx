import type { StatsData } from "@/lib/hq/types";

export default function StatsCard({ label, value, change, trend }: StatsData) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-xs font-bold text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-black text-zinc-900">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-bold ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-zinc-400"}`}>
          {change}
        </p>
      )}
    </div>
  );
}
