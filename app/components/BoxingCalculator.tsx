"use client";

import { useMemo, useState } from "react";

const intensityOptions = [
  { label: "가볍게", met: 6, desc: "기초 동작, 가벼운 쉐도우 복싱" },
  { label: "보통", met: 8, desc: "미트, 샌드백, 기본 트레이닝" },
  { label: "강하게", met: 10, desc: "고강도 복싱 트레이닝" },
];

export default function BoxingCalculator() {
  const [weight, setWeight] = useState("60");
  const [targetWeight, setTargetWeight] = useState("55");
  const [minutes, setMinutes] = useState("30");
  const [met, setMet] = useState(8);

  const result = useMemo(() => {
    const weightNum = Number(weight);
    const targetNum = Number(targetWeight);
    const minutesNum = Number(minutes);

    const calories =
      weightNum > 0 && minutesNum > 0
        ? Math.round(met * weightNum * (minutesNum / 60))
        : 0;

    const weeklyCalories = calories * 3;
    const loseKg = weightNum - targetNum;
    const totalNeedCalories = loseKg > 0 ? loseKg * 7700 : 0;
    const weeks =
      weeklyCalories > 0 && totalNeedCalories > 0
        ? Math.ceil(totalNeedCalories / weeklyCalories)
        : 0;

    return {
      calories,
      weeklyCalories,
      loseKg,
      weeks,
    };
  }, [weight, targetWeight, minutes, met]);

  return (
    <section id="calculator" className="bg-[#0d0d0f] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm font-black tracking-[0.32em] text-[#FC5230]">
          BOXING CALORIE CALCULATOR
        </p>

        <h2 className="mb-5 text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
          복싱하면 얼마나
          <br />
          소모될까요?
        </h2>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-zinc-400">
          몸무게, 목표 체중, 운동시간을 입력하면 1회 복싱 예상 칼로리와
          주 3회 운동 기준 예상 기간을 계산해볼 수 있습니다.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-[#171719] p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">현재 몸무게 kg</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">목표 몸무게 kg</label>
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-bold">1회 운동시간 분</label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block font-bold">운동 강도</label>

              <div className="grid gap-3">
                {intensityOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setMet(option.met)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      met === option.met
                        ? "border-[#FC5230] bg-[#FC5230]/15"
                        : "border-white/10 bg-black"
                    }`}
                  >
                    <div className="font-black">{option.label}</div>
                    <div className="mt-1 text-sm text-zinc-400">
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#FC5230]/30 bg-gradient-to-br from-[#181818] to-[#101010] p-7">
            <p className="mb-2 text-zinc-400">1회 예상 소모 칼로리</p>

            <div className="mb-7 text-6xl font-black text-[#FC5230] md:text-7xl">
              {result.calories}
              <span className="ml-2 text-2xl text-white">kcal</span>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[24px] bg-black p-5">
                <p className="text-sm text-zinc-400">주 3회 기준</p>
                <p className="mt-1 text-3xl font-black">
                  약 {result.weeklyCalories} kcal / 주
                </p>
              </div>

              <div className="rounded-[24px] bg-black p-5">
                <p className="text-sm text-zinc-400">목표 감량</p>
                <p className="mt-1 text-3xl font-black">
                  {result.loseKg > 0 ? `${result.loseKg}kg` : "목표 체중 확인"}
                </p>
              </div>

              <div className="rounded-[24px] bg-[#FC5230] p-5">
                <p className="text-sm font-bold text-white/80">
                  주 3회 복싱만 기준 예상 기간
                </p>
                <p className="mt-1 text-4xl font-black">
                  {result.weeks > 0 ? `약 ${result.weeks}주` : "계산 대기"}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-zinc-400">
              실제 감량은 식단, 생활습관, 운동 강도, 개인 체질에 따라 달라질 수
              있습니다. 계산 결과는 참고용입니다.
            </p>

            <a
              href="#branch"
              className="mt-7 inline-flex w-full justify-center rounded-full bg-[#FC5230] px-8 py-4 font-black text-white"
            >
              가까운 지점에서 시작하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}