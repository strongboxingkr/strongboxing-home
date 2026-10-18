"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { trackReservationComplete } from "@/lib/gtag";

/* ── 지점 데이터 ─────────────────────────────────────────── */
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
    naverUrl: "https://naver.me/xxxxxx",
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

  // 오늘 날짜면 이미 지난 시간 제외
  if (dateString === getToday()) {
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    return allTimes.filter((t) => {
      const [h, m] = t.split(":").map(Number);
      return h > currentH || (h === currentH && m > currentM);
    });
  }
  return allTimes;
}

/* ── 스타일 상수 ─────────────────────────────────────────── */
const inputCls =
  "w-full rounded-[10px] border border-[#2C2C30] bg-[#0E0E10] px-4 py-3.5 text-[#F5F4F1] placeholder-[#5A5C61] outline-none transition focus:border-[#D01E2E]";
const labelCls = "block text-[12px] font-bold tracking-[0.08em] text-[#8A8D91] mb-1.5";

export default function ConsultationForm() {
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

  const branchInfo = branchData[form.branch];

  function handleBranchChange(branch: string) {
    // 지점 변경 시 선택된 날짜·시간이 유효한지 재검증
    const newTimes = getAvailableTimes(branch, form.reservation_date);
    const timeStillValid = newTimes.includes(form.reservation_time);
    setForm((f) => ({
      ...f,
      branch,
      reservation_time: timeStillValid ? f.reservation_time : "",
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
    if (!form.reservation_time) {
      setError("희망 시간을 선택해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, reservation_type: reservationType }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "예약 접수에 실패했습니다. 다시 시도해주세요.");
        return;
      }
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
      <section className="min-h-screen bg-[#0E0E10] flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D01E2E]/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#D01E2E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[11px] font-black tracking-[0.3em] text-[#D01E2E] mb-3">예약 접수 완료</p>
          <h2 className="text-3xl font-black tracking-tight text-[#F5F4F1] mb-4">
            신청이 완료되었습니다
          </h2>
          <p className="text-[15px] leading-7 text-[#8A8D91] mb-8">
            {form.branch} 담당자가 확인 후<br />연락처로 안내드립니다.
          </p>
          <button
            onClick={() => { setDone(false); setForm({ name:"", phone:"", branch:"목동점", reservation_date:"", reservation_time:"", goal:"", message:"" }); }}
            className="rounded-[10px] bg-[#1C1C1F] px-8 py-3.5 text-sm font-bold text-[#F5F4F1] hover:bg-[#252528] transition"
          >
            다시 예약하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0E0E10] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 lg:grid lg:grid-cols-[1fr_480px] lg:gap-16 xl:gap-24">

        {/* ── 왼쪽: 소개 ── */}
        <div className="mb-10 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
          <p className="mb-4 text-[11px] font-black tracking-[0.35em] text-[#D01E2E]">
            STRONG BOXING
          </p>
          <h1
            className="font-black tracking-[-0.05em] text-[#F5F4F1] mb-4"
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", lineHeight: 1.1, wordBreak: "keep-all" }}
          >
            복싱이 처음이어도,<br />편하게 시작하세요.
          </h1>
          <p className="text-[15px] leading-7 text-[#8A8D91] mb-8" style={{ wordBreak: "keep-all" }}>
            시설을 둘러보고 나에게 맞는 운동을 상담받으세요.
          </p>

          {/* 사진 */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
            <Image
              src="/images/gallery/gallery-2.jpg"
              alt="스트롱복싱 코칭 사진"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* 하단 배지 */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "👊", label: "초보자 환영" },
              { icon: "🥊", label: "개별 지도" },
              { icon: "📅", label: "편한 시간 방문" },
            ].map(({ icon, label }) => (
              <div key={label} className="rounded-xl border border-[#2C2C30] bg-[#141416] px-3 py-3 text-center">
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-[11px] font-bold text-[#8A8D91]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 오른쪽: 폼 ── */}
        <div>
          {/* 예약 유형 선택 */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {(["방문 상담", "일일 체험"] as const).map((type) => {
              const active = reservationType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setReservationType(type)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[#D01E2E] bg-[#D01E2E]/10"
                      : "border-[#2C2C30] bg-[#141416] hover:border-[#4A4C50]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        active ? "border-[#D01E2E]" : "border-[#4A4C50]"
                      }`}
                    >
                      {active && <span className="h-2 w-2 rounded-full bg-[#D01E2E]" />}
                    </span>
                    <span className={`text-[13px] font-black ${active ? "text-[#F5F4F1]" : "text-[#8A8D91]"}`}>
                      {type}
                    </span>
                  </div>
                  {type === "방문 상담" ? (
                    <p className="ml-6 text-[18px] font-black text-[#F5F4F1]">무료</p>
                  ) : (
                    <>
                      <p className="ml-6 text-[18px] font-black text-[#F5F4F1]">30,000원</p>
                      <p className="ml-6 text-[11px] font-semibold text-[#D01E2E]">당일 등록 시 전액 페이백</p>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 방문 지점 */}
            <div>
              <label className={labelCls}>방문 지점</label>
              <select
                value={form.branch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className={inputCls}
                style={{ colorScheme: "dark" }}
              >
                {Object.keys(branchData).map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              {/* 지점 정보 */}
              <div className="mt-2 rounded-xl border border-[#2C2C30] bg-[#141416] px-4 py-3 text-[13px] space-y-1.5">
                <div className="flex items-start gap-2 text-[#8A8D91]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                    <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                  <span>{branchInfo.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={`tel:${branchInfo.phone}`}
                    className="flex items-center gap-1.5 text-[#D01E2E] font-semibold hover:underline"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                    전화 문의
                  </a>
                  <a
                    href={branchInfo.naverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#8A8D91] hover:text-[#F5F4F1] transition"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    운영시간 확인
                  </a>
                </div>
              </div>
            </div>

            {/* 이름 / 연락처 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>이름 <span className="text-[#D01E2E]">*</span></label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="이름 입력"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>연락처 <span className="text-[#D01E2E]">*</span></label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className={inputCls}
                />
              </div>
            </div>

            {/* 희망 날짜 / 시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>희망 날짜 <span className="text-[#D01E2E]">*</span></label>
                <div className="relative">
                  <input
                    required
                    type="date"
                    min={getToday()}
                    value={form.reservation_date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className={inputCls + " cursor-pointer"}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>희망 시간 <span className="text-[#D01E2E]">*</span></label>
                <select
                  required
                  value={form.reservation_time}
                  onChange={(e) => setForm({ ...form, reservation_time: e.target.value })}
                  style={{ colorScheme: "dark" }}
                  className={inputCls}
                  disabled={times.length === 0}
                >
                  <option value="">{form.reservation_date ? "시간 선택" : "날짜 먼저 선택"}</option>
                  {times.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 운동 목적 */}
            <div>
              <label className={labelCls}>운동 목적 <span className="text-[#5A5C61] font-normal">(선택)</span></label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => {
                  const active = form.goal === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm({ ...form, goal: active ? "" : g })}
                      className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
                        active
                          ? "bg-[#D01E2E] text-white"
                          : "bg-[#1C1C1F] text-[#8A8D91] hover:bg-[#252528] hover:text-[#F5F4F1]"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 문의사항 */}
            <div>
              <label className={labelCls}>문의사항 <span className="text-[#5A5C61] font-normal">(선택)</span></label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="궁금한 점을 남겨주세요."
                className={inputCls + " resize-none"}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="rounded-xl bg-[#D01E2E]/10 border border-[#D01E2E]/30 px-4 py-3 text-[13px] text-[#D01E2E]">
                {error}
              </p>
            )}

            {/* 체험 결제 안내 */}
            {reservationType === "일일 체험" && (
              <p className="text-[12px] text-[#5A5C61] leading-5">
                체험비(30,000원)는 방문 후 현장에서 결제합니다. 당일 정식 등록 시 전액 차감됩니다.
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[10px] bg-[#D01E2E] py-4 text-[15px] font-black tracking-tight text-white transition hover:bg-[#B71C2B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "접수 중..."
                : reservationType === "방문 상담"
                ? "무료 상담 신청하기"
                : "일일 체험 신청하기"}
            </button>

            <p className="text-center text-[12px] text-[#5A5C61]">
              예약 확정 방식은 실제 운영 절차에 맞춰 안내해드립니다.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
