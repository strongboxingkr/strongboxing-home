"use client";

import { useMemo, useState } from "react";
import { trackReservationComplete } from "@/lib/gtag";

const branchTimes: Record<string, Record<number, string[]>> = {
  목동점: {
    1: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    2: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    3: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    4: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    5: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    6: ["11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  신정점: {
    1: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    2: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    3: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    4: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    5: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    6: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  개봉점: {
    1: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    2: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    3: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    4: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    5: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
  },
  철산점: {
    1: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    2: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    3: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    4: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    5: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    6: ["14:00", "15:00", "16:00", "17:00"],
    0: ["14:00", "15:00", "16:00", "17:00"],
  },
  영등포점: {
    1: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    2: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    3: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    4: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
    5: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
  },
};

function getAvailableTimes(branch: string, dateString: string) {
  if (!dateString) return [];
  const day = new Date(dateString).getDay();
  return branchTimes[branch]?.[day] || [];
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function ConsultationForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    branch: "목동점",
    reservation_date: "",
    reservation_time: "",
    goal: "",
    message: "",
  });

  const times = useMemo(() => {
    return getAvailableTimes(form.branch, form.reservation_date);
  }, [form.branch, form.reservation_date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.reservation_time) {
      alert("예약 가능한 시간을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "예약 실패");
        return;
      }

      trackReservationComplete({ branch_name: form.branch });

      alert("방문 상담 예약이 완료되었습니다!");

      setForm({
        name: "",
        phone: "",
        branch: "목동점",
        reservation_date: "",
        reservation_time: "",
        goal: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="consultation" className="bg-[#0E0E10] px-6 py-28 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#D01E2E]">
            1 DAY PASS
          </p>

          <h2 className="text-5xl font-black tracking-[-0.06em] md:text-6xl">
            방문 상담 예약
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#8A8D91]">
            지점별 운영시간에 맞춰 희망 날짜와 시간을 선택해주세요.
          </p>

          {/* 예약 옵션 안내 */}
          <div className="mx-auto mt-8 flex max-w-sm divide-x divide-[#4A4C50]/30 rounded-[12px] border border-[#4A4C50]/30 bg-[#141416] overflow-hidden">
            <div className="flex-1 px-5 py-4 text-center">
              <p className="text-[11px] font-semibold text-[#8A8D91]">방문 상담 예약</p>
              <p className="mt-1 text-base font-black text-white">무료</p>
            </div>
            <div className="flex-1 px-5 py-4 text-center">
              <p className="text-[11px] font-semibold text-[#8A8D91]">일일권</p>
              <p className="mt-1 text-base font-black text-white">30,000원</p>
              <p className="mt-0.5 text-[10px] text-[#D01E2E] font-semibold">당일 등록 시 페이백</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[16px] border border-[#4A4C50]/30 bg-[#141416] p-8 md:p-10"
        >
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="이름"
            className="w-full rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 outline-none focus:border-[#D01E2E]"
          />

          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="전화번호"
            className="w-full rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 outline-none focus:border-[#D01E2E]"
          />

          <select
            value={form.branch}
            onChange={(e) =>
              setForm({
                ...form,
                branch: e.target.value,
                reservation_time: "",
              })
            }
            className="w-full rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 outline-none focus:border-[#D01E2E]"
          >
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>철산점</option>
            <option>영등포점</option>
          </select>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              required
              type="date"
              min={getToday()}
              value={form.reservation_date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const availableTimes = getAvailableTimes(
                  form.branch,
                  selectedDate
                );

                if (availableTimes.length === 0) {
                  alert("선택한 날짜는 해당 지점 예약이 불가능합니다.");

                  setForm({
                    ...form,
                    reservation_date: "",
                    reservation_time: "",
                  });

                  return;
                }

                setForm({
                  ...form,
                  reservation_date: selectedDate,
                  reservation_time: "",
                });
              }}
              style={{ colorScheme: "dark" }}
              className="w-full cursor-pointer rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 text-white outline-none focus:border-[#D01E2E]"
            />

            <select
              required
              value={form.reservation_time}
              onChange={(e) =>
                setForm({ ...form, reservation_time: e.target.value })
              }
              className="w-full rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 outline-none focus:border-[#D01E2E]"
            >
              <option value="">희망 시간 선택</option>
              {times.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </div>

          <input
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            placeholder="운동 목적"
            className="w-full rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 outline-none focus:border-[#D01E2E]"
          />

          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="문의사항"
            className="w-full rounded-[10px] border border-[#4A4C50]/30 bg-[#0E0E10] px-5 py-4 outline-none focus:border-[#D01E2E]"
          />

          <button
            disabled={loading}
            className="w-full rounded-[10px] bg-[#D01E2E] px-8 py-5 text-lg font-black transition hover:bg-[#B71C2B] disabled:opacity-50"
          >
            {loading ? "예약 접수중..." : "방문 상담 예약하기"}
          </button>
        </form>
      </div>
    </section>
  );
}