"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw, Upload, Clock, ChevronRight } from "lucide-react";

/* ── 상수 ─────────────────────────────────────────── */

const BRANCHES   = ["개봉", "신정", "목동", "철산", "영등포"];
const TYPES      = ["릴스", "네이버클립", "블로그", "당근", "카카오", "인스타"];
const TARGETS    = ["학생", "여성", "직장인", "다이어트", "키즈", "초보자"];
const MOODS      = ["자연스럽게", "짧게", "홍보스럽지 않게", "학부모용", "개인계정 느낌"];

const QUICK_PROMPTS = [
  "학생 방학특강 홍보",
  "여성 다이어트 복싱",
  "직장인 스트레스 해소",
  "초보자 첫 복싱 클래스",
  "주말 운동 안내",
];

const DUMMY: Record<string, string> = {
  insta: `방학이라고 집에만 있기 아쉽다면🥊

신나게 운동하고,
체력도 같이 키워보세요.

📍스트롱복싱 목동점`,
  clip: "목동복싱장 학생 체력운동 루틴",
  blog: `목동복싱장 스트롱복싱 목동점에서는 학생들도 쉽게 따라올 수 있는 기초 복싱 수업을 진행하고 있습니다. 줄넘기, 기본 자세, 샌드백, 체력운동까지 단계별로 진행되어 처음 운동을 시작하는 학생들도 부담 없이 참여할 수 있습니다.`,
  tags: "#목동복싱 #양천구복싱 #목동운동 #다이어트복싱 #스트롱복싱목동점",
};

const RECENT = [
  { title: "목동 학생 방학특강",    branch: "목동",   date: "07.02", copies: 4, status: "완료" },
  { title: "철산 여성 다이어트",    branch: "철산",   date: "07.01", copies: 2, status: "완료" },
  { title: "개봉 직장인 운동",      branch: "개봉",   date: "06.30", copies: 1, status: "완료" },
  { title: "신정 초보자 클래스",    branch: "신정",   date: "06.29", copies: 3, status: "완료" },
  { title: "영등포 주말 운동안내",  branch: "영등포", date: "06.28", copies: 0, status: "완료" },
];

const BRANCH_COLOR: Record<string, string> = {
  목동: "#8B5CF6", 신정: "#10B981", 개봉: "#3B82F6", 철산: "#EF3B2D", 영등포: "#F59E0B",
};

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
} as const;

/* ── 복사 버튼 ─────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150"
      style={{ background: copied ? "rgba(16,185,129,0.1)" : "#F3F4F6", color: copied ? "#059669" : "#6B7280" }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

/* ── 결과 카드 ─────────────────────────────────────── */

function ResultCard({ label, content, onRegen }: { label: string; content: string; onRegen: () => void }) {
  return (
    <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold" style={{ color: "#111827" }}>{label}</p>
        <div className="flex gap-2">
          <button onClick={onRegen}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all duration-150"
            style={{ background: "#F3F4F6", color: "#6B7280" }}>
            <RefreshCw size={12} />
            다시 생성
          </button>
          <CopyButton text={content} />
        </div>
      </div>
      <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#374151" }}>
        {content}
      </pre>
    </div>
  );
}

/* ── 선택 칩 ─────────────────────────────────────────── */

function ChipGroup({ options, value, onChange }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-150"
          style={{
            background: value === o ? "#EF3B2D" : "#F3F4F6",
            color: value === o ? "#FFF" : "#6B7280",
          }}>
          {o}
        </button>
      ))}
    </div>
  );
}

/* ── 페이지 ────────────────────────────────────────── */

