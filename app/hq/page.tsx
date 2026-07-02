import StatsCard from "@/app/components/hq/StatsCard";
import QuickMenu from "@/app/components/hq/QuickMenu";
import {
  Zap, CheckCircle2, Circle, BellDot, Activity, ArrowRight,
} from "lucide-react";

/* ─── static data ──────────────────────────────── */

const STATS = [
  { label: "오늘 예약",   value: "12", unit: "건", sub: "방문 상담 예약",  accent: "#E53935", emoji: "📋", delta: "+3" },
  { label: "신규 문의",   value: "8",  unit: "건", sub: "미확인 문의",     accent: "#3B82F6", emoji: "💬", delta: "+5" },
  { label: "오늘 콘텐츠", value: "5",  unit: "개", sub: "업로드 예정",     accent: "#8B5CF6", emoji: "📱", delta: "오늘" },
  { label: "오늘 할 일",  value: "9",  unit: "개", sub: "미완료 항목",     accent: "#10B981", emoji: "✅", delta: "3 완료" },
];

const TODOS = [
  { text: "개봉점 SNS 게시물 업로드",  done: false },
  { text: "신정점 9월 이벤트 기획",    done: false },
  { text: "목동점 리뷰 답글 작성",     done: true  },
  { text: "철산점 신규 회원 상담 확인", done: false },
  { text: "영등포점 주간 리포트 작성", done: false },
];

const NOTICES = [
  { text: "9월 전체 지점 마케팅 방향 공유", date: "07.01", dot: "#E53935" },
  { text: "신규 코치 채용 공고 등록 필요",  date: "06.30", dot: "#F59E0B" },
  { text: "홈페이지 예약 시스템 점검 완료", date: "06.28", dot: "#10B981" },
];

const ACTIVITIES = [
  { text: "목동점 블로그 글 발행됨",         time: "1h 전",  branch: "목동",  color: "#3B82F6" },
  { text: "철산점 방문 상담 예약 3건 접수",  time: "2h 전",  branch: "철산",  color: "#E53935" },
  { text: "신정점 SNS 게시물 업로드",        time: "3h 전",  branch: "신정",  color: "#10B981" },
  { text: "개봉점 네이버 리뷰 답글 작성",   time: "오전 9시", branch: "개봉",  color: "#F59E0B" },
  { text: "영등포점 신규 회원 상담 완료",   time: "어제",    branch: "영등포", color: "#8B5CF6" },
];

/* ─── shared card shell ─────────────────────────── */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group rounded-3xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${className}`}
      style={{
        background: "linear-gradient(145deg,#181C22 0%,#1C2128 100%)",
        borderColor: "#2A313C",
        boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
}

/* ─── page ──────────────────────────────────────── */

export default function HQDashboard() {
  return (
    <div className="mx-auto max-w-[1300px] space-y-7">

      {/* ══ HERO ══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden rounded-3xl border p-8 md:p-10"
        style={{
          background: "linear-gradient(135deg,#181C22 0%,#1D1530 45%,#181C22 100%)",
          borderColor: "#2A313C",
        }}
      >
        {/* blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-[0.22]"
          style={{ background: "#E53935" }} />
        <div className="pointer-events-none absolute -bottom-20 left-16 h-56 w-56 rounded-full blur-3xl opacity-[0.14]"
          style={{ background: "#8B5CF6" }} />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: "rgba(229,57,53,0.14)",
                border: "1px solid rgba(229,57,53,0.28)",
              }}
            >
              <Zap size={11} color="#E53935" fill="#E53935" />
              <span className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: "#E53935" }}>
                STRONG BOXING HQ
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-4xl" style={{ color: "#F8FAFC" }}>
              안녕하세요, 수지님 👋
            </h1>
            <p className="mt-3 text-[15px]" style={{ color: "#94A3B8" }}>
              오늘도 스트롱복싱을 성장시켜봅시다.
            </p>
          </div>

          {/* quick-stat pills */}
          <div className="flex flex-wrap gap-3 shrink-0">
            {[
              { k: "오늘 예약", v: "12건", c: "#E53935" },
              { k: "신규 문의", v: "8건",  c: "#3B82F6" },
              { k: "목표 달성", v: "68%",  c: "#10B981" },
            ].map(({ k, v, c }) => (
              <div
                key={k}
                className="flex flex-col rounded-2xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2A313C" }}
              >
                <span className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>{k}</span>
                <span className="mt-0.5 text-xl font-black" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ STATS ══════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* ══ QUICK MENU ═════════════════════════════════ */}
      <section>
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "#94A3B8" }}>
          Quick Access
        </p>
        <QuickMenu />
      </section>

      {/* ══ BOTTOM PANELS ══════════════════════════════ */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* 오늘 할 일 */}
        <Panel className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(16,185,129,0.12)" }}>
                <CheckCircle2 size={15} color="#10B981" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>오늘 할 일</span>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-black"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
            >
              {TODOS.filter((t) => !t.done).length}건
            </span>
          </div>

          <ul className="space-y-3">
            {TODOS.map((t, i) => (
              <li key={i} className="flex cursor-pointer items-center gap-3 group/row">
                {t.done
                  ? <CheckCircle2 size={17} color="#10B981" strokeWidth={2} className="shrink-0" />
                  : <Circle size={17} color="#2A313C" strokeWidth={2} className="shrink-0 transition-colors group-hover/row:stroke-[#94A3B8]" />
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

          <button className="mt-6 flex items-center gap-1.5 text-[12px] font-bold transition-all duration-200 hover:gap-2.5" style={{ color: "#94A3B8" }}>
            전체 보기 <ArrowRight size={12} />
          </button>
        </Panel>

        {/* 공지사항 */}
        <Panel className="p-6">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(245,158,11,0.12)" }}>
              <BellDot size={15} color="#F59E0B" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>공지사항</span>
          </div>

          <ul className="space-y-2.5">
            {NOTICES.map((n, i) => (
              <li
                key={i}
                className="flex cursor-pointer items-start gap-3 rounded-2xl p-3.5 transition-all duration-200 hover:bg-white/[0.03]"
                style={{ border: "1px solid transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2A313C"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: n.dot }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-snug" style={{ color: "#F8FAFC" }}>{n.text}</p>
                  <p className="mt-1 text-[11px]" style={{ color: "#94A3B8" }}>{n.date}</p>
                </div>
              </li>
            ))}
          </ul>

          <button className="mt-5 flex items-center gap-1.5 text-[12px] font-bold transition-all duration-200 hover:gap-2.5" style={{ color: "#94A3B8" }}>
            전체 보기 <ArrowRight size={12} />
          </button>
        </Panel>

        {/* 최근 활동 */}
        <Panel className="p-6">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(59,130,246,0.12)" }}>
              <Activity size={15} color="#3B82F6" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#94A3B8" }}>최근 활동</span>
          </div>

          <ul className="space-y-4">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 shrink-0 rounded-xl px-2.5 py-0.5 text-[10px] font-black"
                  style={{ background: `${a.color}18`, color: a.color }}
                >
                  {a.branch}
                </span>
                <p className="flex-1 min-w-0 text-[13px] leading-snug" style={{ color: "#F8FAFC" }}>
                  {a.text}
                </p>
                <span className="shrink-0 text-[11px]" style={{ color: "#94A3B8" }}>{a.time}</span>
              </li>
            ))}
          </ul>

          <button className="mt-5 flex items-center gap-1.5 text-[12px] font-bold transition-all duration-200 hover:gap-2.5" style={{ color: "#94A3B8" }}>
            전체 보기 <ArrowRight size={12} />
          </button>
        </Panel>

      </div>
    </div>
  );
}
