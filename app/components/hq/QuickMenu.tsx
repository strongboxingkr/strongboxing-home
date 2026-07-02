import Link from "next/link";

const MENUS = [
  { label: "상담 예약", href: "/hq/consultation", icon: "📋" },
  { label: "콘텐츠 작성", href: "/hq/contents", icon: "✍️" },
  { label: "마케팅", href: "/hq/marketing", icon: "📣" },
  { label: "분석", href: "/hq/analytics", icon: "📈" },
];

export default function QuickMenu() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MENUS.map((m) => (
        <Link key={m.href} href={m.href} className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-center hover:border-[#FC5230]">
          <span className="text-2xl">{m.icon}</span>
          <span className="text-xs font-bold text-zinc-600">{m.label}</span>
        </Link>
      ))}
    </div>
  );
}
