"use client";

import { Building2, MessageSquare, Clapperboard, Users, Bell, Database, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    icon: Building2,
    color: "#3B82F6",
    title: "지점 기본 정보 관리",
    desc: "주소, 전화번호, 운영시간, 인스타 계정, 네이버 예약 링크를 수정합니다.",
  },
  {
    icon: MessageSquare,
    color: "#10B981",
    title: "상담 답변 카테고리 관리",
    desc: "상담센터에서 사용하는 카테고리와 태그를 추가·수정·삭제합니다.",
  },
  {
    icon: Clapperboard,
    color: "#8B5CF6",
    title: "콘텐츠 카테고리 관리",
    desc: "콘텐츠 관리 페이지의 유형과 상태 항목을 관리합니다.",
  },
  {
    icon: Users,
    color: "#EF3B2D",
    title: "직원 권한 관리",
    desc: "직원별 HQ 접근 권한 및 열람 가능한 페이지를 설정합니다.",
  },
  {
    icon: Bell,
    color: "#F59E0B",
    title: "알림 설정",
    desc: "신규 상담, 업로드 마감, 일정 알림을 카카오톡 또는 이메일로 받습니다.",
  },
  {
    icon: Database,
    color: "#6B7280",
    title: "백업 / 내보내기",
    desc: "상담 내역, 콘텐츠 목록, 매출 데이터를 CSV·Excel로 내보냅니다.",
  },
];

const cardStyle = { background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } as const;

export default function SettingsPage() {
  return (
    <div className="max-w-[1360px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>설정</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>HQ 운영에 필요한 기본값을 관리합니다.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.title} onClick={() => alert("준비중")}
              className="rounded-2xl p-5 flex items-start gap-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 w-full"
              style={cardStyle}>
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}14` }}>
                <Icon size={18} color={s.color} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold" style={{ color: "#111827" }}>{s.title}</p>
                <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "#6B7280" }}>{s.desc}</p>
              </div>
              <ChevronRight size={16} color="#9CA3AF" className="shrink-0 mt-1" />
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-5" style={{ ...cardStyle, background: "#F9FAFB" }}>
        <p className="text-[12px] font-semibold" style={{ color: "#9CA3AF" }}>STRONG BOXING HQ v1.0</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#D1D5DB" }}>개봉 · 신정 · 목동 · 철산 · 영등포 5개 지점 운영 중</p>
      </div>
    </div>
  );
}
