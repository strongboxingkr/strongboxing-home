"use client";

import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { trackReservationComplete } from "@/lib/gtag";

/* ── 지점 데이터 (ConsultationForm과 동일) ── */
const branchData: Record<string, {
  address: string;
  phone: string;
  hours: string;
  naverUrl: string;
  times: Record<number, string[]>;
}> = {
  목동점: {
    address: "서울 양천구 목동 909-6 우방빌딩 4층",
    phone: "02-2643-5971",
    hours: "평일 14:00–24:00  토 11:00–16:00",
    naverUrl: "https://naver.me/GII8f9Qv",
    times: {
      1: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      2: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      3: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      4: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      5: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      6: ["11:00","12:00","13:00","14:00","15:00"],
    },
  },
  신정점: {
    address: "서울 양천구 신정동 1021-7 태화상가 2층",
    phone: "02-2647-3373",
    hours: "평일 10:00–14:00, 15:00–24:00  토 10:00–16:00",
    naverUrl: "https://naver.me/5nhXvzXH",
    times: {
      1: ["10:00","11:00","12:00","13:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      2: ["10:00","11:00","12:00","13:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      3: ["10:00","11:00","12:00","13:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      4: ["10:00","11:00","12:00","13:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      5: ["10:00","11:00","12:00","13:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      6: ["10:00","11:00","12:00","13:00","14:00","15:00"],
    },
  },
  개봉점: {
    address: "서울 구로구 개봉동 166-5 유원빌딩 지하 1층",
    phone: "02-2060-1279",
    hours: "평일 13:00–23:00",
    naverUrl: "https://naver.me/5aFquqcz",
    times: {
      1: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      2: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      3: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      4: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      5: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
    },
  },
  철산점: {
    address: "경기 광명시 철산동 56-14 3층",
    phone: "02-2066-0406",
    hours: "평일 13:00–23:00  토·일 14:00–18:00",
    naverUrl: "https://naver.me/F8lwn3Te",
    times: {
      1: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      2: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      3: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      4: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      5: ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      6: ["14:00","15:00","16:00","17:00"],
      0: ["14:00","15:00","16:00","17:00"],
    },
  },
  영등포점: {
    address: "서울 영등포구 도림로 313 건영상가 2층",
    phone: "02-831-9312",
    hours: "평일 13:00–23:00",
    naverUrl: "https://naver.me/G4yQwkR0",
    times: {
      1: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      2: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      3: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      4: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
      5: ["13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"],
    },
  },
};

const GOALS = ["다이어트", "체력 향상", "취미", "자녀 운동", "기타"];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getAvailableTimes(branch: string, dateString: string): string[] {
  if (!dateString) return [];
  const date = new Date(dateString);
  const day = date.getDay();
  const allTimes = branchData[branch]?.times[day] ?? [];
  if (dateString === getToday()) {
    const now = new Date();
    return allTimes.filter((t) => {
      const [h, m] = t.split(":").map(Number);
      return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
    });
  }
  return allTimes;
}

/* ── 모달 내 컴팩트 폼 ── */
function ConsultationFormCompact({ onClose }: { onClose: () => void }) {
  const [reservationType, setReservationType] = useState<"방문 상담" | "일일 체험">("방문 상담");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    branch: "목동점",
    reservation_date: "",
    reservation_time: "",
    goal: "",
    message: "",
  });

  const times = useMemo(
    () => getAvailableTimes(form.branch, form.reservation_date),
    [form.branch, form.reservation_date]
  );

  function handleBranchChange(branch: string) {
    const newTimes = getAvailableTimes(branch, form.reservation_date);
    setForm((f) => ({
      ...f,
      branch,
      reservation_time: newTimes.includes(f.reservation_time) ? f.reservation_time : "",
    }));
  }

  function handleDateChange(dateString: string) {
    const available = getAvailableTimes(form.branch, dateString);
    if (available.length === 0) {
      alert("선택한 날짜는 해당 지점의 휴무일이거나 운영하지 않는 요일입니다.");
      setForm((f) => ({ ...f, reservation_date: "", reservation_time: "" }));
      return;
    }
    setForm((f) => ({ ...f, reservation_date: dateString, reservation_time: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reservation_time) { setError("희망 시간을 선택해주세요."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, reservation_type: reservationType }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.message || "예약 접수에 실패했습니다."); return; }
      trackReservationComplete({ branch_name: form.branch });
      setDone(true);
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  /* ── 완료 화면 ── */
  if (done) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#FFF1F2" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#D01E2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="mb-2 text-[11px] font-black tracking-[0.3em]" style={{ color: "#D01E2E" }}>예약 접수 완료</p>
        <h3 className="mb-3 text-xl font-black" style={{ color: "#0E0E10" }}>신청이 완료되었습니다</h3>
        <p className="mb-6 text-sm leading-6" style={{ color: "#6B6B72" }}>
          {form.branch} 담당자가 확인 후<br />연락처로 안내드립니다.
        </p>
        <button
          onClick={onClose}
          className="rounded-[10px] px-8 py-3 text-sm font-black text-white"
          style={{ background: "#D01E2E" }}
        >
          닫기
        </button>
      </div>
    );
  }

  /* ── 입력 스타일 ── */
  const inputCls = "w-full rounded-[10px] border px-4 py-3 text-sm outline-none transition focus:border-[#D01E2E]";
  const inputStyle = { borderColor: "#E8E6DF", background: "#fff", color: "#0E0E10" };
  const labelCls = "block mb-1.5 text-[11px] font-black tracking-[0.08em]";
  const labelStyle = { color: "#6B6B72" };

  return (
    <>
      {/* 상담 유형 선택 */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {(["방문 상담", "일일 체험"] as const).map((type) => {
          const active = reservationType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setReservationType(type)}
              className="rounded-[12px] p-3 text-left transition"
              style={{
                border: active ? "2px solid #D01E2E" : "1.5px solid #E8E6DF",
                background: active ? "#FFF1F2" : "#F9F8F5",
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: active ? "#D01E2E" : "#ccc" }}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#D01E2E" }} />}
                </span>
                <span className="text-xs font-black" style={{ color: active ? "#D01E2E" : "#6B6B72" }}>{type}</span>
              </div>
              <p className="ml-5 font-black text-sm" style={{ color: "#0E0E10" }}>
                {type === "방문 상담" ? "무료" : "30,000원"}
              </p>
              {type === "일일 체험" && (
                <p className="ml-5 text-[10px] font-semibold" style={{ color: "#D01E2E" }}>당일 등록 시 전액 페이백</p>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 방문 지점 */}
        <div>
          <label className={labelCls} style={labelStyle}>방문 지점</label>
          <select
            value={form.branch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className={inputCls}
            style={inputStyle}
          >
            {Object.keys(branchData).map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* 이름 / 연락처 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={labelStyle}>이름 <span style={{ color: "#D01E2E" }}>*</span></label>
            <input
              required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="이름" className={inputCls} style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>연락처 <span style={{ color: "#D01E2E" }}>*</span></label>
            <input
              required type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="010-0000-0000" className={inputCls} style={inputStyle}
            />
          </div>
        </div>

        {/* 희망 날짜 / 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={labelStyle}>희망 날짜 <span style={{ color: "#D01E2E" }}>*</span></label>
            <input
              required type="date" min={getToday()} value={form.reservation_date}
              onChange={(e) => handleDateChange(e.target.value)}
              className={inputCls} style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>희망 시간 <span style={{ color: "#D01E2E" }}>*</span></label>
            <select
              required value={form.reservation_time}
              onChange={(e) => setForm({ ...form, reservation_time: e.target.value })}
              className={inputCls} style={inputStyle}
              disabled={times.length === 0}
            >
              <option value="">{form.reservation_date ? "시간 선택" : "날짜 먼저 선택"}</option>
              {times.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* 운동 목적 */}
        <div>
          <label className={labelCls} style={labelStyle}>운동 목적 <span style={{ color: "#aaa", fontWeight: 400 }}>(선택)</span></label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => {
              const active = form.goal === g;
              return (
                <button
                  key={g} type="button"
                  onClick={() => setForm({ ...form, goal: active ? "" : g })}
                  className="rounded-full px-3 py-1.5 text-xs font-bold transition"
                  style={{
                    background: active ? "#D01E2E" : "#F0EFEB",
                    color: active ? "#fff" : "#6B6B72",
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* 문의사항 */}
        <div>
          <label className={labelCls} style={labelStyle}>문의사항 <span style={{ color: "#aaa", fontWeight: 400 }}>(선택)</span></label>
          <textarea
            rows={2} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="궁금한 점을 남겨주세요."
            className={inputCls + " resize-none"} style={inputStyle}
          />
        </div>

        {error && (
          <p className="rounded-[10px] px-4 py-3 text-xs" style={{ background: "#FFF1F2", color: "#D01E2E", border: "1px solid #FFCDD2" }}>
            {error}
          </p>
        )}

        {reservationType === "일일 체험" && (
          <p className="text-[11px] leading-5" style={{ color: "#aaa" }}>
            체험비(30,000원)는 방문 후 현장에서 결제합니다. 당일 정식 등록 시 전액 차감됩니다.
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full rounded-[10px] py-3.5 text-sm font-black text-white transition"
          style={{ background: "#D01E2E", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "접수 중..." : reservationType === "방문 상담" ? "무료 상담 신청하기" : "일일 체험 신청하기"}
        </button>
      </form>
    </>
  );
}

/* ── 버튼 + 모달 ── */
export function ConsultationModalButton({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  /* 배경 스크롤 잠금 */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Esc 키 닫기 */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <button type="button" className={className} style={style} onClick={() => setOpen(true)}>
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="방문 상담 신청"
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="relative flex w-full max-w-md flex-col rounded-t-[24px] sm:rounded-[24px]"
            style={{ background: "#F9F8F5", maxHeight: "92dvh" }}
          >
            {/* 헤더 (sticky) */}
            <div
              className="sticky top-0 z-10 flex shrink-0 items-center justify-between rounded-t-[24px] px-6 py-4"
              style={{ background: "#F9F8F5", borderBottom: "1px solid #E8E6DF" }}
            >
              <h3 className="font-black text-base" style={{ color: "#0E0E10" }}>방문 상담 신청</h3>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-60"
                style={{ background: "#ECEAE4" }}
              >
                <X size={16} style={{ color: "#6B6B72" }} />
              </button>
            </div>

            {/* 스크롤 콘텐츠 */}
            <div className="overflow-y-auto px-6 py-5">
              <ConsultationFormCompact onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
