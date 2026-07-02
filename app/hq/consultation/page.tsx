"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Star, Copy, Check, Pencil } from "lucide-react";

/* ── 타입 ─────────────────────────────────────────── */

interface Template {
  id: number;
  title: string;
  branch: string;
  category: string;
  body: string;
}

/* ── 데이터 ───────────────────────────────────────── */

const TEMPLATES: Template[] = [
  {
    id: 1, title: "목동점 회비 안내", branch: "목동", category: "회비",
    body: `안녕하세요😊 스트롱복싱 목동점입니다!

회비 안내드립니다.

자유이용권
1개월 21만원
3개월 57만원

주 3회
1개월(12회) 19만원
3개월(36회) 52만원

주 2회
1개월(8회) 17만원
3개월(24회) 48만원

주 1회
1개월(4회) 15만원
3개월(12회) 43만원

입관비는 3만원이며, 네이버 리뷰 작성 시 2만원 환급해드립니다.

원하시는 날짜와 시간을 말씀해주시면 상담 예약 도와드리겠습니다!`,
  },
  {
    id: 2, title: "개봉점 회비 안내", branch: "개봉", category: "회비",
    body: `안녕하세요😊 스트롱복싱 개봉점입니다!

회비 안내드립니다.

자유이용권
1개월 20만원
3개월 55만원
6개월 100만원
1년 190만원

주 3회
1개월(12회) 18만원
3개월(36회) 50만원

입관비는 3만원이며, 네이버 리뷰 작성 시 2만원 환급해드립니다.

원하시는 날짜와 시간을 말씀해주시면 상담 예약 도와드리겠습니다!`,
  },
  {
    id: 3, title: "철산점 회비 안내", branch: "철산", category: "회비",
    body: `안녕하세요😊 스트롱복싱 철산점입니다!

회비 안내드립니다.

자유이용권
1개월 22만원
3개월 59만원

주 3회
1개월(12회) 20만원
3개월(36회) 55만원

입관비는 3만원이며, 네이버 리뷰 작성 시 2만원 환급해드립니다.

원하시는 날짜와 시간을 말씀해주시면 상담 예약 도와드리겠습니다!`,
  },
  {
    id: 4, title: "원데이 이용권 안내", branch: "전체", category: "원데이",
    body: `안녕하세요😊 스트롱복싱입니다!

1회 이용권은 30,000원이며,
당일 회원권 등록 시 1회 이용권 금액은 회원권 금액에서 차감해드립니다.

처음 오셔도 기본 자세부터 차근차근 지도해드립니다.
실내용 운동화와 편한 운동복 준비 부탁드립니다.

원하시는 날짜와 시간을 말씀해주시면 예약 도와드리겠습니다!`,
  },
  {
    id: 5, title: "준비물 안내", branch: "전체", category: "준비물",
    body: `처음 방문 시 실내용 운동화와 편한 운동복 준비해주시면 됩니다😊
글러브와 핸드랩은 현장에서도 구매 가능하며, 처음 오시면 기본 자세부터 차근차근 안내드립니다.`,
  },
  {
    id: 6, title: "PT 안내", branch: "전체", category: "PT",
    body: `1:1 맞춤형 복싱 PT도 가능합니다.
요일과 시간은 상담 후 조율 가능하며, 목적에 맞춰 체력 향상, 다이어트, 자세 교정, 기술 훈련 위주로 진행됩니다.`,
  },
];

const BRANCHES   = ["전체", "개봉", "신정", "목동", "철산", "영등포"];
const CATEGORIES = ["전체", "회비", "원데이", "운영시간", "준비물", "PT", "환불·휴회", "이벤트"];

const BRANCH_COLOR: Record<string, string> = {
  전체: "#6B7280", 개봉: "#3B82F6", 신정: "#10B981",
  목동: "#8B5CF6", 철산: "#EF3B2D", 영등포: "#F59E0B",
};

const LS_FAV    = "hq_consultation_favorites";
const LS_RECENT = "hq_consultation_recent";

/* ── 카드 ─────────────────────────────────────────── */

