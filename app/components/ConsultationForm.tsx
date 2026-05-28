"use client";

import { useMemo, useState } from "react";

const branchTimes: Record<string, string[]> = {
  목동점: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  신정점: ["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
  개봉점: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
  철산점: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
  영등포점: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function isWeekend(dateString: string) {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 6;
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
    return branchTimes[form.branch] || [];
  }, [form.branch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isWeekend(form.reservation_date)) {
      alert("예약은 평일만 가능합니다.");
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

      alert("1일 체험 예약이 완료되었습니다!");

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
    <section id="consultation" className="bg-[#0d0d0f] px-6 py-28 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            1 DAY PASS
          </p>

          <h2 className="text-5xl font-black tracking-[-0.06em] md:text-6xl">
            1일 체험 예약
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            평일 운영시간 내 희망 날짜와 시간을 선택해주세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[34px] border border-white/10 bg-[#171719] p-8 md:p-10"
        >
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="이름"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
          />

          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="전화번호"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
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
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
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
                if (isWeekend(e.target.value)) {
                  alert("토요일/일요일은 선택할 수 없습니다. 평일을 선택해주세요.");
                  setForm({ ...form, reservation_date: "" });
                  return;
                }

                setForm({ ...form, reservation_date: e.target.value });
              }}
              style={{ colorScheme: "dark" }}
              className="w-full cursor-pointer rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#FC5230]"
            />

            <select
              required
              value={form.reservation_time}
              onChange={(e) =>
                setForm({ ...form, reservation_time: e.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
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
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
          />

          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="문의사항"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
          />

          <button
            disabled={loading}
            className="w-full rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "예약 접수중..." : "1일 체험 예약하기"}
          </button>
        </form>
      </div>
    </section>
  );
}