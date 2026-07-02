"use client";

import { useState } from "react";
import { Search, Copy, Check, Plus } from "lucide-react";

/* ── 타입 ─────────────────────────────────────────── */

interface Channel { insta: boolean; clip: boolean; blog: boolean; dangn: boolean; kakao: boolean; }
interface Content {
  id: number; title: string; branch: string; type: string; status: string;
  date: string; manager: string; body: string; tags: string; clipTitle: string;
  channels: Channel;
}

/* ── 데이터 ───────────────────────────────────────── */

const CONTENTS: Content[] = [
  {
    id: 1, title: "목동점 학생 샌드백 릴스", branch: "목동", type: "릴스", status: "업로드대기",
    date: "2026-07-02", manager: "수지",
    body: `방학이라고 집에만 있기 아쉽다면🥊\n\n신나게 운동하고,\n체력도 같이 키워보세요.\n\n📍스트롱복싱 목동점`,
    tags: "#목동복싱 #양천구복싱 #목동운동 #다이어트복싱 #스트롱복싱목동점",
    clipTitle: "목동복싱장 학생 체력운동 루틴",
    channels: { insta: false, clip: false, blog: false, dangn: false, kakao: false },
  },
  {
    id: 2, title: "철산점 여고생 복싱 연습", branch: "철산", type: "릴스", status: "편집중",
    date: "2026-07-01", manager: "수지",
    body: `운동도 하고, 든든함도 챙기고.\n\n처음 시작하는 분들도 기초부터 차근차근 배울 수 있어요🥊\n\n📍스트롱복싱 철산점`,
    tags: "#철산복싱 #광명복싱 #철산동복싱 #철산역복싱 #스트롱복싱철산점",
    clipTitle: "철산복싱 초보자도 가능한 기본기 연습",
    channels: { insta: true, clip: false, blog: false, dangn: false, kakao: false },
  },
  {
    id: 3, title: "개봉점 미트 훈련 영상", branch: "개봉", type: "네이버클립", status: "업로드완료",
    date: "2026-06-30", manager: "관장",
    body: `복싱은 어렵게 시작하지 않아도 됩니다.\n\n기초부터 미트까지,\n내 속도에 맞춰 차근차근 배워보세요🥊\n\n📍스트롱복싱 개봉점`,
    tags: "#개봉복싱 #구로복싱 #고척동복싱 #개봉동운동 #스트롱복싱개봉점",
    clipTitle: "개봉동 복싱장 미트 훈련 수업",
    channels: { insta: true, clip: true, blog: false, dangn: false, kakao: false },
  },
  {
    id: 4, title: "목동 여름방학 특강 소식", branch: "목동", type: "블로그", status: "업로드대기",
    date: "2026-07-02", manager: "수지",
    body: `목동복싱장 스트롱복싱 목동점에서 여름방학 특강을 진행합니다.\n\n오전 10시, 11시 수업으로 학생들도 방학 기간 동안 규칙적으로 운동할 수 있습니다.\n전문 입시 코칭 프로그램과 체력 향상, 기술 훈련도 함께 가능합니다.`,
    tags: "#목동복싱 #목동복싱장 #양천구복싱 #여름방학특강 #스트롱복싱목동점",
    clipTitle: "목동복싱장 여름방학 특강 안내",
    channels: { insta: false, clip: false, blog: false, dangn: false, kakao: false },
  },
  {
    id: 5, title: "철산점 주말 자율운동 안내", branch: "철산", type: "당근", status: "아이디어",
    date: "2026-07-03", manager: "수지",
    body: `주말에도 복싱으로 가볍게 땀 흘리고 싶다면🥊\n\n스트롱복싱 철산점은 주말 운영도 함께 진행합니다.\n초보자분들도 기초 루틴 안내 가능합니다.`,
    tags: "#철산복싱 #광명운동 #철산동운동 #주말운동 #스트롱복싱철산점",
    clipTitle: "철산동 주말 복싱 운동 안내",
    channels: { insta: false, clip: false, blog: false, dangn: false, kakao: false },
  },
  {
    id: 6, title: "신정점 여성 회원 미트 운동", branch: "신정", type: "인스타", status: "촬영완료",
    date: "2026-07-01", manager: "코치",
    body: `처음엔 어렵게 느껴져도,\n한 라운드씩 따라오다 보면 어느새 땀이 쭉🥊\n\n스트레스 풀고 체력도 키우는 복싱 운동.\n📍스트롱복싱 신정점`,
    tags: "#신정복싱 #양천구복싱 #신정동운동 #여성복싱 #스트롱복싱신정점",
    clipTitle: "신정동 여성 복싱 미트 운동",
    channels: { insta: false, clip: false, blog: false, dangn: false, kakao: false },
  },
];

