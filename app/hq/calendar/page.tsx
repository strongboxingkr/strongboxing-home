"use client";

import { useState } from "react";
import { Calendar, Camera, Upload, Star, MapPin, User } from "lucide-react";

const STATS = [
  { label: "오늘 일정",    value: "4",  unit: "개" },
  { label: "이번주 촬영", value: "6",  unit: "건" },
  { label: "업로드 예정", value: "9",  unit: "개" },
  { label: "이벤트",       value: "3",  unit: "개" },
];

const TABS = ["오늘", "이번주", "이번달"] as const;

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  예정:      { bg: "#EFF6FF", color: "#3B82F6" },
  촬영완료:  { bg: "#F0FDF4", color: "#059669" },
  업로드완료:{ bg: "#F9FAFB", color: "#6B7280" },
  진행중:    { bg: "#FFFBEB", color: "#D97706" },
};

type ScheduleType = "촬영" | "업로드" | "이벤트" | "블로그";
const TYPE_ICON: Record<ScheduleType, React.ReactNode> = {
  촬영:   <Camera   size={14} />,
  업로드: <Upload   size={14} />,
  이벤트: <Star     size={14} />,
  블로그: <Calendar size={14} />,
};

interface Sch { date: string; time: string; title: string; branch: string; type: ScheduleType; manager: string; status: string }

const SCHEDULES: Sch[] = [
  { date: "07.02", time: "15:00", title: "목동 학생 릴스 촬영",          branch: "목동",   type: "촬영",   manager: "김지수", status: "진행중"  },
  { date: "07.03", time: "10:00", title: "철산 주말운영 소식 업로드",     branch: "철산",   type: "업로드", manager: "이민준", status: "예정"    },
  { date: "07.04", time: "09:00", title: "개봉 네이버 클립 업로드",       branch: "개봉",   type: "업로드", manager: "박수진", status: "예정"    },
  { date: "07.05", time: "14:00", title: "목동 여름방학 특강 블로그",     branch: "목동",   type: "블로그", manager: "김지수", status: "예정"    },
  { date: "07.06", time: "13:00", title: "신정 여성 미트 릴스 촬영",      branch: "신정",   type: "촬영",   manager: "이민준", status: "예정"    },
  { date: "07.07", time: "11:00", title: "영등포 오픈 기념 이벤트",       branch: "영등포", type: "이벤트", manager: "전체",   status: "예정"    },
  { date: "07.08", time: "15:00", title: "철산 인스타 업로드",            branch: "철산",   type: "업로드", manager: "이민준", status: "예정"    },
  { date: "07.10", time: "14:00", title: "목동 당근 게시글 업로드",       branch: "목동",   type: "업로드", manager: "김지수", status: "예정"    },
  { date: "07.12", time: "13:00", title: "개봉 여름특강 릴스 촬영",       branch: "개봉",   type: "촬영",   manager: "박수진", status: "예정"    },
  { date: "07.14", time: "11:00", title: "신정 블로그 업로드",            branch: "신정",   type: "블로그", manager: "이민준", status: "예정"    },
];

const BRANCH_COLOR: Record<string, string> = {
  목동: "#8B5CF6", 신정: "#10B981", 개봉: "#3B82F6", 철산: "#EF3B2D", 영등포: "#F59E0B", 전체: "#6B7280",
};

const cardStyle = { background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } as const;

export default function CalendarPage() {
  const [tab, setTab] = useState<typeof TABS[number]>("이번주");
  const list = tab === "오늘" ? SCHEDULES.slice(0, 1) : tab === "이번주" ? SCHEDULES.slice(0, 7) : SCHEDULES;

  return (
    <div className="max-w-[1360px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>일정관리</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>촬영, 이벤트, 블로그, 직원 일정을 관리합니다.</p>
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

      <div className="flex gap-1.5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-150"
            style={{ background: tab === t ? "#EF3B2D" : "#F3F4F6", color: tab === t ? "#FFF" : "#6B7280" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((s, i) => {
          const st = STATUS_STYLE[s.status] ?? { bg: "#F9FAFB", color: "#6B7280" };
          return (
            <div key={i} className="rounded-2xl p-4 flex items-start gap-4 transition-all duration-200 hover:shadow-md" style={cardStyle}>
              <div className="text-center shrink-0 w-12">
                <p className="text-[11px] font-semibold" style={{ color: "#9CA3AF" }}>{s.date}</p>
                <p className="text-[12px] font-bold mt-0.5" style={{ color: "#374151" }}>{s.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold" style={{ color: "#111827" }}>{s.title}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[11px] font-semibold rounded-md px-2 py-0.5"
                    style={{ background: `${BRANCH_COLOR[s.branch] ?? "#6B7280"}14`, color: BRANCH_COLOR[s.branch] ?? "#6B7280" }}>
                    <MapPin size={9} />{s.branch}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold rounded-md px-2 py-0.5"
                    style={{ background: "#F3F4F6", color: "#6B7280" }}>
                    {TYPE_ICON[s.type]}{s.type}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold rounded-md px-2 py-0.5"
                    style={{ background: "#F3F4F6", color: "#6B7280" }}>
                    <User size={9} />{s.manager}
                  </span>
                  <span className="text-[11px] font-semibold rounded-md px-2 py-0.5"
                    style={{ background: st.bg, color: st.color }}>{s.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
