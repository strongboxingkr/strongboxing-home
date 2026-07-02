import {
  Building2, MessageSquare, Clapperboard, Megaphone,
  Users, Archive, ArrowRight, CheckCircle2, Circle,
  BellDot, Zap, TrendingUp,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────── */

const STATS = [
  { label: "오늘 예약",    value: "12",  unit: "건", sub: "방문 상담",      accent: "#E53935", icon: "📋", delta: "+3" },
  { label: "신규 문의",    value: "8",   unit: "건", sub: "미확인",         accent: "#3B82F6", icon: "💬", delta: "+5" },
  { label: "오늘 콘텐츠",  value: "5",   unit: "개", sub: "업로드 예정",    accent: "#8B5CF6", icon: "📱", delta: "오늘" },
  { label: "이번달 목표",  value: "68",  unit: "%",  sub: "목표 달성률",    accent: "#10B981", icon: "🎯", delta: "↑12%" },
];

const QUICK = [
  { label: "지점 관리", href: "/hq/branches",      icon: Building2,    color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  desc: "5개 지점" },
  { label: "상담 센터", href: "/hq/consultations", icon: MessageSquare, color: "#10B981", bg: "rgba(16,185,129,0.12)", desc: "8건 대기" },
  { label: "콘텐츠",   href: "/hq/contents",      icon: Clapperboard, color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", desc: "5개 예정" },
  { label: "마케팅",   href: "/hq/marketing",     icon: Megaphone,    color: "#F59E0B", bg: "rgba(245,158,11,0.12)", desc: "캠페인 관리" },
  { label: "직원",     href: "/hq/staff",         icon: Users,        color: "#EC4899", bg: "rgba(236,72,153,0.12)", desc: "전체 직원" },
  { label: "자료실",   href: "/hq/assets",        icon: Archive,      color: "#E53935", bg: "rgba(229,57,53,0.12)",  desc: "파일 관리" },
];

const TODOS = [
  { text: "개봉점 SNS 게시물 업로드", done: false },
  { text: "신정점 9월 이벤트 기획",   done: false },
  { text: "목동점 리뷰 답글 작성",    done: true  },
  { text: "철산점 신규 회원 상담",    done: false },
  { text: "영등포점 주간 리포트",     done: false },
];

const NOTICES = [
  { text: "9월 전체 지점 마케팅 방향 공유", date: "07.01", dot: "#E53935" },
  { text: "신규 코치 채용 공고 등록 필요",  date: "06.30", dot: "#F59E0B" },
  { text: "홈페이지 예약 시스템 점검 완료", date: "06.28", dot: "#10B981" },
];

const ACTIVITIES = [
  { text: "목동점 블로그 글 발행됨",          time: "1h",  branch: "목동",  color: "#3B82F6" },
  { text: "철산점 방문 상담 예약 3건 접수",  time: "2h",  branch: "철산",  color: "#E53935" },
  { text: "신정점 SNS 게시물 업로드",         time: "3h",  branch: "신정",  color: "#10B981" },
  { text: "개봉점 네이버 리뷰 답글 작성",    time: "9:20", branch: "개봉",  color: "#F59E0B" },
  { text: "영등포점 신규 회원 상담 완료",    time: "어제", branch: "영등포", color: "#8B5CF6" },
];

/* ── Card shell ────────────────────────────────────── */

function Card({
  children, className = "", style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 ${className}`}
      style={{
        background: "linear-gradient(145deg,#181C22 0%,#1C2128 100%)",
        borderColor: "#2A313C",
        boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────── */

export default function HQDashboard() {
  return (
    <div className="max-w-[1280px] mx-auto space-y-8">

      {/* ── Hero ────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 md:p-10 border"
        style={{
          background: "linear-gradient(135deg, #181C22 0%, #1E1830 40%, #181C22 100%)",
          borderColor: "#2A313C",
        }}
      >
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "#E53935" }} />
        <div className="absolute -bottom-24 left-24 h-56 w-56 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{ background: "#8B5CF6" }} />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
              style={{ background: "rgba(229,57,53,0.15)", border: "1px solid rgba(229,57,53,0.3)" }}>
              <Zap size={11} color="#E53935" fill="#E53935" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#E53935" }}>
                STRONG BOXING HQ
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: "#F8FAFC" }}>
              안녕하세요, 수지님 👋
            </h1>
            <p className="mt-3 text-[15px]" style={{ color: "#94A3B8" }}>
              오늘도 스트롱복싱을 성장시켜봅시다.
            </p>
          </div>

          {/* Mini stats pill */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "오늘 예약", val: "12건", color: "#E53935" },
              { label: "신규 문의", val: "8건",  color: "#3B82F6" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl px-4 py-3 flex flex-col"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2A313C" }}
              >
                <span className="text-[11px] font-medium" style={{ color: "#94A3B8" }}>{item.label}</span>
                <span className="text-xl font-black mt-0.5" style={{ color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card key={s.label} className="p-6 group cursor-default overflow-hidden relative">
            {/* Top glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
              style={{ background: `radial-gradient(ellipse at 30% 0%, ${s.accent}18 0%, transparent 65%)` }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>
                  {s.label}
                </span>
                <div
                  className="text-2xl transition-transform duration-300 group-hover:scale-110"
                >
                  {s.icon}
                </div>
              </div>
              <div className="flex items-end gap-1.5">
                <span
                  className="text-5xl font-black leading-none tracking-tight"
                  style={{ color: "#F8FAFC" }}
                >
                  {s.value}
                </span>
                <span className="text-lg font-bold mb-1" style={{ color: "#94A3B8" }}>{s.unit}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[12px]" style={{ color: "#94A3B8" }}>{s.sub}</span>
                <span
                  className="text-[11px] font-black rounded-full px-2 py-0.5"
                  style={{ background: `${s.accent}18`, color: s.accent }}
                >
                  {s.delta}
                </span>
              </div>
              {/* accent bar */}
              <div
                className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl"
                style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* ── Quick Menu ──────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: "#94A3B8" }}>
            Quick Access
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK.map(({ label, href, icon: Icon, color, bg, desc }) => (
            <a
              key={href}
              href={href}
              className="group relative flex flex-col items-center gap-3 rounded-3xl p-5 text-center overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: "linear-gradient(145deg,#181C22,#1C2128)",
                border: "1px solid #2A313C",
              }}
            >
              {/* per-card glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                style={{ background: `radial-gradient(ellipse at 50% 20%, ${color}22 0%, transparent 70%)` }}
              />
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                style={{ background: bg, border: `1px solid ${color}30` }}
              >
                <Icon size={24} color={color} strokeWidth={1.8} />
              </div>
              <div className="relative">
                <p className="text-[13px] font-bold" style={{ color: "#F8FAFC" }}>{label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{desc}</p>
              </div>
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
              />
            </a>
          ))}
        </div>
      </section>

      {/* ── Bottom 3-col ────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* 오늘 할 일 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                <TrendingUp size={15} color="#10B981" />
              </div>
              <h3 className="text-[13px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>할 일</h3>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-black"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
            >
              {TODOS.filter((t) => !t.done).length}건
            </span>
          </div>

          <ul className="space-y-3">
            {TODOS.map((t, i) => (
              <li key={i} className="flex items-center gap-3 group/item cursor-pointer">
                {t.done
                  ? <CheckCircle2 size={18} color="#10B981" strokeWidth={2} className="shrink-0" />
                  : <Circle size={18} color="#2A313C" strokeWidth={2} className="shrink-0 group-hover/item:text-[#94A3B8] transition-colors" />
                }
                <span
                  className="text-[13px] leading-snug"
                  style={{
                    color: t.done ? "#94A3B8" : "#F8FAFC",
                    textDecoration: t.done ? "line-through" : "none",
                  }}
                >
                  {t.text}
                </span>
              </li>
            ))}
          </ul>

          <button className="mt-6 flex items-center gap-1.5 text-[12px] font-bold transition-colors hover:gap-2.5 duration-200" style={{ color: "#94A3B8" }}>
            전체 보기 <ArrowRight size={12} />
          </button>
        </Card>

        {/* 공지사항 */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)" }}>
              <BellDot size={15} color="#F59E0B" />
            </div>
            <h3 className="text-[13px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>공지사항</h3>
          </div>

          <ul className="space-y-3">
            {NOTICES.map((n, i) => (
              <li
                key={i}
                className="group/item flex items-start gap-3 rounded-2xl p-3.5 transition-all duration-200 cursor-pointer"
                style={{ border: "1px solid transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2A313C";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                }}
              >
                <div className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: n.dot }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-snug" style={{ color: "#F8FAFC" }}>{n.text}</p>
                  <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>{n.date}</p>
                </div>
              </li>
            ))}
          </ul>

          <button className="mt-4 flex items-center gap-1.5 text-[12px] font-bold transition-all hover:gap-2.5 duration-200" style={{ color: "#94A3B8" }}>
            전체 보기 <ArrowRight size={12} />
          </button>
        </Card>

        {/* 최근 활동 */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)" }}>
              <Zap size={15} color="#3B82F6" />
            </div>
            <h3 className="text-[13px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>최근 활동</h3>
          </div>

          <ul className="space-y-4">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 shrink-0 rounded-xl px-2 py-0.5 text-[10px] font-black"
                  style={{ background: `${a.color}18`, color: a.color }}
                >
                  {a.branch}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug" style={{ color: "#F8FAFC" }}>{a.text}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium" style={{ color: "#94A3B8" }}>{a.time}</span>
              </li>
            ))}
          </ul>

          <button className="mt-4 flex items-center gap-1.5 text-[12px] font-bold transition-all hover:gap-2.5 duration-200" style={{ color: "#94A3B8" }}>
            전체 보기 <ArrowRight size={12} />
          </button>
        </Card>

      </div>
    </div>
  );
}
