"use client";

import { Lightbulb } from "lucide-react";

const KPI = [
  { label: "예약 전환율",      value: "43", unit: "%",  accent: "#10B981" },
  { label: "상담 등록률",      value: "38", unit: "%",  accent: "#3B82F6" },
  { label: "콘텐츠 업로드",   value: "24", unit: "개", accent: "#8B5CF6" },
  { label: "평균 문의 단가",  value: "9,700", unit: "원", accent: "#EF3B2D" },
];

const BRANCH_COMPARE = [
  { name: "목동",   inquiry: 30, reg: 14, sales: 590, content: 8, color: "#8B5CF6" },
  { name: "신정",   inquiry: 31, reg: 15, sales: 720, content: 5, color: "#10B981" },
  { name: "개봉",   inquiry: 25, reg: 10, sales: 680, content: 4, color: "#3B82F6" },
  { name: "철산",   inquiry: 28, reg: 12, sales: 630, content: 5, color: "#EF3B2D" },
  { name: "영등포", inquiry: 18, reg: 7,  sales: 620, content: 2, color: "#F59E0B" },
];

const TOP_CONTENT = [
  { title: "목동 학생 샌드백 릴스",    branch: "목동",   views: 12400, conv: 8 },
  { title: "철산 여고생 복싱 연습",    branch: "철산",   views: 9800,  conv: 6 },
  { title: "개봉 미트 훈련 영상",      branch: "개봉",   views: 7600,  conv: 4 },
  { title: "신정 여성 미트 운동",      branch: "신정",   views: 6200,  conv: 5 },
  { title: "목동 여름방학 특강 소식",  branch: "목동",   views: 5100,  conv: 3 },
];

const KEYWORDS = [
  { word: "회비",    count: 48, pct: 90 },
  { word: "원데이",  count: 32, pct: 60 },
  { word: "학생",    count: 28, pct: 53 },
  { word: "다이어트",count: 22, pct: 41 },
  { word: "PT",      count: 18, pct: 34 },
  { word: "운영시간",count: 14, pct: 26 },
];

const INSIGHTS = [
  { branch: "목동",   icon: "📈", text: "목동은 학생 관련 콘텐츠 반응이 좋습니다." },
  { branch: "철산",   icon: "📊", text: "철산은 주말운동 문의가 증가했습니다." },
  { branch: "개봉",   icon: "💡", text: "개봉은 고척동 키워드 노출을 강화하는 것이 좋습니다." },
];

const BRANCH_COLOR: Record<string, string> = {
  목동: "#8B5CF6", 신정: "#10B981", 개봉: "#3B82F6", 철산: "#EF3B2D", 영등포: "#F59E0B",
};

const cardStyle = { background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } as const;

const maxInq = Math.max(...BRANCH_COMPARE.map((b) => b.inquiry));

export default function AnalyticsPage() {
  return (
    <div className="max-w-[1360px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>분석</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>지점별 성과와 운영 지표를 한눈에 확인합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-2xl border px-5 py-4 transition-all duration-200 hover:shadow-md" style={cardStyle}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>{k.label}</p>
            <div className="flex items-end gap-1">
              <span className="text-[28px] font-black leading-none" style={{ color: "#111827" }}>{k.value}</span>
              <span className="text-[13px] font-semibold mb-0.5" style={{ color: "#6B7280" }}>{k.unit}</span>
            </div>
            <div className="mt-3 h-[2px] w-6 rounded-full" style={{ background: k.accent }} />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 지점별 비교 */}
        <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
          <p className="text-[14px] font-bold mb-5" style={{ color: "#111827" }}>지점별 비교</p>
          <div className="mb-2 grid grid-cols-5 text-center">
            {["지점","문의","등록","매출(만)","콘텐츠"].map((h) => (
              <span key={h} className="text-[10px] font-semibold" style={{ color: "#9CA3AF" }}>{h}</span>
            ))}
          </div>
          <div className="space-y-3">
            {BRANCH_COMPARE.map((b) => (
              <div key={b.name}>
                <div className="grid grid-cols-5 text-center mb-1.5">
                  <span className="text-[12px] font-bold" style={{ color: b.color }}>{b.name}</span>
                  <span className="text-[12px] font-semibold" style={{ color: "#111827" }}>{b.inquiry}</span>
                  <span className="text-[12px] font-semibold" style={{ color: "#111827" }}>{b.reg}</span>
                  <span className="text-[12px] font-semibold" style={{ color: "#111827" }}>{b.sales}</span>
                  <span className="text-[12px] font-semibold" style={{ color: "#111827" }}>{b.content}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(b.inquiry / maxInq) * 100}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상담 키워드 */}
        <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
          <p className="text-[14px] font-bold mb-5" style={{ color: "#111827" }}>상담 키워드 분석</p>
          <div className="space-y-3">
            {KEYWORDS.map((k, i) => (
              <div key={k.word}>
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black w-4 text-center" style={{ color: i < 3 ? "#EF3B2D" : "#9CA3AF" }}>{i + 1}</span>
                    <span className="text-[13px] font-semibold" style={{ color: "#374151" }}>{k.word}</span>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: "#111827" }}>{k.count}건</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${k.pct}%`, background: i < 3 ? "#EF3B2D" : "#E5E7EB" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 5 콘텐츠 */}
      <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
        <p className="text-[14px] font-bold mb-4" style={{ color: "#111827" }}>인기 콘텐츠 TOP 5</p>
        <div className="space-y-3">
          {TOP_CONTENT.map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
              <span className="text-[13px] font-black w-5 text-center shrink-0"
                style={{ color: i < 3 ? "#EF3B2D" : "#9CA3AF" }}>{i + 1}</span>
              <p className="flex-1 text-[13px] font-semibold min-w-0 truncate" style={{ color: "#111827" }}>{c.title}</p>
              <span className="text-[10px] font-semibold rounded-md px-2 py-0.5 shrink-0"
                style={{ background: `${BRANCH_COLOR[c.branch] ?? "#6B7280"}14`, color: BRANCH_COLOR[c.branch] ?? "#6B7280" }}>
                {c.branch}
              </span>
              <span className="text-[12px] font-bold shrink-0" style={{ color: "#374151" }}>{c.views.toLocaleString()}</span>
              <span className="text-[10px] font-semibold rounded-md px-2 py-0.5 shrink-0"
                style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>전환 {c.conv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 인사이트 */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>이번달 인사이트</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {INSIGHTS.map((ins) => (
            <div key={ins.branch}
              className="rounded-2xl p-5 flex gap-3 transition-all duration-200 hover:shadow-md"
              style={{ ...cardStyle, borderLeft: `3px solid ${BRANCH_COLOR[ins.branch] ?? "#6B7280"}` }}>
              <div className="text-xl shrink-0">{ins.icon}</div>
              <div>
                <p className="text-[11px] font-bold mb-1" style={{ color: BRANCH_COLOR[ins.branch] ?? "#6B7280" }}>{ins.branch}점</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "#374151" }}>{ins.text}</p>
              </div>
              <Lightbulb size={14} color="#9CA3AF" className="shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
