"use client";

import { useState } from "react";
import { Download, Eye, FileText, Image, Film, Layout } from "lucide-react";

const STATS = [
  { label: "전체 자료",    value: "48", unit: "개" },
  { label: "로고/디자인", value: "12", unit: "개" },
  { label: "문서",         value: "18", unit: "개" },
  { label: "사진/영상",   value: "18", unit: "개" },
];

const CATS = ["전체", "입관원서", "가격표", "로고", "전단지", "배너", "안내문", "사진", "영상", "계약서"];

type Asset = { title: string; cat: string; branch: string; date: string; type: "doc" | "img" | "vid" | "design" };

const ASSETS: Asset[] = [
  { title: "입관원서",              cat: "입관원서", branch: "공통",   date: "06.15", type: "doc"    },
  { title: "목동 가격표",           cat: "가격표",  branch: "목동",   date: "06.20", type: "doc"    },
  { title: "철산 가격표",           cat: "가격표",  branch: "철산",   date: "06.20", type: "doc"    },
  { title: "개봉 가격표",           cat: "가격표",  branch: "개봉",   date: "06.18", type: "doc"    },
  { title: "STRONG 로고 (흰색)",   cat: "로고",    branch: "공통",   date: "05.01", type: "design" },
  { title: "STRONG 로고 (빨간색)", cat: "로고",    branch: "공통",   date: "05.01", type: "design" },
  { title: "여름방학 특강 전단지",  cat: "전단지",  branch: "목동",   date: "06.25", type: "img"    },
  { title: "철산점 배너",           cat: "배너",    branch: "철산",   date: "06.10", type: "img"    },
  { title: "운동복/수건 안내문",    cat: "안내문",  branch: "공통",   date: "04.20", type: "doc"    },
  { title: "인바디 안내문",         cat: "안내문",  branch: "공통",   date: "04.20", type: "doc"    },
  { title: "리뷰 환급 안내문",      cat: "안내문",  branch: "공통",   date: "05.15", type: "doc"    },
  { title: "신정점 촬영본 7월",     cat: "사진",    branch: "신정",   date: "07.01", type: "img"    },
  { title: "목동 릴스 원본",        cat: "영상",    branch: "목동",   date: "06.30", type: "vid"    },
  { title: "회원 계약서",           cat: "계약서",  branch: "공통",   date: "03.01", type: "doc"    },
];

const BRANCH_COLOR: Record<string, string> = {
  목동: "#8B5CF6", 신정: "#10B981", 개봉: "#3B82F6", 철산: "#EF3B2D", 영등포: "#F59E0B", 공통: "#6B7280",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  doc:    <FileText size={20} color="#3B82F6" />,
  img:    <Image size={20} color="#10B981" />,
  vid:    <Film size={20} color="#8B5CF6" />,
  design: <Layout size={20} color="#EF3B2D" />,
};

const cardStyle = { background: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } as const;

export default function AssetsPage() {
  const [cat, setCat] = useState("전체");
  const filtered = cat === "전체" ? ASSETS : ASSETS.filter((a) => a.cat === cat);

  return (
    <div className="max-w-[1360px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-black tracking-tight" style={{ color: "#111827" }}>자료실</h1>
        <p className="mt-0.5 text-[13px]" style={{ color: "#6B7280" }}>로고, 전단지, 입관원서, 안내문, 사진·영상 자료를 관리합니다.</p>
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

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className="rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all duration-150"
            style={{ background: cat === c ? "#EF3B2D" : "#F3F4F6", color: cat === c ? "#FFF" : "#6B7280" }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((a) => (
          <div key={a.title} className="rounded-2xl p-4 flex items-start gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={cardStyle}>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
              {TYPE_ICON[a.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold truncate" style={{ color: "#111827" }}>{a.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5"
                  style={{ background: "#F3F4F6", color: "#6B7280" }}>{a.cat}</span>
                <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5"
                  style={{ background: `${BRANCH_COLOR[a.branch] ?? "#6B7280"}14`, color: BRANCH_COLOR[a.branch] ?? "#6B7280" }}>{a.branch}</span>
                <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{a.date}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => alert("준비중")}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors hover:bg-gray-100"
                  style={{ background: "#F3F4F6", color: "#6B7280" }}>
                  <Eye size={11} /> 보기
                </button>
                <button onClick={() => alert("준비중")}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
                  style={{ background: "#FEF2F2", color: "#EF3B2D" }}>
                  <Download size={11} /> 다운로드
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
