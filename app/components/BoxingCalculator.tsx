"use client";

import { useMemo, useState } from "react";
import ReservationButton from "./ReservationButton";

export default function BoxingCalculator() {
  const [weight, setWeight] = useState(70);
  const [minutes, setMinutes] = useState(60);

  const calories = useMemo(() => {
    return Math.round(weight * (minutes / 60) * 9.8);
  }, [weight, minutes]);

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-[#111214] px-5 py-28 md:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(252,82,48,.10),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* LEFT */}
        <div>
          <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            BOXING CALCULATOR
          </p>

          <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.07em] md:text-8xl">
            얼마나
            <br />
            달라질까요?
          </h2>

          <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-400">
            스트롱복싱 수업 기준 예상 칼로리 소모량입니다.
            직접 움직여보며 확인해보세요.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "다이어트 복싱",
              "초보자 가능",
              "스트레스 해소",
            ].map((item) => (
              <div
                key={item}
                className="border border-white/10 bg-[#202126] px-5 py-3 text-sm font-bold text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="border border-white/10 bg-[#202126] p-7 md:p-10">
          <p className="mb-3 text-sm font-black tracking-[0.28em] text-zinc-500">
            ESTIMATED CALORIES
          </p>

          <div className="flex items-end gap-3">
            <span className="text-7xl font-black tracking-[-0.08em] md:text-[120px]">
              {calories}
            </span>

            <span className="pb-3 text-2xl font-black text-[#FC5230] md:text-4xl">
              KCAL
            </span>
          </div>

          {/* 체중 */}
          <div className="mt-14">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">현재 몸무게</p>

              <p className="font-black text-[#FC5230]">
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
              className="h-2 w-full cursor-pointer appearance-none bg-zinc-700 accent-[#FC5230]"
            />
          </div>

          {/* 운동시간 */}
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">운동 시간</p>

              <p className="font-black text-[#FC5230]">
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
              className="h-2 w-full cursor-pointer appearance-none bg-zinc-700 accent-[#FC5230]"
            />
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {[
              [
                "주 3회 기준",
                `${Math.round(calories * 3)} kcal`,
              ],
              [
                "60분 기준",
                "고강도 복싱",
              ],
              [
                "추천",
                "다이어트 운동",
              ],
            ].map(([title, value]) => (
              <div
                key={title}
                className="border border-white/10 bg-[#16171A] p-5"
              >
                <p className="text-sm text-zinc-500">
                  {title}
                </p>

                <p className="mt-2 text-lg font-black">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <ReservationButton className="mt-10 inline-flex w-full justify-center bg-[#FC5230] px-8 py-5 text-lg font-black transition hover:scale-[1.01]">
            가까운 지점에서 시작하기
          </ReservationButton>
        </div>
      </div>
    </section>
  );
}