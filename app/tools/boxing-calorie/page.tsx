"use client";

import { useState } from "react";

const intensityOptions = [
  { label: "가볍게", met: 6, desc: "기초 동작, 가벼운 쉐도우 복싱" },
  { label: "보통", met: 8, desc: "미트, 샌드백, 기본 트레이닝" },
  { label: "강하게", met: 10, desc: "고강도 복싱 트레이닝" },
];

export default function BoxingCaloriePage() {
  const [weight, setWeight] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [met, setMet] = useState(8);

  const weightNum = Number(weight);
  const minutesNum = Number(minutes);

  const calories =
    weightNum > 0 && minutesNum > 0
      ? Math.round(met * weightNum * (minutesNum / 60))
      : 0;

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="mb-8 inline-block text-zinc-400">
          ← 메인으로
        </a>

        <p className="mb-4 text-sm font-black tracking-[0.32em] text-[#FC5230]">
          STRONG BOXING TOOL
        </p>

        <h1 className="mb-5 text-5xl font-black leading-tight tracking-[-0.06em] md:text-7xl">
          복싱 칼로리
          <br />
          계산기
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-zinc-300">
          몸무게와 운동시간을 입력하면 복싱 트레이닝으로 예상되는 소모
          칼로리를 간단히 계산해볼 수 있습니다.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[30px] border border-white/10 bg-[#171719] p-7">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-bold">몸무게 kg</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black p-4 text-lg outline-none focus:border-[#FC5230]"
                  placeholder="예: 60"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">운동시간 분</label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black p-4 text-lg outline-none focus:border-[#FC5230]"
                  placeholder="예: 30"
                />
              </div>

              <div>
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
          </section>

          <section className="rounded-[30px] border border-[#FC5230]/30 bg-gradient-to-br from-[#181818] to-[#101010] p-7">
            <p className="mb-3 text-zinc-400">예상 소모 칼로리</p>

            <div className="mb-4 text-6xl font-black text-[#FC5230] md:text-7xl">
              {calories}
              <span className="ml-2 text-2xl text-white">kcal</span>
            </div>

            <p className="mb-8 leading-8 text-zinc-300">
              실제 소모 칼로리는 개인의 체력, 운동 강도, 휴식 시간에 따라
              달라질 수 있습니다.
            </p>

            <div className="rounded-[24px] bg-black p-5">
              <p className="mb-2 font-black">계산 기준</p>
              <p className="text-sm leading-7 text-zinc-400">
                칼로리 = 운동강도 MET × 몸무게 kg × 운동시간 h
              </p>
            </div>

            <a
              href="/#branch"
              className="mt-7 inline-flex w-full justify-center rounded-full bg-[#FC5230] px-8 py-4 font-black"
            >
              가까운 지점에서 시작하기
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}