const BRANCHES  = ["전체", "개봉", "신정", "목동", "철산", "영등포"];
const TYPES     = ["전체", "릴스", "네이버클립", "블로그", "당근", "카카오", "인스타", "전단지"];
const STATUSES  = ["전체", "아이디어", "촬영완료", "편집중", "업로드대기", "업로드완료"];

const BRANCH_COLOR: Record<string, string> = {
  전체: "#6B7280", 개봉: "#3B82F6", 신정: "#10B981",
  목동: "#8B5CF6", 철산: "#EF3B2D", 영등포: "#F59E0B",
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  아이디어:    { bg: "#F3F4F6",           color: "#6B7280" },
  촬영완료:    { bg: "rgba(59,130,246,0.1)", color: "#3B82F6" },
  편집중:      { bg: "rgba(245,158,11,0.1)", color: "#D97706" },
  업로드대기:  { bg: "rgba(239,59,45,0.1)",  color: "#EF3B2D" },
  업로드완료:  { bg: "rgba(16,185,129,0.1)", color: "#059669" },
};

/* ── 복사 버튼 ────────────────────────────────────── */

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-150"
      style={{ background: done ? "#ECFDF5" : "#F3F4F6", color: done ? "#059669" : "#374151" }}
    >
      {done ? <Check size={11} /> : <Copy size={11} />}
      {done ? "복사됨" : label}
    </button>
  );
}

/* ── 채널 체크 ────────────────────────────────────── */

function ChannelCheck({ label, done }: { label: string; done: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium"
      style={{ background: done ? "rgba(16,185,129,0.1)" : "#F3F4F6", color: done ? "#059669" : "#9CA3AF" }}
    >
      {done ? "✓" : "○"} {label}
    </span>
  );
}

/* ── 요약 카드 ────────────────────────────────────── */

function SummaryCard({ label, value, accent = "#111827" }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="flex-1 rounded-2xl border px-4 py-3.5"
      style={{ background: "#FFFFFF", borderColor: "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#9CA3AF" }}>{label}</p>
      <p className="text-[24px] font-black" style={{ color: accent }}>{value}</p>
    </div>
  );
}

/* ── 콘텐츠 카드 ──────────────────────────────────── */

function ContentCard({ c }: { c: Content }) {
  const bc   = BRANCH_COLOR[c.branch] ?? "#6B7280";
  const st   = STATUS_STYLE[c.status] ?? STATUS_STYLE["아이디어"];

  return (
    <div className="flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: "#FFFFFF", borderColor: "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

      {/* header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[14px] font-bold leading-snug" style={{ color: "#111827" }}>{c.title}</p>
          <span className="shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: st.bg, color: st.color }}>{c.status}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: `${bc}14`, color: bc }}>📍 {c.branch}점</span>
          <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: "#F3F4F6", color: "#6B7280" }}>📹 {c.type}</span>
          <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: "#F3F4F6", color: "#6B7280" }}>📅 {c.date}</span>
          <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: "#F3F4F6", color: "#6B7280" }}>👤 {c.manager}</span>
        </div>
      </div>

      {/* body */}
      <div className="px-5 pb-3 space-y-2.5">
        <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans rounded-xl p-3 max-h-32 overflow-y-auto"
          style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #F3F4F6" }}>
          {c.body}
        </pre>
        <p className="text-[11px] leading-relaxed" style={{ color: "#6B7280" }}>{c.tags}</p>
        <p className="text-[11px]" style={{ color: "#9CA3AF" }}>📌 클립 제목: <span style={{ color: "#374151" }}>{c.clipTitle}</span></p>
      </div>

      {/* channels */}
      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        <ChannelCheck label="인스타" done={c.channels.insta} />
        <ChannelCheck label="네이버클립" done={c.channels.clip} />
        <ChannelCheck label="블로그" done={c.channels.blog} />
        <ChannelCheck label="당근" done={c.channels.dangn} />
        <ChannelCheck label="카카오" done={c.channels.kakao} />
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3.5"
        style={{ borderTop: "1px solid #F3F4F6" }}>
        <CopyBtn text={c.body}      label="게시글 복사" />
        <CopyBtn text={c.tags}      label="해시태그 복사" />
        <CopyBtn text={c.clipTitle} label="클립 제목 복사" />
      </div>
    </div>
  );
}

