import ReservationButton from "./ReservationButton";

const faqs = [
  {
    q: "운동이 처음인데 가능할까요?",
    a: "네, 가능합니다. 스트롱복싱 회원님들 중 상당수가 운동을 처음 시작하신 분들입니다. 기초 자세, 스텝, 펀치부터 차근차근 알려드리며 개인의 체력과 운동 경험에 맞춰 진도를 진행하고 있습니다.",
  },
  {
    q: "수업은 어떻게 진행되나요?",
    a: "정해진 시간에 모두가 같은 운동만 하는 방식이 아닙니다. 회원님이 방문하시는 시간에 맞춰 운동이 시작되며, 현재 수준과 목표에 맞는 운동을 진행합니다. 비슷한 수준의 회원님들이 계시면 함께 운동하기도 하고 개인 운동으로 진행하기도 합니다.",
  },
  {
    q: "여자 혼자 가도 괜찮나요?",
    a: "물론입니다. 실제로 여성 회원님들도 많이 운동하고 계시며 혼자 등록하시는 분들도 많습니다. 다이어트, 체력 향상, 스트레스 해소를 목적으로 편하게 운동하시는 분들이 많습니다.",
  },
  {
    q: "준비물은 무엇이 필요한가요?",
    a: "실내용 운동화와 편한 운동복만 준비해주시면 됩니다. 처음 체험하시는 분들은 별도 장비 없이 방문 가능하며 운동에 필요한 기본 장비는 체육관에서 안내해드립니다.",
  },
  {
    q: "복싱 시작할 때 장비는 꼭 구매해야 하나요?",
    a: "운동을 시작하시면 핸드랩과 글러브가 필요합니다. 글러브는 개인적으로 준비하셔도 되고 체육관에서 구매하실 수도 있습니다. 처음 방문하시면 목적에 맞게 안내해드립니다.",
  },
  {
    q: "어린 아이도 운동할 수 있나요?",
    a: "네, 가능합니다. 어린 아이부터 성인, 중장년층까지 다양한 연령대의 회원님들이 운동하고 있습니다. 연령과 체력에 맞춰 운동 강도를 조절하기 때문에 누구나 안전하게 운동하실 수 있습니다.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FaqSection() {
  return (
    <section className="bg-[#111214] px-5 py-28 text-white md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

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

              <p className="leading-7 text-zinc-400">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-white/10 bg-[#16171A] p-8 text-center">
          <h3 className="mb-4 text-3xl font-black">
            아직 고민 중이신가요?
          </h3>

          <p className="mb-7 text-zinc-400">
            직접 와서 분위기와 운동 방식을 경험해보세요.
          </p>

          <ReservationButton className="inline-flex rounded-full bg-[#FC5230] px-8 py-4 font-black">
            무료체험 신청하기
          </ReservationButton>
        </div>
      </div>
    </section>
  );
}