export default function AiContentPage() {
  const [branch, setBranch]   = useState("목동");
  const [type, setType]       = useState("릴스");
  const [target, setTarget]   = useState("학생");
  const [mood, setMood]       = useState("자연스럽게");
  const [prompt, setPrompt]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<typeof DUMMY | null>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({ ...DUMMY });
    }, 1400);
  };

  return (
    <div className="max-w-[1360px] mx-auto space-y-6">

      {/* 제목 */}
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>AI 콘텐츠 생성</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>영상·사진 하나로 게시글, 클립 제목, 블로그, 해시태그를 만듭니다.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* ── 좌측 메인 ───────────────────────────────── */}
        <div className="space-y-5">

          {/* 설정 카드 */}
          <div className="rounded-2xl p-5 space-y-5" style={cardStyle}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>지점</p>
                <ChipGroup options={BRANCHES} value={branch} onChange={setBranch} />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>콘텐츠 유형</p>
                <ChipGroup options={TYPES} value={type} onChange={setType} />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>타겟</p>
                <ChipGroup options={TARGETS} value={target} onChange={setTarget} />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>분위기</p>
                <ChipGroup options={MOODS} value={mood} onChange={setMood} />
              </div>
            </div>

            {/* 업로드 박스 */}
            <div>
              <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>영상 / 사진</p>
              <div className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors duration-150 hover:border-red-300"
                style={{ borderColor: "#E5E7EB" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "#FEF2F2" }}>
                  <Upload size={18} color="#EF3B2D" />
                </div>
                <p className="text-[13px] font-semibold" style={{ color: "#374151" }}>클릭하거나 드래그해서 업로드</p>
                <p className="text-[11px]" style={{ color: "#9CA3AF" }}>MP4, MOV, JPG, PNG 지원 (준비중)</p>
              </div>
            </div>
          </div>

          {/* 프롬프트 */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <p className="text-[11px] font-semibold mb-2 uppercase tracking-widest" style={{ color: "#9CA3AF" }}>내용 설명</p>
            <textarea
              className="w-full resize-none rounded-xl border px-4 py-3 text-[13px] outline-none transition-colors duration-150 focus:border-red-400"
              rows={3}
              placeholder="예: 목동점 학생들이 샌드백 치는 영상, 방학 특강 홍보용"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ borderColor: "#E5E7EB", color: "#111827", background: "#FAFAFA" }}
            />
            <div className="mt-3 flex justify-end">
              <button onClick={generate} disabled={!prompt.trim() || loading}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all duration-150 disabled:opacity-40"
                style={{ background: "#EF3B2D", color: "#FFF" }}>
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                {loading ? "생성 중..." : "✨ 콘텐츠 생성"}
              </button>
            </div>
          </div>

          {/* 결과 */}
          {loading && (
            <div className="rounded-2xl p-8 flex flex-col items-center gap-3" style={cardStyle}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "#FEF2F2" }}>
                <Sparkles size={22} color="#EF3B2D" className="animate-pulse" />
              </div>
              <p className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>AI가 콘텐츠를 생성하고 있습니다...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <ResultCard label="📸 인스타 게시글"     content={result.insta} onRegen={() => setResult({ ...DUMMY })} />
              <ResultCard label="▶ 네이버 클립 제목"   content={result.clip}  onRegen={() => setResult({ ...DUMMY })} />
              <ResultCard label="✍️ 블로그 초안"       content={result.blog}  onRegen={() => setResult({ ...DUMMY })} />
              <ResultCard label="# 해시태그"           content={result.tags}  onRegen={() => setResult({ ...DUMMY })} />
            </div>
          )}
        </div>

        {/* ── 우측 패널 ───────────────────────────────── */}
        <div className="space-y-5">

          {/* 추천 프롬프트 */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <p className="text-[13px] font-bold mb-3" style={{ color: "#111827" }}>추천 프롬프트</p>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((q) => (
                <button key={q} onClick={() => setPrompt(q)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold transition-all duration-150 hover:bg-red-50"
                  style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #F3F4F6" }}>
                  {q}
                  <ChevronRight size={13} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>

          {/* 사용 팁 */}
          <div className="rounded-2xl p-5" style={{ ...cardStyle, background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
            <p className="text-[12px] font-bold mb-2" style={{ color: "#EF3B2D" }}>✨ 팁</p>
            <ul className="space-y-1.5 text-[11px] leading-relaxed" style={{ color: "#6B7280" }}>
              <li>• 지점·타겟·분위기를 먼저 선택하면 더 정확한 결과가 나옵니다.</li>
              <li>• 내용 설명에 구체적인 상황을 써주세요.</li>
              <li>• 결과가 마음에 들지 않으면 "다시 생성"을 눌러보세요.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 최근 생성 */}
      <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
        <p className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>최근 생성 목록</p>
        <div className="space-y-2">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
              <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${BRANCH_COLOR[r.branch] ?? "#6B7280"}18` }}>
                <Sparkles size={13} color={BRANCH_COLOR[r.branch] ?? "#6B7280"} />
              </div>
              <p className="flex-1 text-[13px] font-semibold min-w-0 truncate" style={{ color: "#111827" }}>{r.title}</p>
              <span className="text-[10px] font-semibold rounded-md px-2 py-0.5 shrink-0"
                style={{ background: `${BRANCH_COLOR[r.branch] ?? "#6B7280"}14`, color: BRANCH_COLOR[r.branch] ?? "#6B7280" }}>
                {r.branch}
              </span>
              <div className="flex items-center gap-1 shrink-0" style={{ color: "#9CA3AF" }}>
                <Copy size={11} />
                <span className="text-[11px]">{r.copies}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0" style={{ color: "#9CA3AF" }}>
                <Clock size={11} />
                <span className="text-[11px]">{r.date}</span>
              </div>
              <span className="text-[10px] font-semibold rounded-md px-2 py-0.5 shrink-0"
                style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
