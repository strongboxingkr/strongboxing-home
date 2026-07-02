"use client";

import StatsCard from "@/app/components/hq/StatsCard";
import QuickMenu from "@/app/components/hq/QuickMenu";
import { CheckCircle2, Circle } from "lucide-react";

const STATS = [
  { label: "오늘 예약",   value: "12", unit: "건", sub: "방문 상담 예약",  accent: "#EF3B2D" },
  { label: "신규 문의",   value: "8",  unit: "건", sub: "미확인 문의",     accent: "#3B82F6" },
  { label: "오늘 콘텐츠", value: "5",  unit: "개", sub: "업로드 예정",     accent: "#8B5CF6" },
  { label: "오늘 할 일",  value: "9",  unit: "개", sub: "미완료 항목",     accent: "#10B981" },
];

const TODOS = [
  { text: "개봉점 SNS 게시물 업로드",   done: false },
  { text: "신정점 9월 이벤트 기획",     done: false },
  { text: "목동점 리뷰 답글 작성",      done: true  },
  { text: "철산점 신규 회원 상담 확인", done: false },
  { text: "영등포점 주간 리포트 작성",  done: false },
];

const NOTICES = [
  { text: "9월 전체 지점 마케팅 방향 공유", date: "07.01" },
  { text: "신규 코치 채용 공고 등록 필요",  date: "06.30" },
  { text: "홈페이지 예약 시스템 점검 완료", date: "06.28" },
];

const ACTIVITIES = [
  { text: "목동점 블로그 글 발행됨",        time: "1h 전",  branch: "목동" },
  { text: "철산점 방문 상담 예약 3건 접수", time: "2h 전",  branch: "철산" },
  { text: "신정점 SNS 게시물 업로드",       time: "3h 전",  branch: "신정" },
  { text: "개봉점 네이버 리뷰 답글 작성",  time: "오전 9시", branch: "개봉" },
  { text: "영등포점 신규 회원 상담 완료",  time: "어제",   branch: "영등포" },
];

const card = {
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function HQDashboard() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-5">

      {/* Page title */}
      <div className="pt-1">
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>
          안녕하세요, 수지님 👋
        </h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>
          오늘도 스트롱복싱을 성장시켜봅시다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Quick Menu */}
      <section>
        <p className="mb-2.5 text-[10px] font-medium uppercase tracking-widest" style={{ color: "#C4C9D4" }}>
          빠른 메뉴
        </p>
        <QuickMenu />
      </section>

      {/* Bottom panels */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* 오늘 할 일 */}
        <div className="rounded-2xl p-5" style={card}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-bold" style={{ color: "#111827" }}>오늘 할 일</p>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "#FEF2F2", color: "#EF3B2D" }}
            >
              {TODOS.filter((t) => !t.done).length}건
            </span>
          </div>
          <ul className="space-y-3">
            {TODOS.map((t, i) => (
              <li key={i} className="flex items-center gap-2.5">
                {t.done
                  ? <CheckCircle2 size={16} color="#10B981" strokeWidth={2} className="shrink-0" />
                  : <Circle size={16} color="#D1D5DB" strokeWidth={2} className="shrink-0" />
                }
                <span
                  className="text-[13px]"
                  style={{
                    color: t.done ? "#9CA3AF" : "#374151",
                    textDecoration: t.done ? "line-through" : "none",
                  }}
                >
                  {t.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 공지사항 */}
        <div className="rounded-2xl p-5" style={card}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>공지사항</p>
          <ul className="space-y-3">
            {NOTICES.map((n, i) => (
              <li key={i} className="flex items-start gap-3" style={{ borderBottom: i < NOTICES.length - 1 ? "1px solid #F3F4F6" : "none", paddingBottom: i < NOTICES.length - 1 ? 12 : 0 }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#EF3B2D" }} />
                <div className="flex-1">
                  <p className="text-[13px]" style={{ color: "#374151" }}>{n.text}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{n.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 최근 활동 */}
        <div className="rounded-2xl p-5" style={card}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>최근 활동</p>
          <ul className="space-y-3">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold"
                  style={{ background: "#F3F4F6", color: "#9CA3AF" }}
                >
                  {a.branch}
                </span>
                <p className="flex-1 min-w-0 text-[13px] truncate" style={{ color: "#374151" }}>{a.text}</p>
                <span className="shrink-0 text-[11px]" style={{ color: "#9CA3AF" }}>{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
