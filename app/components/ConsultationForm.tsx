"use client";

import { useState } from "react";

export default function ConsultationForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    branch: "목동점",
    goal: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <section className="bg-[#0d0d0f] px-6 py-28 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            1 DAY PASS
          </p>

          <h2 className="text-5xl font-black tracking-[-0.06em] md:text-6xl">
            1일 체험 예약
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            가까운 지점을 선택하고 스트롱복싱의 실제 수업을 경험해보세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[34px] border border-white/10 bg-[#171719] p-8 md:p-10"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-400">
              이름
            </label>

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="이름 입력"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-400">
              전화번호
            </label>

            <input
              required
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="010-0000-0000"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-400">
              지점 선택
            </label>

            <select
              value={form.branch}
              onChange={(e) =>
                setForm({ ...form, branch: e.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
            >
              <option>목동점</option>
              <option>신정점</option>
              <option>개봉점</option>
              <option>철산점</option>
              <option>영등포점</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-400">
              운동 목적
            </label>

            <input
              value={form.goal}
              onChange={(e) =>
                setForm({ ...form, goal: e.target.value })
              }
              placeholder="다이어트 / 체력증진 / 복싱입문"
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-400">
              문의사항
            </label>

            <textarea
              rows={5}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              placeholder="궁금한 점을 자유롭게 남겨주세요."
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black transition hover:scale-[1.02]"
          >
            {loading ? "예약 접수중..." : "1일 체험 예약하기"}
          </button>
        </form>
      </div>
    </section>
  );
}