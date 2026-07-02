"use client";

import { useState } from "react";
import { Phone, Clock, Instagram, MapPin, ChevronDown, ChevronUp, MessageSquare, Clapperboard, ExternalLink } from "lucide-react";

/* ── 데이터 ─────────────────────────────────────────── */

const STATS = [
  { label: "전체 지점",    value: "5",  unit: "개" },
  { label: "운영중",       value: "5",  unit: "개" },
  { label: "오늘 상담",    value: "12", unit: "건" },
  { label: "이번달 등록",  value: "58", unit: "명" },
];

type Fee = { name: string; items: { period: string; price: string }[] };

interface Branch {
  id: string;
  name: string;
  color: string;
  address: string;
  phone: string;
  hours: string[];
  insta: string;
  fees: Fee[];
  naver: string;
  kakao: string;
}

const BRANCHES: Branch[] = [
  {
    id: "mokdong",
    name: "목동점",
    color: "#8B5CF6",
    address: "서울 양천구 목동 909-6 우방빌딩 4층",
    phone: "02-2643-5971",
    hours: ["월-금  14:00 ~ 24:00", "토      11:00 ~ 16:00", "일      휴무"],
    insta: "strongboxing_mokdong",
    fees: [
      { name: "자유",  items: [{ period: "1개월", price: "21만원" }, { period: "3개월", price: "57만원" }] },
      { name: "주3회", items: [{ period: "1개월", price: "19만원" }, { period: "3개월", price: "52만원" }] },
      { name: "주2회", items: [{ period: "1개월", price: "17만원" }, { period: "3개월", price: "48만원" }] },
      { name: "주1회", items: [{ period: "1개월", price: "15만원" }, { period: "3개월", price: "43만원" }] },
    ],
    naver: "#",
    kakao: "#",
  },
  {
    id: "sinjeong",
    name: "신정점",
    color: "#10B981",
    address: "서울 양천구 신정동 1021-7 태화상가 2층",
    phone: "02-2647-3373",
    hours: ["월-금  10:00 ~ 23:00", "토      11:00 ~ 16:00", "일      휴무"],
    insta: "strongboxing_sinjeong",
    fees: [],
    naver: "#",
    kakao: "#",
  },
  {
    id: "gaebong",
    name: "개봉점",
    color: "#3B82F6",
    address: "서울 구로구 개봉동 166-5 유원빌딩 B1",
    phone: "02-2060-1279",
    hours: ["월-금  13:00 ~ 23:00"],
    insta: "strongboxing_gaebong",
    fees: [
      { name: "자유",  items: [{ period: "1개월", price: "20만원" }, { period: "3개월", price: "55만원" }, { period: "6개월", price: "100만원" }, { period: "1년", price: "190만원" }] },
      { name: "주3회", items: [{ period: "1개월", price: "18만원" }, { period: "3개월", price: "50만원" }] },
    ],
    naver: "#",
    kakao: "#",
  },
  {
    id: "cheolsan",
    name: "철산점",
    color: "#EF3B2D",
    address: "경기 광명시 광복로 60 3층",
    phone: "02-2066-0406",
    hours: ["월-금  13:00 ~ 23:00", "토·일   14:00 ~ 17:00"],
    insta: "strongboxing_cheolsan",
    fees: [
      { name: "자유",  items: [{ period: "1개월", price: "22만원" }, { period: "3개월", price: "59만원" }] },
      { name: "주3회", items: [{ period: "1개월", price: "20만원" }, { period: "3개월", price: "55만원" }] },
    ],
    naver: "#",
    kakao: "#",
  },
  {
    id: "yeongdeungpo",
    name: "영등포점",
    color: "#F59E0B",
    address: "서울 영등포구 도림로 313 2층",
    phone: "02-831-9312",
    hours: ["월-금  13:00 ~ 23:00"],
    insta: "stron_gboxinggym",
    fees: [],
    naver: "#",
    kakao: "#",
  },
];

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
} as const;

/* ── 회비 섹션 ─────────────────────────────────────── */