/* ── 페이지 ────────────────────────────────────────── */

export default function ContentsPage() {
  const [query,    setQuery]    = useState("");
  const [branch,   setBranch]   = useState("전체");
  const [type,     setType]     = useState("전체");
  const [status,   setStatus]   = useState("전체");

  const results = CONTENTS.filter((c) => {
    const okB = branch === "전체" || c.branch === branch;
    const okT = type   === "전체" || c.type   === type;
    const okS = status === "전체" || c.status === status;
    const q   = query.trim().toLowerCase();
    const okQ = !q || [c.title, c.branch, c.type, c.tags, c.body, c.clipTitle]
      .some((s) => s.toLowerCase().includes(q));
    return okB && okT && okS && okQ;
  });

  function pill(active: boolean, color = "#EF3B2D"): React.CSSProperties {
    return { background: active ? color : "#F3F4F6", color: active ? "#FFF" : "#6B7280", transition: "all .15s" };
  }

  const done  = CONTENTS.filter((c) => c.status === "업로드완료").length;
  const wait  = CONTENTS.filter((c) => c.status === "업로드대기").length;
  const shoot = CONTENTS.filter((c) => c.date === "2026-07-02" || c.date === "2026-07-03").length;

  return (
    <div className="max-w-[1360px] mx-auto space-y-5">

      {/* 제목 + 등록 버튼 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>콘텐츠 관리</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>사진·영상·게시글·해시태그를 한 곳에서 관리합니다.</p>
        </div>
        <button
          onClick={() => alert("콘텐츠 등록 준비중")}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
          style={{ background: "#EF3B2D" }}
        >
          <Plus size={14} strokeWidth={2.5} /> 콘텐츠 등록
        </button>
      </div>

      {/* 요약 */}
      <div className="flex gap-3">
        <SummaryCard label="전체 콘텐츠"  value={CONTENTS.length} />
        <SummaryCard label="업로드 대기"  value={wait}  accent="#EF3B2D" />
        <SummaryCard label="업로드 완료"  value={done}  accent="#059669" />
        <SummaryCard label="이번 주 촬영" value={shoot} accent="#8B5CF6" />
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-2.5 h-11 rounded-2xl border px-4 focus-within:border-[#EF3B2D]/40 transition-colors"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Search size={15} color="#9CA3AF" />
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="지점, 콘텐츠 유형, 해시태그, 제목 검색…"
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9CA3AF]"
          style={{ color: "#111827" }} />
      </div>

      {/* 지점 필터 */}
      <div className="flex flex-wrap gap-2">
        {BRANCHES.map((b) => (
          <button key={b} onClick={() => setBranch(b)}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={pill(branch === b, BRANCH_COLOR[b])}>
            {b}
          </button>
        ))}
      </div>

      {/* 유형 필터 */}
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setType(t)}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={pill(type === t)}>
            {t}
          </button>
        ))}
      </div>

      {/* 상태 필터 */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={pill(status === s, STATUS_STYLE[s]?.color ?? "#EF3B2D")}>
            {s}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      <p className="text-[12px]" style={{ color: "#9CA3AF" }}>{results.length}개의 콘텐츠</p>

      {/* 카드 그리드 */}
      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((c) => <ContentCard key={c.id} c={c} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-[14px]" style={{ color: "#9CA3AF" }}>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