function TemplateCard({
  template,
  isFav,
  onToggleFav,
  onCopy,
}: {
  template: Template;
  isFav: boolean;
  onToggleFav: (id: number) => void;
  onCopy: (t: Template) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(template.body);

  function copy() {
    navigator.clipboard.writeText(editBody);
    onCopy(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const bc = BRANCH_COLOR[template.branch] ?? "#6B7280";

  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: "#FFFFFF", borderColor: "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold leading-snug truncate" style={{ color: "#111827" }}>
            {template.title}
          </p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: `${bc}14`, color: bc }}
            >
              📍 {template.branch}점
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "rgba(239,59,45,0.1)", color: "#EF3B2D" }}
            >
              💰 {template.category}
            </span>
          </div>
        </div>

        {/* 즐겨찾기 */}
        <button
          onClick={() => onToggleFav(template.id)}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 hover:bg-amber-50"
          title="즐겨찾기"
        >
          <Star
            size={15}
            strokeWidth={1.8}
            fill={isFav ? "#F59E0B" : "none"}
            color={isFav ? "#F59E0B" : "#D1D5DB"}
          />
        </button>
      </div>

      {/* body */}
      <div className="px-5 pb-3 flex-1">
        {editing ? (
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={10}
            className="w-full text-[12px] leading-relaxed rounded-xl p-3.5 font-sans outline-none resize-y"
            style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB" }}
          />
        ) : (
          <pre
            className="text-[12px] leading-relaxed whitespace-pre-wrap font-sans rounded-xl p-3.5"
            style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #F3F4F6" }}
          >
            {editBody}
          </pre>
        )}
      </div>

      {/* actions */}
      <div
        className="flex items-center gap-2 px-5 py-3.5"
        style={{ borderTop: "1px solid #F3F4F6" }}
      >
        {/* 수정 */}
        <button
          onClick={() => setEditing((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 hover:bg-gray-100"
          style={{ color: "#6B7280" }}
        >
          <Pencil size={12} />
          {editing ? "완료" : "수정"}
        </button>

        <div className="flex-1" />

        {/* 즐겨찾기 (하단) */}
        <button
          onClick={() => onToggleFav(template.id)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 hover:bg-amber-50"
          style={{ color: isFav ? "#F59E0B" : "#9CA3AF" }}
        >
          <Star size={12} fill={isFav ? "#F59E0B" : "none"} />
          즐겨찾기
        </button>

        {/* 복사 */}
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-200"
          style={{
            background: copied ? "#ECFDF5" : "#F3F4F6",
            color: copied ? "#059669" : "#374151",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "복사 완료 ✅" : "📋 답변 복사"}
        </button>
      </div>
    </div>
  );
}

/* ── 요약 카드 ────────────────────────────────────── */

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="flex-1 rounded-2xl border px-4 py-3.5"
      style={{ background: "#FFFFFF", borderColor: "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#9CA3AF" }}>{label}</p>
      <p className="text-[24px] font-black" style={{ color: "#111827" }}>{value}</p>
    </div>
  );
}

/* ── 페이지 ────────────────────────────────────────── */

export default function ConsultationPage() {
  const [query, setQuery]       = useState("");
  const [branch, setBranch]     = useState("전체");
  const [category, setCategory] = useState("전체");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recent, setRecent]       = useState<number[]>([]);

  /* localStorage 로드 */
  useEffect(() => {
    try {
      const f = localStorage.getItem(LS_FAV);
      const r = localStorage.getItem(LS_RECENT);
      if (f) setFavorites(JSON.parse(f));
      if (r) setRecent(JSON.parse(r));
    } catch {}
  }, []);

  const toggleFav = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(LS_FAV, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordCopy = useCallback((t: Template) => {
    setRecent((prev) => {
      const next = [t.id, ...prev.filter((x) => x !== t.id)].slice(0, 10);
      localStorage.setItem(LS_RECENT, JSON.stringify(next));
      return next;
    });
  }, []);

  /* 필터링 + 즐겨찾기 최상단 */
  const filtered = TEMPLATES.filter((t) => {
    const okBranch = branch === "전체" || t.branch === branch || t.branch === "전체";
    const okCat    = category === "전체" || t.category === category;
    const q = query.trim().toLowerCase();
    const okQ = !q || t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return okBranch && okCat && okQ;
  }).sort((a, b) => {
    const af = favorites.includes(a.id) ? 0 : 1;
    const bf = favorites.includes(b.id) ? 0 : 1;
    return af - bf;
  });

  function filterBtn(active: boolean, color = "#EF3B2D"): React.CSSProperties {
    return {
      background: active ? color : "#F3F4F6",
      color: active ? "#FFFFFF" : "#6B7280",
      transition: "all 0.15s ease",
    };
  }

  return (
    <div className="max-w-[1360px] mx-auto space-y-5">

      {/* 제목 */}
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>상담센터</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>
          회원 문의 답변을 빠르게 찾고 복사합니다.
        </p>
      </div>

      {/* 요약 카드 3개 */}
      <div className="flex gap-3">
        <SummaryCard label="전체 답변" value={TEMPLATES.length} />
        <SummaryCard label="즐겨찾기" value={favorites.length} />
        <SummaryCard label="최근 사용" value={recent.length} />
      </div>

      {/* 검색 */}
      <div
        className="flex items-center gap-2.5 h-11 rounded-2xl border px-4 transition-colors focus-within:border-[#EF3B2D]/40"
        style={{ background: "#FFFFFF", borderColor: "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <Search size={15} color="#9CA3AF" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="회비, 원데이, 준비물, 입관비, 환불, 운동화 검색…"
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9CA3AF]"
          style={{ color: "#111827" }}
        />
      </div>

      {/* 지점 필터 */}
      <div className="flex flex-wrap gap-2">
        {BRANCHES.map((b) => (
          <button
            key={b}
            onClick={() => setBranch(b)}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={filterBtn(branch === b, BRANCH_COLOR[b])}
          >
            {b}
          </button>
        ))}
      </div>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={filterBtn(category === c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      <p className="text-[12px]" style={{ color: "#9CA3AF" }}>{filtered.length}개의 답변 템플릿</p>

      {/* 카드 그리드 */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isFav={favorites.includes(t.id)}
              onToggleFav={toggleFav}
              onCopy={recordCopy}
            />
          ))}
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
