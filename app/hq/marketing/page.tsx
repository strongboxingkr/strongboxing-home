"use client";

import { useState } from "react";
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

/* ── 상수 ─────────────────────────────────────────── */

const PERIODS = ["오늘", "이번주", "이번달", "지난달", "최근3개월"] as const;

const KPI = [
  { label: "이번달 문의", value: "132", unit: "건",    accent: "#EF3B2D", delta: "+12%", up: true  },
  { label: "신규 등록",   value: "58",  unit: "명",    accent: "#3B82F6", delta: "+8%",  up: true  },
  { label: "전환율",      value: "43",  unit: "%",     accent: "#10B981", delta: "+3%",  up: true  },
  { label: "광고비",      value: "128", unit: "만원",  accent: "#F59E0B", delta: "-5%",  up: false },
];

const CHANNELS = [
  { name: "네이버",  inquiry: 48, reg: 22, rate: 45, spend: 40 },
  { name: "당근",    inquiry: 32, reg: 14, rate: 43, spend: 15 },
  { name: "인스타",  inquiry: 20, reg: 9,  rate: 45, spend: 20 },
  { name: "카카오",  inquiry: 18, reg: 7,  rate: 38, spend: 25 },
  { name: "블로그",  inquiry: 14, reg: 6,  rate: 42, spend: 28 },
];

const BRANCHES = [
  { name: "목동",   inquiry: 30, reg: 14, color: "#8B5CF6" },
  { name: "신정",   inquiry: 31, reg: 15, color: "#10B981" },
  { name: "개봉",   inquiry: 25, reg: 10, color: "#3B82F6" },
  { name: "철산",   inquiry: 28, reg: 12, color: "#EF3B2D" },
  { name: "영등포", inquiry: 18, reg: 7,  color: "#F59E0B" },
];

const TOP_CONTENTS = [
  { title: "목동 학생 샌드백 릴스",    branch: "목동",   views: 12400, likes: 380, date: "07.02" },
  { title: "철산 여고생 복싱 연습",    branch: "철산",   views: 9800,  likes: 290, date: "07.01" },
  { title: "개봉 미트 훈련 영상",      branch: "개봉",   views: 7600,  likes: 210, date: "06.30" },
  { title: "신정 여성 회원 미트 운동", branch: "신정",   views: 6200,  likes: 175, date: "07.01" },
  { title: "목동 여름방학 특강 소식",  branch: "목동",   views: 5100,  likes: 140, date: "07.02" },
];

const FUNNEL = [
  { label: "네이버",  pct: 36, color: "#3B82F6" },
  { label: "당근",    pct: 24, color: "#F59E0B" },
  { label: "인스타",  pct: 15, color: "#EC4899" },
  { label: "카카오",  pct: 10, color: "#F59E0B" },
  { label: "지인소개",pct:  8, color: "#10B981" },
  { label: "지나가다",pct:  4, color: "#8B5CF6" },
  { label: "기타",    pct:  3, color: "#9CA3AF" },
];

const MONTHLY = [18,22,30,38,45,50,48,55,60,58,42,38];

const RECENTS = [
  { name: "김○○", branch: "목동",   src: "네이버",  product: "주3회 1개월",  date: "07.02" },
  { name: "이○○", branch: "철산",   src: "당근",    product: "자유 3개월",   date: "07.01" },
  { name: "박○○", branch: "개봉",   src: "인스타",  product: "주2회 1개월",  date: "07.01" },
  { name: "최○○", branch: "신정",   src: "지인소개", product: "자유 1개월",  date: "06.30" },
  { name: "정○○", branch: "영등포", src: "네이버",  product: "주3회 3개월",  date: "06.29" },
];

const BRANCH_COLOR: Record<string, string> = {
  목동: "#8B5CF6", 신정: "#10B981", 개봉: "#3B82F6", 철산: "#EF3B2D", 영등포: "#F59E0B",
};

