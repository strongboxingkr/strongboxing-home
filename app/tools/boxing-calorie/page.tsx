"use client";

import { useMemo, useState } from "react";

export default function BoxingCaloriePage() {
  const [weight, setWeight] = useState(70);
  const [minutes, setMinutes] = useState(60);

  const calories = useMemo(() => {
    return Math.round(weight * (minutes / 60) * 9.8);
  }, [weight, minutes]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#16171A] text-white">
      <section className="relative flex min-h-screen items-center px-6 py-24">
        {/* background */}
        <img
          src="/images/gallery/gallery-1.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />

        <div className="absolute inset-0 bg-[#16171A]/85" />

        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D01E2E]/10 blur-[140px]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-20 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#D01E2E]">
              STRONG BOXING
            </p>

            <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.08em] md:text-[110px]">
              복싱은
              <br />
              생각보다
              <br />
              많이 태웁니다.
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-[#8A8D91]">
              스트롱복싱 수업 기준 예상 칼로리 소모량입니다.
              체중과 운동시간에 따라 직접 확인해보세요.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "다이어트 복싱",
                "초보자 가능",
                "스트레스 해소",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-white/10 bg-[#1A1A1C] px-5 py-3 text-sm font-bold text-[#8A8D91]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full max-w-xl border border-white/10 bg-[#1A1A1C]/90 p-8 backdrop-blur-xl md:p-10">
            {/* kcal */}
            <div className="mb-14 border-b border-white/10 pb-10">
              <p className="mb-3 text-sm font-black tracking-[0.28em] text-[#4A4C50]">
                ESTIMATED CALORIES
              </p>

              <div className="flex items-end gap-3">
                <span className="text-7xl font-black tracking-[-0.08em] md:text-8xl">
                  {calories}
                </span>

                <span className="pb-3 text-2xl font-black text-[#D01E2E]">
                  KCAL
                </span>
              </div>
            </div>

            {/* 체중 */}
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold text-[#8A8D91]">
                  체중
                </p>

                <p className="font-black text-[#D01E2E]">
                  {weight}kg
                </p>
              </div>

              <input
                type="range"
                min={40}
                max={120}
                value={weight}
                onChange={(e) =>
                  setWeight(Number(e.target.value))
                }
                className="w-full accent-[#D01E2E]"
              />
            </div>

            {/* 운동시간 */}
            <div className="mb-14">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold text-[#8A8D91]">
                  운동 시간
                </p>

                <p className="font-black text-[#D01E2E]">
                  {minutes}분
                </p>
              </div>

              <input
                type="range"
                min={20}
                max={120}
                step={10}
                value={minutes}
                onChange={(e) =>
                  setMinutes(Number(e.target.value))
                }
                className="w-full accent-[#D01E2E]"
              />
            </div>

            {/* result */}
            <div className="mb-10 border border-white/10 bg-[#0E0E10]/30 p-5">
              <p className="text-sm leading-7 text-[#8A8D91]">
                {minutes}분 동안 약{" "}
                <span className="font-black text-white">
                  {calories}kcal
                </span>
                를 소모할 수 있습니다.
                <br />
                실제 수업 강도와 개인 운동량에 따라 달라질 수 있습니다.
              </p>
            </div>

            {/* CTA */}
            <a
              href="/reservation"
              className="block w-full rounded-[10px] bg-[#D01E2E] px-8 py-5 text-center text-lg font-black transition hover:bg-[#B71C2B]"
            >
              방문 상담 신청하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}