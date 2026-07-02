import StatsCard from "@/app/components/hq/StatsCard";
import QuickMenu from "@/app/components/hq/QuickMenu";
import { CheckSquare, BellRing, Activity, ArrowRight } from "lucide-react";

const STATS = [
  { title: "오늘 예약",    value: 12, description: "방문 상담 예약",  icon: "📋", accent: "#E53935", delta: "↑ 3" },
  { title: "신규 문의",    value: 8,  description: "미확인 문의",     icon: "💬", accent: "#3B82F6", delta: "↑ 5" },
  { title: "업로드 예정",  value: 5,  description: "콘텐츠 대기",     icon: "✍️", accent: "#8B5CF6", delta: "오늘" },
  { title: "오늘 할 일",   value: 9,  description: "미완료 항목",     icon: "✅", accent: "#10B981", delta: "3 완료" },
];

const TODOS = [
  { text: "개봉점 SNS 게시물 업로드",     done: false },
  { text: "신정점 9월 이벤트 기획",       done: false },
  { text: "목동점 리뷰 답글 작성",        done: true  },
  { text: "철산점 신규 회원 상담 확인",   done: false },
  { text: "영등포점 주간 리포트 작성",    done: false },
];

const NOTICES = [
  { text: "9월 전체 지점 마케팅 방향 공유", date: "2026.07.01", dot: "#E53935" },
  { text: "신규 코치 채용 공고 등록 필요",  date: "2026.06.30", dot: "#F59E0B" },
  { text: "홈페이지 예약 시스템 점검 완료", date: "2026.06.28", dot: "#10B981" },
];

const ACTIVITIES = [
  { text: "목동점 블로그 글 발행됨",        time: "1시간 전",  branch: "목동" },
  { text: "철산점 방문 상담 예약 3건 접수", time: "2시간 전",  branch: "철산" },
  { text: "신정점 SNS 게시물 업로드",       time: "3시간 전",  branch: "신정" },
  { text: "개봉점 네이버 리뷰 답글 작성",   time: "오전 9:20", branch: "개봉" },
  { text: "영등포점 신규 회원 상담 완료",   time: "어제",      branch: "영등포" },
];

const BRANCH_COLORS: Record<string, string> = {
  목동: "#3B82F6", 철산: "#E53935", 신정: "#10B981", 개봉: "#F59E0B", 영등포: "#8B5CF6",
};

export default function HQDashboard() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">

      {/* ─── Hero ───────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl border p-8 md:p-10"
        style={{
          background: "linear-gradient(135deg, #181C22 0%, #1E1428 50%, #181C22 100%)",
          borderColor: "#2A313C",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#E53935" }}
        />
        <div
          className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "#8B5CF6" }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-black tracking-widest"
              style={{ background: "rgba(229,57,53,0.15)", color: "#E53935", border: "1px solid rgba(229,57,53,0.3)" }}
            >
              STRONG BOXING HQ
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "#F8FAFC" }}>
            안녕하세요 👋
          </h1>
          <p className="mt-2 text-[14px] max-w-xl" style={{ color: "#94A3B8" }}>
            지점 운영 · 상담 · 마케팅 · 콘텐츠를 한 곳에서 관리합니다.
          </p>
        </div>
      </div>

      {/* ─── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* ─── Quick Menu ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-black tracking-widest uppercase" style={{ color: "#94A3B8" }}>
            Quick Access
          </h2>
        </div>
        <QuickMenu />
      </section>

      {/* ─── Bottom 3 col ───────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-3">

        {/* 오늘 할 일 */}
        <div
          className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          style={{
            background: "linear-gradient(145deg,#181C22,#1a1f28)",
            borderColor: "#2A313C",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CheckSquare size={15} color="#10B981" />
              <h2 className="text-[12px] font-black tracking-widest uppercase" style={{ color: "#94A3B8" }}>
                오늘 할 일
              </h2>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
            >
              {TODOS.filter((t) => !t.done).length}건
            </span>
          </div>

          <ul className="space-y-3">
            {TODOS.map((t, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
                  style={{
                    borderColor: t.done ? "#10B981" : "#2A313C",
                    background: t.done ? "rgba(16,185,129,0.2)" : "transparent",
                    color: "#10B981",
                    fontSize: 10,
                  }}
                >
                  {t.done && "✓"}
                </span>
                <span
                  className="text-[13px]"
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

          <button
            className="mt-5 flex items-center gap-1.5 text-[11px] font-bold transition-colors hover:text-[#E53935]"
            style={{ color: "#94A3B8" }}
          >
            전체 보기 <ArrowRight size={11} />
          </button>
        </div>

        {/* 공지사항 */}
        <div
          className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          style={{
            background: "linear-gradient(145deg,#181C22,#1a1f28)",
            borderColor: "#2A313C",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BellRing size={15} color="#F59E0B" />
              <h2 className="text-[12px] font-black tracking-widest uppercase" style={{ color: "#94A3B8" }}>
                공지사항
              </h2>
            </div>
          </div>

          <ul className="space-y-4">
            {NOTICES.map((n, i) => (
              <li
                key={i}
                className="group/item rounded-xl p-3 border transition-all cursor-pointer hover:border-white/10"
                style={{ borderColor: "#2A313C", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: n.dot }}
                  />
                  <div>
                    <p className="text-[13px] font-semibold leading-snug" style={{ color: "#F8FAFC" }}>{n.text}</p>
                    <p className="mt-1 text-[10px]" style={{ color: "#94A3B8" }}>{n.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="mt-5 flex items-center gap-1.5 text-[11px] font-bold transition-colors hover:text-[#E53935]"
            style={{ color: "#94A3B8" }}
          >
            전체 보기 <ArrowRight size={11} />
          </button>
        </div>

        {/* 최근 활동 */}
        <div
          className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          style={{
            background: "linear-gradient(145deg,#181C22,#1a1f28)",
            borderColor: "#2A313C",
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity size={15} color="#3B82F6" />
            <h2 className="text-[12px] font-black tracking-widest uppercase" style={{ color: "#94A3B8" }}>
              최근 활동
            </h2>
          </div>

          <ul className="space-y-3">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-black shrink-0"
                  style={{
                    background: `${BRANCH_COLORS[a.branch] ?? "#94A3B8"}18`,
                    color: BRANCH_COLORS[a.branch] ?? "#94A3B8",
                  }}
                >
                  {a.branch}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug truncate" style={{ color: "#F8FAFC" }}>{a.text}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{a.time}</p>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="mt-5 flex items-center gap-1.5 text-[11px] font-bold transition-colors hover:text-[#E53935]"
            style={{ color: "#94A3B8" }}
          >
            전체 보기 <ArrowRight size={11} />
          </button>
        </div>

      </div>
    </div>
  );
}
