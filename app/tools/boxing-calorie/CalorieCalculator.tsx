"use client";

import { useState } from "react";

export default function CalorieCalculator() {
  const [weight, setWeight] = useState(70);
  const [minutes, setMinutes] = useState(60);
  const calories = Math.round(weight * (minutes / 60) * 9.8);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F5F4F1]">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-16">
        <a href="/#programs" className="text-sm font-semibold text-[#B5B5BC] hover:text-[#F5F4F1]">
          ← 메인 운동 안내
        </a>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <header className="border-t border-white/15 pt-6">
            <h1 className="break-keep text-3xl font-black tracking-tight sm:text-4xl">
              복싱 칼로리 계산기
            </h1>
            <p className="mt-4 max-w-sm break-keep text-sm leading-7 text-[#B5B5BC]">
              체중과 운동 시간을 조절해 예상 소모량을 확인해 보세요.
            </p>
          </header>

          <section aria-label="칼로리 계산" className="rounded-[4px] border border-white/10 bg-[#141416] p-5 sm:p-8">
            <div className="border-b border-white/10 pb-5">
              <p className="text-sm font-semibold text-[#B5B5BC]">예상 칼로리 소모량</p>
              <output htmlFor="boxing-weight boxing-minutes" className="mt-2 block text-5xl font-black tracking-tight tabular-nums">
                {calories} <span className="text-lg font-semibold tracking-normal text-[#B5B5BC]">kcal</span>
              </output>
            </div>

            <div className="space-y-6 py-6">
              <div>
                <label htmlFor="boxing-weight" className="mb-3 flex justify-between gap-4 text-sm font-semibold">
                  <span>체중</span><span className="tabular-nums">{weight} kg</span>
                </label>
                <input id="boxing-weight" type="range" min={40} max={120} value={weight} onChange={(event) => setWeight(Number(event.target.value))} className="w-full accent-[#D01E2E]" />
              </div>
              <div>
                <label htmlFor="boxing-minutes" className="mb-3 flex justify-between gap-4 text-sm font-semibold">
                  <span>운동 시간</span><span className="tabular-nums">{minutes}분</span>
                </label>
                <input id="boxing-minutes" type="range" min={20} max={120} step={10} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} className="w-full accent-[#D01E2E]" />
              </div>
            </div>
            <p className="border-t border-white/10 pt-4 text-xs leading-6 text-[#B5B5BC]">
              실제 소모량은 운동 강도와 개인차에 따라 달라질 수 있어요.
            </p>
            <a href="/reservation" className="mt-5 inline-flex rounded-[4px] bg-[#D01E2E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#B71C2B]">
              방문 상담 예약 →
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
