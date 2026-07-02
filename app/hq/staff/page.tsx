"use client";

import { useState } from "react";
import { CheckSquare, Square, BookOpen, ChevronRight } from "lucide-react";

const STATS = [
  { label: "오늘 근무",    value: "5",  unit: "명" },
  { label: "완료된 체크",  value: "18", unit: "개" },
  { label: "미완료 업무",  value: "6",  unit: "개" },
  { label: "교육 자료",    value: "12", unit: "개" },
];

type CheckItem = { id: string; text: string };

const CHECKLISTS: { title: string; color: string; items: CheckItem[] }[] = [
  {
    title: "오픈 체크리스트", color: "#3B82F6",
    items: [
      { id: "o1", text: "조명/에어컨 확인" },
      { id: "o2", text: "음악 재생" },
      { id: "o3", text: "바닥 상태 확인" },
      { id: "o4", text: "상담 테이블 정리" },
      { id: "o5", text: "수건/운동복 확인" },
    ],
  },
  {
    title: "마감 체크리스트", color: "#8B5CF6",
    items: [
      { id: "c1", text: "샌드백 정리" },
      { id: "c2", text: "링/매트 정리" },
      { id: "c3", text: "전등/에어컨 OFF" },
      { id: "c4", text: "문단속" },
      { id: "c5", text: "쓰레기 정리" },
    ],
  },
  {
    title: "청소 체크리스트", color: "#10B981",
    items: [
      { id: "cl1", text: "화장실" },
      { id: "cl2", text: "샤워실" },
      { id: "cl3", text: "링" },
      { id: "cl4", text: "샌드백" },
      { id: "cl5", text: "바닥" },
      { id: "cl6", text: "상담실" },
    ],
  },
];

const MANUALS = [
  { title: "전화응대",         desc: "전화 수신 시 멘트와 상담 연결 방법" },
  { title: "상담응대",         desc: "신규 문의 응대 절차와 주의사항" },
  { title: "신규회원 안내",    desc: "가입 시 안내 순서와 체크포인트" },
  { title: "사진/영상 촬영 요청", desc: "콘텐츠 촬영 시 주의사항 및 요청 방법" },
  { title: "리뷰 요청 멘트",   desc: "네이버·구글 리뷰 요청 타이밍과 스크립트" },
];

const cardStyle = { background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } as const;

function Checklist({ title, color, items }: { title: string; color: string; items: CheckItem[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setChecked((p) => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const done = items.filter((i) => checked.has(i.id)).length;
  return (
    <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-bold" style={{ color: "#111827" }}>{title}</p>
        <span className="text-[11px] font-semibold rounded-full px-2.5 py-0.5"
          style={{ background: `${color}14`, color }}>{done}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((it) => {
          const on = checked.has(it.id);
          return (
            <button key={it.id} onClick={() => toggle(it.id)}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
              style={{ background: on ? `${color}08` : "transparent" }}>
              {on
                ? <CheckSquare size={16} color={color} />
                : <Square size={16} color="#D1D5DB" />}
              <span className="text-[13px]" style={{ color: on ? color : "#374151", textDecoration: on ? "line-through" : "none" }}>
                {it.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StaffPage() {
  return (
    <div className="max-w-[1360px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>직원센터</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>오픈·마감·청소·상담·촬영 업무를 한 곳에서 확인합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border px-5 py-4 transition-all duration-200 hover:shadow-md" style={cardStyle}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>{s.label}</p>
            <div className="flex items-end gap-1">
              <span className="text-[30px] font-black leading-none" style={{ color: "#111827" }}>{s.value}</span>
              <span className="text-[13px] font-semibold mb-0.5" style={{ color: "#6B7280" }}>{s.unit}</span>
            </div>
            <div className="mt-3 h-[2px] w-6 rounded-full" style={{ background: "#EF3B2D" }} />
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CHECKLISTS.map((cl) => <Checklist key={cl.title} {...cl} />)}
      </div>

      <div className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md" style={cardStyle}>
        <p className="text-[14px] font-bold mb-4" style={{ color: "#111827" }}>업무 매뉴얼</p>
        <div className="space-y-2">
          {MANUALS.map((m) => (
            <button key={m.title} onClick={() => alert("준비중")}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-gray-50"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
              <BookOpen size={15} color="#9CA3AF" className="shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold" style={{ color: "#111827" }}>{m.title}</p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "#9CA3AF" }}>{m.desc}</p>
              </div>
              <ChevronRight size={14} color="#9CA3AF" className="shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
