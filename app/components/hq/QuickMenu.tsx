import Link from "next/link";
import { Building2, MessageSquare, Megaphone, Clapperboard, Users, Archive } from "lucide-react";

const ITEMS = [
  { label: "지점 관리", href: "/hq/branches",      icon: Building2,    color: "#3B82F6", desc: "5개 지점" },
  { label: "상담 센터", href: "/hq/consultations", icon: MessageSquare, color: "#10B981", desc: "8건 대기" },
  { label: "마케팅",    href: "/hq/marketing",     icon: Megaphone,    color: "#F59E0B", desc: "캠페인" },
  { label: "콘텐츠",   href: "/hq/contents",      icon: Clapperboard, color: "#8B5CF6", desc: "5개 예정" },
  { label: "직원",     href: "/hq/staff",         icon: Users,        color: "#EC4899", desc: "전체 직원" },
  { label: "자료실",   href: "/hq/assets",        icon: Archive,      color: "#E53935", desc: "파일 관리" },
];

export default function QuickMenu() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {ITEMS.map(({ label, href, icon: Icon, color, desc }) => (
        <Link
          key={href}
          href={href}
          className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background: "linear-gradient(145deg,#181C22 0%,#1C2128 100%)",
            borderColor: "#2A313C",
          }}
        >
          {/* per-card glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `radial-gradient(ellipse at 50% 10%,${color}28 0%,transparent 68%)` }}
          />

          {/* bottom accent */}
          <div
            className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full rounded-b-3xl"
            style={{ background: color }}
          />

          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            style={{
              background: `${color}18`,
              border: `1px solid ${color}35`,
              boxShadow: `0 0 0 0 ${color}00`,
            }}
          >
            <Icon size={24} color={color} strokeWidth={1.8} />
          </div>

          <div className="relative">
            <p className="text-[13px] font-bold" style={{ color: "#F8FAFC" }}>{label}</p>
            <p className="mt-0.5 text-[10px]" style={{ color: "#94A3B8" }}>{desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
