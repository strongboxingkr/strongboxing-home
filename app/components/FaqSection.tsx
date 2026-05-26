import ReservationButton from "./ReservationButton";

const faqs = [
  {
    q: "운동 처음인데 가능할까요?",
    a: "가능합니다. 스트롱복싱은 기본 자세, 스텝, 펀치부터 단계별로 진행해서 초보자도 부담 없이 시작할 수 있습니다.",
  },
  {
    q: "여자 혼자 가도 괜찮나요?",
    a: "네. 혼자 오시는 여성 회원님들도 많습니다. 처음 오셔도 코치가 수업 흐름을 안내해드립니다.",
  },
  {
    q: "다이어트 효과가 있나요?",
    a: "복싱은 유산소와 근력운동이 같이 들어가서 체력 향상과 다이어트에 도움이 됩니다. 꾸준히 주 3회 이상 추천드립니다.",
  },
  {
    q: "준비물은 뭐가 필요한가요?",
    a: "편한 운동복과 실내용 운동화면 충분합니다. 체험 시 필요한 기본 장비는 지점에서 안내받으실 수 있습니다.",
  },
  {
    q: "키즈반도 있나요?",
    a: "키즈 수업은 지점별 운영 여부가 다를 수 있습니다. 원하는 지점으로 체험 상담을 남겨주시면 안내해드립니다.",
  },
  {
    q: "회원권 가격은 어디서 확인하나요?",
    a: "회원권은 지점별 이벤트와 할인 내용이 달라 무료체험 상담에서 정확히 안내드리고 있습니다.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-[#111214] px-5 py-28 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            FAQ
          </p>

          <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
            시작 전 많이 묻는
            <br />
            질문들.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="border border-white/10 bg-[#202126] p-7"
            >
              <h3 className="mb-4 text-2xl font-black tracking-[-0.04em]">
                {item.q}
              </h3>

              <p className="leading-7 text-zinc-400">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-white/10 bg-[#16171A] p-8 text-center">
          <h3 className="mb-4 text-3xl font-black">
            아직 고민 중이라면?
          </h3>

          <p className="mb-7 text-zinc-400">
            만원 체험으로 스트롱복싱 분위기를 먼저 경험해보세요.
          </p>

          <ReservationButton className="inline-flex rounded-full bg-[#FC5230] px-8 py-4 font-black">
            무료체험으로 시작하기
          </ReservationButton>
        </div>
      </div>
    </section>
  );
}