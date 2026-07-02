import Link from "next/link";
import { Building2, MessageSquare, Megaphone, FileVideo, Users, FolderOpen } from "lucide-react";

const MENUS = [
  { label: "지점 관리",  href: "/hq/branches",      icon: Building2,    color: "#3B82F6", desc: "5개 지점" },
  { label: "상담 관리",  href: "/hq/consultations", icon: MessageSquare, color: "#10B981", desc: "8건 미확인" },
  { label: "마케팅",     href: "/hq/marketing",     icon: Megaphone,    color: "#F59E0B", desc: "캠페인 관리" },
  { label: "콘텐츠",     href: "/hq/contents",      icon: FileVideo,    color: "#8B5CF6", desc: "5건 대기" },
  { label: "직원 관리",  href: "/hq/staff",         icon: Users,        color: "#EC4899", desc: "전체 직원" },
  { label: "자산 관리",  href: "/hq/assets",        icon: FolderOpen,   color: "#E53935", desc: "파일 / 자산" },
];

export default function QuickMenu() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {MENUS.map(({ label, href, icon: Icon, color, desc }) => (
        <Link
          key={href}
          href={href}
          className="group relative rounded-2xl border p-4 flex flex-col items-center gap-2.5 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{
            background: "linear-gradient(145deg, #181C22, #1a1f28)",
            borderColor: "#2A313C",
          }}
        >
          {/* hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}20 0%, transparent 70%)` }}
          />

          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
          >
            <Icon size={20} color={color} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[13px] font-bold" style={{ color: "#F8FAFC" }}>{label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{desc}</p>
          </div>

          {/* bottom border highlight */}
          <div
            className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-400"
            style={{ background: color }}
          />
        </Link>
      ))}
    </div>
  );
}
