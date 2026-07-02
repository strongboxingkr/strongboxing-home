import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", href: "/hq/dashboard", icon: "📊" },
  { label: "지점 관리", href: "/hq/branches", icon: "🏢" },
  { label: "상담 예약", href: "/hq/consultation", icon: "📋" },
  { label: "마케팅", href: "/hq/marketing", icon: "📣" },
  { label: "콘텐츠", href: "/hq/contents", icon: "✍️" },
  { label: "스태프", href: "/hq/staff", icon: "👤" },
  { label: "재무", href: "/hq/finance", icon: "💰" },
  { label: "자산", href: "/hq/assets", icon: "📦" },
  { label: "캘린더", href: "/hq/calendar", icon: "📅" },
  { label: "분석", href: "/hq/analytics", icon: "📈" },
  { label: "설정", href: "/hq/settings", icon: "⚙️" },
];
