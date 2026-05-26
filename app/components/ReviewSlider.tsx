"use client";

const reviews = [
  {
    title: "3개월 -8kg 감량",
    tags: ["주 3회 운동", "복싱 처음", "여성회원"],
    text: "처음엔 걱정했는데 미트 수업이 재밌어서 꾸준히 나오게 됐어요.",
  },
  {
    title: "퇴근 후 스트레스 해소",
    tags: ["직장인", "체력 증가", "퇴근 운동"],
    text: "하루 스트레스가 샌드백 치면서 풀려서 운동이 기다려져요.",
  },
  {
    title: "운동 처음인데 적응 완료",
    tags: ["초보 입문", "기초 자세", "미트 만족"],
    text: "기초부터 알려줘서 운동을 안 해봤어도 부담 없었어요.",
  },
  {
    title: "다이어트가 지루하지 않음",
    tags: ["다이어트", "유산소", "복싱 루틴"],
    text: "런닝머신은 금방 질렸는데 복싱은 시간이 빨리 가요.",
  },
];

export default function ReviewSlider() {
  return (
    <section className="overflow-hidden bg-[#16171A] px-5 py-28 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
              REVIEW
            </p>

            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
              처음 시작한 분들의
              <br />
              진짜 운동 후기.
            </h2>
          </div>

          <p className="max-w-md leading-8 text-zinc-400">
            길게 읽는 후기보다, 빠르게 넘기며 볼 수 있는 짧은 후기 카드입니다.
          </p>
        </div>

        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {reviews.map((review) => (
            <div
              key={review.title}
              className="min-w-[78vw] border border-white/10 bg-[#202126] p-7 md:min-w-0"
            >
              <div className="mb-8 h-48 border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(252,82,48,.22),transparent_35%),#111214]" />

              <h3 className="mb-4 text-3xl font-black leading-tight tracking-[-0.05em]">
                {review.title}
              </h3>

              <div className="mb-5 flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#FC5230]/15 px-3 py-2 text-xs font-black text-[#FC5230]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="leading-7 text-zinc-300">
                “{review.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}