function FeeSection({ fees }: { fees: Fee[] }) {
  const [open, setOpen] = useState(false);

  if (fees.length === 0) {
    return (
      <div className="rounded-xl px-3 py-2.5 text-[12px]" style={{ background: "#F9FAFB", color: "#9CA3AF" }}>
        회비 정보를 입력해주세요.
      </div>
    );
  }

  const preview = fees[0];
  const totalExtra = fees.slice(1).length + (preview.items.length > 2 ? 1 : 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {preview.items.slice(0, 2).map((it) => (
            <span key={it.period} className="text-[12px]">
              <span style={{ color: "#9CA3AF" }}>{preview.name} {it.period}</span>
              <span className="ml-1 font-bold" style={{ color: "#111827" }}>{it.price}</span>
            </span>
          ))}
          {!open && totalExtra > 0 && (
            <span className="text-[11px]" style={{ color: "#9CA3AF" }}>외 {totalExtra}개…</span>
          )}
        </div>
        <button onClick={() => setOpen((p) => !p)}
          className="ml-2 flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors hover:bg-gray-100 shrink-0"
          style={{ color: "#6B7280" }}>
          {open ? <><ChevronUp size={12} /> 접기</> : <><ChevronDown size={12} /> 전체</>}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {fees.map((fee) => (
            <div key={fee.name}>
              <p className="text-[11px] font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>{fee.name}</p>
              <div className="flex flex-wrap gap-2">
                {fee.items.map((it) => (
                  <div key={it.period} className="rounded-xl px-3 py-1.5 text-[12px]"
                    style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                    <span style={{ color: "#9CA3AF" }}>{it.period}</span>
                    <span className="ml-1.5 font-bold" style={{ color: "#111827" }}>{it.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 지점 카드 ─────────────────────────────────────── */

function BranchCard({ b }: { b: Branch }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={cardStyle}>

      {/* 헤더 */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-[14px] font-black shrink-0"
          style={{ background: b.color }}>
          {b.name[0]}
        </div>
        <div>
          <p className="text-[16px] font-black tracking-tight" style={{ color: "#111827" }}>{b.name}</p>
          <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold"
            style={{ background: `${b.color}14`, color: b.color }}>운영중</span>
        </div>
      </div>

      <div className="h-px" style={{ background: "#F3F4F6" }} />

      {/* 정보 */}
      <div className="space-y-2.5">
        <div className="flex gap-2.5">
          <MapPin size={13} color="#9CA3AF" className="mt-0.5 shrink-0" />
          <p className="text-[12px] leading-relaxed" style={{ color: "#374151" }}>{b.address}</p>
        </div>
        <div className="flex gap-2.5 items-center">
          <Phone size={13} color="#9CA3AF" className="shrink-0" />
          <a href={`tel:${b.phone}`} className="text-[12px] font-semibold hover:underline" style={{ color: "#374151" }}>{b.phone}</a>
        </div>
        <div className="flex gap-2.5">
          <Clock size={13} color="#9CA3AF" className="mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            {b.hours.map((h) => (
              <p key={h} className="text-[12px]" style={{ color: "#374151" }}>{h}</p>
            ))}
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <Instagram size={13} color="#9CA3AF" className="shrink-0" />
          <a href={`https://instagram.com/${b.insta}`} target="_blank" rel="noopener noreferrer"
            className="text-[12px] font-semibold hover:underline flex items-center gap-1" style={{ color: "#374151" }}>
            @{b.insta} <ExternalLink size={10} color="#9CA3AF" />
          </a>
        </div>
      </div>

      <div className="h-px" style={{ background: "#F3F4F6" }} />

      {/* 회비 */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>회비</p>
        <FeeSection fees={b.fees} />
      </div>

      <div className="h-px" style={{ background: "#F3F4F6" }} />

      {/* 외부 링크 */}
      <div className="grid grid-cols-2 gap-2">
        <a href={b.naver} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold transition-opacity hover:opacity-70"
          style={{ background: "#03C75A18", color: "#03a84e", border: "1px solid #03C75A28" }}>
          <ExternalLink size={12} /> 네이버 예약
        </a>
        <a href={b.kakao} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold transition-opacity hover:opacity-70"
          style={{ background: "#FEE50018", color: "#a0720a", border: "1px solid #FEE50038" }}>
          <ExternalLink size={12} /> 카카오맵
        </a>
      </div>

      {/* 내부 이동 */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => alert("상담 페이지로 이동")}
          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold transition-colors hover:bg-gray-100"
          style={{ background: "#F3F4F6", color: "#374151" }}>
          <MessageSquare size={13} /> 상담 답변
        </button>
        <button onClick={() => alert("콘텐츠 페이지로 이동")}
          className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold transition-colors hover:bg-gray-100"
          style={{ background: "#F3F4F6", color: "#374151" }}>
          <Clapperboard size={13} /> 콘텐츠
        </button>
      </div>
    </div>
  );
}

/* ── 페이지 ────────────────────────────────────────── */

export default function BranchesPage() {
  return (
    <div className="max-w-[1360px] mx-auto space-y-6">

      {/* 제목 */}
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>지점 관리</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>지점별 운영시간, 회비, 연락처, SNS를 관리합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}
            className="rounded-2xl border px-5 py-4 transition-all duration-200 hover:shadow-md"
            style={cardStyle}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>{s.label}</p>
            <div className="flex items-end gap-1">
              <span className="text-[30px] font-black leading-none" style={{ color: "#111827" }}>{s.value}</span>
              <span className="text-[13px] font-semibold mb-0.5" style={{ color: "#6B7280" }}>{s.unit}</span>
            </div>
            <div className="mt-3 h-[2px] w-6 rounded-full" style={{ background: "#EF3B2D" }} />
          </div>
        ))}
      </div>

      {/* 지점 카드 */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {BRANCHES.map((b) => <BranchCard key={b.id} b={b} />)}
      </div>

    </div>
  );
}
