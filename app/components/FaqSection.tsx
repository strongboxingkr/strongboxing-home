import ReservationButton from "./ReservationButton";

const faqs = [
  {
    q: "원데이 클래스와 회원권 가격은 어떻게 확인하나요?",
    a: "원데이 클래스는 30,000원 현장결제이며 당일 등록 시 체험비 전액 차감. 회원권 가격은 지점에 문의해 주세요.",
  },
  {
    q: "운동이 처음인데 가능할까요?",
    a: "네, 가능합니다. 스트롱복싱 회원님들 중 상당수가 운동을 처음 시작하신 분들입니다. 기초 자세, 스텝, 펀치부터 차근차근 알려드리며 개인의 체력과 운동 경험에 맞춰 진도를 진행하고 있습니다.",
  },
  {
    q: "수업은 어떻게 진행되나요?",
    a: "운영시간 내 편한 시간에 방문해 각자 운동을 시작해요. 운동하는 동안 관장·코치가 개인별 진도에 맞춰 다음 동작을 알려드리고, 연습하는 자세를 봐드려요.",
  },
  {
    q: "여성도 혼자 복싱을 시작할 수 있나요?",
    a: "네. 혼자 오셔도 첫날에는 서는 자세, 가드, 스텝부터 함께 연습해요. 상대와 겨루는 스파링이 부담스럽다면 미트와 샌드백 위주로 운동할 수 있어요. 체력 관리나 스트레스 해소처럼 운동하는 이유를 알려주시면 강도와 진도를 맞춰드려요.",
  },
  {
    q: "준비물은 무엇이 필요한가요?",
    a: "실내용 운동화와 편한 운동복만 준비해주시면 됩니다. 처음 방문하시는 분들도 별도 장비 없이 운동 가능하며 필요한 기본 장비는 체육관에서 안내해드립니다.",
  },
  {
    q: "복싱 시작할 때 장비는 꼭 구매해야 하나요?",
    a: "운동을 시작하시면 핸드랩과 글러브가 필요합니다. 글러브는 개인적으로 준비하셔도 되고 체육관에서 구매하실 수도 있습니다. 처음 방문하시면 목적에 맞게 안내해드립니다.",
  },
  {
    q: "초등학생도 복싱을 배울 수 있나요?",
    a: "네. 처음에는 줄넘기, 균형 잡기, 기본 자세와 스텝처럼 아이가 따라 하기 쉬운 동작부터 배워요. 복싱 경험과 체력에 맞춰 운동량을 조절하고, 미트와 샌드백을 활용해 기본기를 익혀요. 방문 전에 아이의 학년과 운동 경험을 말씀해 주시면 지점에서 참여 가능한 시간대를 안내해 드려요.",
  },
  {
    q: "철산복싱, 목동복싱, 개봉복싱 지점별 상담이 가능한가요?",
    a: "네, 스트롱복싱은 철산점, 목동점, 개봉점, 신정점, 영등포점 등 지점별로 방문 상담이 가능합니다. 가까운 지점을 선택하여 상담 예약하실 수 있습니다.",
  },
  {
    q: "광명, 양천구, 구로구 근처에서도 다니기 편한가요?",
    a: "철산점은 광명과 철산동 인근, 목동점과 신정점은 양천구 인근, 개봉점은 구로구와 고척동 인근 회원님들이 많이 이용하고 있습니다.",
  },
  {
    q: "다이어트 복싱이나 초보자 복싱도 가능한가요?",
    a: "복싱을 처음 시작하는 분들도 기초부터 운동할 수 있으며 다이어트, 체력 향상, 스트레스 해소 등 목적에 맞게 운동 방향을 안내해드립니다.",
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
          <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#D01E2E]">
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
              className="rounded-[4px] border border-[#4A4C50]/30 bg-[#1A1A1C] p-7 transition-all duration-200 hover:border-[#4A4C50]/55"
            >
              <h3 className="mb-4 text-2xl font-black tracking-[-0.04em]">
                {item.q}
              </h3>

              <p className="leading-[1.9] text-[#C9C9C9]">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[4px] border border-[#4A4C50]/30 bg-[#16171A] p-8 text-center">
          <h3 className="mb-4 text-3xl font-black">
            아직 고민 중이신가요?
          </h3>

          <p className="mb-7 text-[#8A8D91]">
            직접 와서 분위기와 운동 방식을 경험해보세요.
          </p>

          <ReservationButton className="inline-flex rounded-[4px] bg-[#D01E2E] px-8 py-4 font-black transition hover:bg-[#B71C2B]">
            방문상담 신청하기
          </ReservationButton>
        </div>
      </div>
    </section>
  );
}