const QUICK = [
  { label: "네이버 광고", icon: "🔵" },
  { label: "메타 광고",   icon: "🟣" },
  { label: "당근",        icon: "🟠" },
  { label: "블로그",      icon: "🟢" },
];

/* ── 공용 카드 껍데기 ──────────────────────────────── */

const cardStyle = {
  background: "#FFFFFF",
  borderColor: "#E5E7EB",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
} as const;

/* ── 도넛 차트 (SVG) ─────────────────────────────── */

function DonutChart() {
  const r = 60, cx = 80, cy = 80, stroke = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = FUNNEL.map((f) => {
    const dash  = (f.pct / 100) * circ;
    const gap   = circ - dash;
    const slice = { ...f, dash, gap, offset };
    offset += dash;
    return slice;
  });
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontWeight="600">총 유입</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="18" fill="#111827" fontWeight="900">132</text>
      </svg>
      <div className="space-y-1.5">
        {FUNNEL.map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: f.color }} />
            <span className="text-[12px]" style={{ color: "#374151" }}>{f.label}</span>
            <span className="text-[12px] font-bold ml-auto pl-4" style={{ color: "#111827" }}>{f.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 라인 차트 (SVG) ─────────────────────────────── */

function LineChart() {
  const W = 480, H = 120, PAD = 20;
  const max  = Math.max(...MONTHLY);
  const pts  = MONTHLY.map((v, i) => {
    const x = PAD + (i / (MONTHLY.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v / max) * (H - PAD * 2));
    return { x, y, v };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ maxHeight: 140 }}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF3B2D" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#EF3B2D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)" />
      <path d={path} fill="none" stroke="#EF3B2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#EF3B2D" />
          <text x={p.x} y={H + 14} textAnchor="middle" fontSize="9" fill="#9CA3AF">{months[i]}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── 페이지 ────────────────────────────────────────── */

export default function MarketingPage() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>("이번달");

  return (
    <div className="max-w-[1360px] mx-auto space-y-6">

      {/* 제목 + 기간 */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>마케팅</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>문의·등록·전환율·광고비를 한눈에 확인합니다.</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-150"
              style={{
                background: period === p ? "#EF3B2D" : "#F3F4F6",
                color: period === p ? "#FFF" : "#6B7280",
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label}
            className="rounded-2xl border px-5 py-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={cardStyle}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>{k.label}</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-[32px] font-black leading-none" style={{ color: "#111827" }}>{k.value}</span>
              <span className="text-[13px] font-semibold mb-0.5" style={{ color: "#6B7280" }}>{k.unit}</span>
            </div>
            <div className="flex items-center gap-1">
              {k.up ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF3B2D" />}
              <span className="text-[11px] font-semibold" style={{ color: k.up ? "#10B981" : "#EF3B2D" }}>{k.delta}</span>
              <span className="text-[11px]" style={{ color: "#9CA3AF" }}>전월 대비</span>
            </div>
            <div className="mt-3 h-[2px] w-8 rounded-full" style={{ background: k.accent }} />
          </div>
        ))}
      </div>

      {/* 채널별 성과 */}
      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>채널별 성과</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CHANNELS.map((ch) => (
            <div key={ch.name}
              className="rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={cardStyle}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "#111827" }}>{ch.name}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>문의</span>
                  <span className="text-[13px] font-black" style={{ color: "#111827" }}>{ch.inquiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>등록</span>
                  <span className="text-[13px] font-black" style={{ color: "#111827" }}>{ch.reg}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>전환율</span>
                  <span className="text-[12px] font-black rounded-md px-1.5 py-0.5"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>{ch.rate}%</span>
                </div>
              </div>
              <div className="mt-3 h-1 w-full rounded-full" style={{ background: "#F3F4F6" }}>
                <div className="h-1 rounded-full" style={{ width: `${ch.rate}%`, background: "#10B981" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 지점별 성과 */}
      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>지점별 성과</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BRANCHES.map((b) => (
            <div key={b.name}
              className="rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={cardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                <p className="text-[13px] font-bold" style={{ color: "#111827" }}>{b.name}점</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>문의</span>
                  <span className="text-[14px] font-black" style={{ color: "#111827" }}>{b.inquiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>등록</span>
                  <span className="text-[14px] font-black" style={{ color: "#111827" }}>{b.reg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>전환율</span>
                  <span className="text-[12px] font-bold" style={{ color: b.color }}>
                    {Math.round((b.reg / b.inquiry) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 인기 콘텐츠 + 유입 경로 */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* TOP 5 */}
        <div className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>이번주 인기 콘텐츠 TOP 5</p>
          <ol className="space-y-3">
            {TOP_CONTENTS.map((c, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-[13px] font-black w-5 text-center shrink-0"
                  style={{ color: i < 3 ? "#EF3B2D" : "#9CA3AF" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "#111827" }}>{c.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5"
                      style={{ background: `${BRANCH_COLOR[c.branch]}14`, color: BRANCH_COLOR[c.branch] }}>
                      {c.branch}
                    </span>
                    <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{c.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-bold" style={{ color: "#374151" }}>{c.views.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: "#9CA3AF" }}>❤ {c.likes}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 유입 경로 도넛 */}
        <div className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>문의 유입 경로</p>
          <DonutChart />
        </div>
      </div>

      {/* 월별 추이 */}
      <div className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
        <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>월별 문의 추이 (2026)</p>
        <LineChart />
      </div>

      {/* 광고 ROI 테이블 */}
      <div className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
        <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>광고 ROI</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                {["채널","광고비","문의","등록","획득비용(1인)","전환율"].map((h) => (
                  <th key={h} className="text-left pb-2.5 pr-4 font-semibold" style={{ color: "#9CA3AF" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((ch) => (
                <tr key={ch.name} style={{ borderBottom: "1px solid #F9FAFB" }}>
                  <td className="py-2.5 pr-4 font-semibold" style={{ color: "#111827" }}>{ch.name}</td>
                  <td className="py-2.5 pr-4" style={{ color: "#374151" }}>{ch.spend}만원</td>
                  <td className="py-2.5 pr-4" style={{ color: "#374151" }}>{ch.inquiry}건</td>
                  <td className="py-2.5 pr-4" style={{ color: "#374151" }}>{ch.reg}명</td>
                  <td className="py-2.5 pr-4 font-semibold" style={{ color: "#374151" }}>
                    {Math.round((ch.spend * 10000) / ch.reg).toLocaleString()}원
                  </td>
                  <td className="py-2.5">
                    <span className="rounded-md px-2 py-0.5 font-bold"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>{ch.rate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 등록 */}
      <div className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
        <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>최근 등록</p>
        <div className="space-y-2.5">
          {RECENTS.map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                style={{ background: BRANCH_COLOR[r.branch] ?? "#6B7280" }}>
                {r.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold" style={{ color: "#111827" }}>{r.name}</p>
                <p className="text-[10px]" style={{ color: "#9CA3AF" }}>{r.product}</p>
              </div>
              <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: `${BRANCH_COLOR[r.branch] ?? "#6B7280"}14`, color: BRANCH_COLOR[r.branch] ?? "#6B7280" }}>
                {r.branch}
              </span>
              <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: "#F3F4F6", color: "#6B7280" }}>{r.src}</span>
              <span className="text-[11px] shrink-0" style={{ color: "#9CA3AF" }}>{r.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>광고 채널 바로가기</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK.map((q) => (
            <button key={q.label} onClick={() => alert("준비중")}
              className="flex flex-col items-center gap-2.5 rounded-2xl border py-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={cardStyle}>
              <span className="text-2xl">{q.icon}</span>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "#111827" }}>{q.label}</p>
                <p className="text-[10px] flex items-center justify-center gap-0.5 mt-0.5" style={{ color: "#9CA3AF" }}>
                  바로가기 <ExternalLink size={9} />
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
