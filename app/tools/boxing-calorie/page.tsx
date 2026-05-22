"use client";

import { useMemo, useState } from "react";

export default function BoxingCaloriePage() {
  const [weight, setWeight] = useState(70);
  const [minutes, setMinutes] = useState(60);

  const calories = useMemo(() => {
    return Math.round(weight * (minutes / 60) * 9.8);
  }, [weight, minutes]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#111315] text-white">
      <section className="relative flex min-h-screen items-center px-6 py-24">
        {/* 배경 glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FC5230]/10 blur-[140px]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-20 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#FC5230]">
              STRONG BOXING
            </p>

            <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-[120px]">
              HOW MUCH
              <br />
              WILL YOU
              <br />
              BURN?
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-400">
              스트롱복싱 수업 기준 예상 칼로리 소모량입니다.
              직접 움직여보며 확인해보세요.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full max-w-xl rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            {/* kcal */}
            <div className="mb-14">
              <p className="mb-3 text-sm font-bold tracking-[0.28em] text-zinc-500">
                ESTIMATED CALORIES
              </p>

              <div className="flex items-end gap-3">
                <span className="text-7xl font-black tracking-[-0.06em] md:text-8xl">
                  {calories}
                </span>

                <span className="pb-3 text-2xl font-bold text-[#FC5230]">
                  KCAL
                </span>
              </div>
            </div>

            {/* 체중 */}
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold">체중</p>

                <p className="text-[#FC5230] font-black">
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
                className="w-full accent-[#FC5230]"
              />
            </div>

            {/* 운동시간 */}
            <div className="mb-14">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold">운동 시간</p>

                <p className="text-[#FC5230] font-black">
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
                className="w-full accent-[#FC5230]"
              />
            </div>

            {/* CTA */}
            <button className="w-full rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black transition hover:scale-[1.02]">
              무료 체험 신청하기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}