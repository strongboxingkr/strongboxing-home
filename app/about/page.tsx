import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import RevealObserver from "@/app/components/RevealObserver";
import FloatingCTA from "@/app/components/FloatingCTA";
import ReservationButton from "@/app/components/ReservationButton";

/* ─── Metadata ─────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: { absolute: "브랜드 소개 | 스트롱복싱의 운동 시스템과 복싱 코칭" },
  description:
    "정해진 수업시간 없는 자유로운 운동, 방치 없는 개인별 코칭, 6단계 복싱 루틴, 전 지점 인바디 측정과 안전한 맞춤 스파링까지. 스트롱복싱의 운동 방식과 브랜드 기준을 소개합니다.",
  alternates: { canonical: "https://www.strongboxing.kr/about" },
  openGraph: {
    title: "브랜드 소개 | 스트롱복싱",
    description:
      "정해진 수업시간 없는 자유로운 운동, 방치 없는 개인별 코칭, 6단계 복싱 루틴, 전 지점 인바디 측정과 안전한 맞춤 스파링까지.",
    url: "https://www.strongboxing.kr/about",
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "스트롱복싱 브랜드 소개" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "브랜드 소개 | 스트롱복싱",
    description:
      "정해진 수업시간 없는 자유로운 운동, 방치 없는 개인별 코칭, 6단계 복싱 루틴, 전 지점 인바디 측정.",
    images: ["/og.png"],
  },
};

/* ─── JSON-LD ──────────────────────────────────────────────── */
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "스트롱복싱 브랜드 소개",
  url: "https://www.strongboxing.kr/about",
  description:
    "스트롱복싱은 정해진 수업시간 없이 개인 일정에 맞춰 운동할 수 있고, 선수 출신 지도진이 한 사람씩 코칭합니다.",
  mainEntity: {
    "@type": "SportsActivityLocation",
    name: "스트롱복싱",
    url: "https://strongboxing.kr",
  },
};

/* ─── Data ─────────────────────────────────────────────────── */
const routineSteps = [
  { num: "01", name: "가벼운 몸풀기", desc: "스트레칭과 워밍업" },
  { num: "02", name: "줄넘기 3라운드", desc: "기초 체력 준비" },
  { num: "03", name: "기초자세와 스텝", desc: "복싱 기본기 연습" },
  { num: "04", name: "미트 트레이닝", desc: "지도진과 개인별 타격 훈련" },
  { num: "05", name: "샌드백 운동", desc: "동작을 익히고 스트레스 해소" },
  { num: "06", name: "마무리 체력운동", desc: "근력·체력·다이어트 마무리" },
];

const audiences = [
  "복싱을 처음 배우는 초보자",
  "정해진 수업시간이 부담스러운 직장인",
  "학교와 학원 일정이 유동적인 학생",
  "다이어트와 체력 향상이 목적인 분",
  "운동 중 방치될까 걱정되는 분",
  "복싱을 기본부터 제대로 배우고 싶은 분",
  "루틴 후 추가 운동과 개인 연습을 원하는 분",
  "안전하게 스파링을 경험해보고 싶은 분",
];

const branches = [
  {
    slug: "gaebong",
    name: "개봉점",
    area: "서울 구로구",
    image: "/images/branches/gaebong.jpg",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    phone: "02-2060-1279",
    hours: ["월-금 13:00~23:00"],
  },
  {
    slug: "sinjeong",
    name: "신정점",
    area: "서울 양천구",
    image: "/images/branches/sinjeong.jpg",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    phone: "02-2647-3373",
    hours: ["월-금 10:00~24:00", "토 10:00~16:00"],
  },
  {
    slug: "mokdong",
    name: "목동점",
    area: "서울 양천구",
    image: "/images/branches/mokdong.png",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    phone: "02-2643-5971",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
  },
  {
    slug: "cheolsan",
    name: "철산점",
    area: "경기 광명시",
    image: "/images/branches/cheolsan.jpg",
    booking: "",
    address: "경기도 광명시 철산동 56-14 3층",
    phone: "02-2066-0406",
    hours: ["월-금 14:00~23:00", "토일 14:00~18:00"],
  },
  {
    slug: "yeongdeungpo",
    name: "영등포점",
    area: "서울 영등포구",
    image: "/images/branches/yeongdeungpo.jpg",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    phone: "02-831-9312",
    hours: ["월-금 13:00~23:00"],
  },
];

/* ─── Page ─────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <main style={{ background: "#0E0E10", color: "#F5F4F1" }} className="min-h-screen">
        <RevealObserver />
        <SiteHeader />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
        />

        {/* ════════════════════════════════════════
            SECTION 1 · HERO
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
          {/* 배경 이미지 */}
          <img
            src="/images/gallery/gallery-1.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.16) grayscale(0.25)" }}
          />
          {/* 상단 레드 라인 */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-[2px] w-full"
            style={{ background: "#D01E2E" }}
          />
          {/* 도트 그리드 텍스처 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-6 md:px-8"
            style={{ minHeight: "92vh" }}>
            <div className="max-w-2xl pt-32 pb-24">
              <p
                className="reveal mb-7 text-[10px] font-black tracking-[0.45em]"
                style={{ color: "#8A8D91" }}
              >
                ABOUT STRONG BOXING
              </p>

              <h1
                className="reveal d1 font-black"
                style={{
                  fontSize: "clamp(48px, 7.5vw, 104px)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.05em",
                  color: "#F5F4F1",
                  wordBreak: "keep-all",
                }}
              >
                복싱을 배우는
                <br />
                <span
                  style={{
                    WebkitTextStroke: "1.5px #F5F4F1",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  모든 순간을
                </span>
                <br />
                제대로.
              </h1>

              <div className="reveal d2 my-8 h-[2px] w-14" style={{ background: "#D01E2E" }} />

              <p
                className="reveal d3 max-w-md text-sm leading-[2] md:text-base md:leading-[2.1]"
                style={{ color: "#C9C9C9", wordBreak: "keep-all" }}
              >
                스트롱복싱은 처음 시작하는 순간부터
                <br />
                혼자서도 자신의 운동을 이어갈 수 있을 때까지,
                <br />
                배우는 과정과 운동하는 환경을 함께 준비합니다.
              </p>

              <div className="reveal d4 mt-10 flex flex-wrap gap-3">
                <a
                  href="#locations"
                  className="group inline-flex items-center gap-2 rounded-[10px] bg-[#D01E2E] px-7 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]"
                >
                  가까운 지점 찾기
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <ReservationButton
                  className="group inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] px-7 py-3.5 text-sm font-black text-[#8A8D91] transition-all duration-300 hover:bg-white/5"
                  location="about_hero"
                >
                  방문 상담 예약
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </ReservationButton>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 · BRAND INTRO
        ════════════════════════════════════════ */}
        <section
          className="px-6 py-28 md:px-8"
          style={{ background: "#141416", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>
              OUR STANDARD
            </p>
            <h2
              className="reveal d1 mb-16 font-black leading-[0.88]"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.05em",
                wordBreak: "keep-all",
              }}
            >
              좋은 복싱장은
              <br />
              어떤 곳이어야 할까요?
            </h2>

            <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
              {/* 강조 문장 */}
              <div className="reveal d2">
                <div
                  className="mb-6 h-[2px] w-10"
                  style={{ background: "#D01E2E" }}
                />
                <p
                  className="text-xl font-black leading-[1.55] md:text-2xl"
                  style={{ color: "#F5F4F1", wordBreak: "keep-all" }}
                >
                  단순히 땀만 빼고 돌아가는 복싱장이 아닙니다.
                  <br />
                  <br />
                  복싱을 처음 시작하는 분도
                  <br />
                  기본부터 제대로 배우고,
                  <br />
                  운동하는 동안 방치되지 않으며,
                  <br />
                  각자의 체력과 목적에 맞게
                  <br />
                  운동할 수 있는 공간을 만들고 있습니다.
                </p>
              </div>

              {/* 본문 */}
              <div className="reveal d3 space-y-6 text-sm leading-8 md:text-base md:leading-9"
                style={{ color: "#8A8D91" }}>
                <p>
                  시간표에 사람을 맞추는 대신 회원의 일정에 운동을 맞추고,
                  모두에게 같은 운동을 시키는 대신 한 사람씩 다른 진도를 지도합니다.
                </p>
                <p>
                  처음 배우는 기본자세부터 루틴이 끝난 뒤의 자유운동까지.
                  운동하러 온 시간이 아깝지 않도록 준비하는 것이
                  스트롱복싱이 생각하는 좋은 복싱장의 기준입니다.
                </p>
                <div
                  className="rounded-[14px] p-6"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#1A1A1C",
                  }}
                >
                  <p className="text-sm leading-7" style={{ color: "#F5F4F1" }}>
                    초보자·직장인·학생·다이어트 목적 모두 환영합니다.
                    <br />
                    어떤 이유로 시작해도, 각자의 출발점에서 시작합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 · FLEXIBLE SCHEDULE
        ════════════════════════════════════════ */}
        <section className="px-6 py-28 md:px-8" style={{ background: "#0E0E10" }}>
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>
              MY TIME, MY TRAINING
            </p>
            <h2
              className="reveal d1 mb-16 font-black leading-[0.88]"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.05em",
                wordBreak: "keep-all",
              }}
            >
              수업시간에
              <br />
              나를 맞추지 않습니다.
            </h2>

            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div className="reveal d2 space-y-5 text-sm leading-8 md:text-base md:leading-9"
                style={{ color: "#8A8D91" }}>
                <p>
                  스트롱복싱에는 정해진 단체 수업시간이 없습니다.
                </p>
                <p>
                  직장인은 퇴근 시간에 맞춰서, 학생은 학교와 학원 일정에 맞춰서,
                  운영시간 내 편한 시간에 방문하면 됩니다.
                </p>
                <p>
                  예약된 수업시간을 놓쳐 운동하지 못하는 방식이 아니라,
                  체육관에 도착하는 순간 각자의 운동이 시작됩니다.
                </p>
              </div>

              {/* 강조 카드 */}
              <div className="reveal d3">
                <div
                  className="flex h-full flex-col justify-center rounded-[20px] p-10"
                  style={{
                    border: "1px solid rgba(208,30,46,0.2)",
                    background: "#141416",
                  }}
                >
                  <p
                    className="mb-1 text-[10px] font-black tracking-[0.3em]"
                    style={{ color: "#D01E2E" }}
                  >
                    FLEXIBLE
                  </p>
                  <p
                    className="font-black leading-[1.3]"
                    style={{
                      fontSize: "clamp(24px, 3.5vw, 40px)",
                      letterSpacing: "-0.04em",
                      color: "#F5F4F1",
                      wordBreak: "keep-all",
                    }}
                  >
                    정해진 시간표 없이,
                    <br />
                    운영시간 내 자유롭게.
                  </p>
                  <div className="mt-6 space-y-3 text-sm" style={{ color: "#5A5C61" }}>
                    {[
                      "직장인 — 퇴근 후 편한 시간에",
                      "학생 — 수업·학원 일정에 맞춰",
                      "누구든 — 도착하는 순간 시작",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 · PERSONAL COACHING
        ════════════════════════════════════════ */}
        <section className="px-6 py-28 md:px-8"
          style={{ background: "#141416", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
              {/* 이미지 */}
              <div className="reveal group relative order-2 overflow-hidden lg:order-1"
                style={{ borderRadius: 20, minHeight: 400 }}>
                <img
                  src="/images/gallery/moments/story1.jpg"
                  alt="스트롱복싱 지도진의 개인별 복싱 코칭 장면"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  style={{ filter: "brightness(0.88)", minHeight: 400 }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(20,20,22,0.6) 0%, transparent 55%)",
                  }}
                />
              </div>

              {/* 텍스트 */}
              <div className="order-1 flex flex-col justify-center lg:order-2">
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]"
                  style={{ color: "#5A5C61" }}>
                  NO ONE LEFT BEHIND
                </p>
                <h2
                  className="reveal d1 mb-8 font-black leading-[0.9]"
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 60px)",
                    letterSpacing: "-0.05em",
                    wordBreak: "keep-all",
                  }}
                >
                  같이 운동해도,
                  <br />
                  코칭은 한 사람씩.
                </h2>

                <div className="reveal d2 space-y-5 text-sm leading-8 md:text-base md:leading-9"
                  style={{ color: "#8A8D91" }}>
                  <p>
                    같은 공간에서 함께 운동하더라도 배우는 내용과 운동 강도는
                    한 사람씩 다르게 진행됩니다.
                  </p>
                  <p>
                    선수 출신 지도진이 상주하며 자세와 거리, 타이밍, 힘 전달을 확인하고,
                    회원의 운동 경험과 체력에 맞춰 필요한 피드백을 이어갑니다.
                  </p>
                  <p>
                    줄넘기만 반복하다 돌아가거나, 혼자 샌드백만 치다 끝나는 운동이 아닙니다.
                    복싱을 처음 접하는 분도 기본부터 차근차근 배울 수 있도록 지도합니다.
                  </p>
                </div>

                <div
                  className="reveal d3 mt-8 inline-flex items-center gap-3 rounded-[10px] px-5 py-3.5"
                  style={{
                    border: "1px solid rgba(208,30,46,0.25)",
                    background: "rgba(208,30,46,0.06)",
                    color: "#D01E2E",
                    width: "fit-content",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#D01E2E" }} />
                  <span className="text-sm font-black">방치 없는 개인별 코칭</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 · 6-STEP SIGNATURE ROUTINE
        ════════════════════════════════════════ */}
        <section className="px-6 py-28 md:px-8" style={{ background: "#0E0E10" }}>
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]"
              style={{ color: "#5A5C61" }}>
              6-STEP SIGNATURE ROUTINE
            </p>
            <h2
              className="reveal d1 mb-4 font-black leading-[0.88]"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.05em",
                wordBreak: "keep-all",
              }}
            >
              한 번의 방문도
              <br />
              제대로 운동할 수 있도록.
            </h2>
            <p className="reveal d2 mb-16 max-w-lg text-sm leading-7 md:text-base"
              style={{ color: "#8A8D91" }}>
              매 방문마다 동일한 6단계 루틴이 진행됩니다.
              기초 체력부터 실전 타격, 마무리까지 하나의 완성된 운동 과정입니다.
            </p>

            {/* ── Desktop: horizontal flow ── */}
            <div className="hidden lg:block">
              {/* 연결선 + 도트 */}
              <div className="relative mb-8">
                <div
                  className="h-px w-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-between">
                  {routineSteps.map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full"
                      style={{
                        background:
                          i === 3 ? "#D01E2E" : "rgba(138,141,145,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                {routineSteps.map((step, i) => (
                  <div
                    key={step.num}
                    className={`reveal d${Math.min(i + 1, 5)} p-6 transition-all duration-300 hover:-translate-y-0.5`}
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${i === 3 ? "rgba(208,30,46,0.2)" : "rgba(255,255,255,0.07)"}`,
                      background: "#141416",
                    }}
                  >
                    <p
                      className="mb-6 text-xl font-black"
                      style={{ color: i === 3 ? "rgba(208,30,46,0.3)" : "#3A3A3E" }}
                    >
                      {step.num}
                    </p>
                    <p
                      className="mb-2 text-sm font-black leading-snug"
                      style={{ color: "#F5F4F1", wordBreak: "keep-all" }}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mobile: vertical flow ── */}
            <div className="space-y-3 lg:hidden">
              {routineSteps.map((step, i) => (
                <div
                  key={step.num}
                  className="flex items-start gap-5 p-5 transition-all"
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${i === 3 ? "rgba(208,30,46,0.18)" : "rgba(255,255,255,0.07)"}`,
                    background: "#141416",
                  }}
                >
                  <span
                    className="w-6 shrink-0 text-xs font-black"
                    style={{ color: "#D01E2E" }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <p
                      className="mb-1 text-sm font-black"
                      style={{ color: "#F5F4F1" }}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 6 · FREEDOM AFTER ROUTINE
        ════════════════════════════════════════ */}
        <section
          className="px-6 py-28 md:px-8"
          style={{
            background: "#141416",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]"
                  style={{ color: "#5A5C61" }}>
                  MORE THAN THE ROUTINE
                </p>
                <h2
                  className="reveal d1 mb-8 font-black leading-[0.88]"
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 60px)",
                    letterSpacing: "-0.05em",
                    wordBreak: "keep-all",
                  }}
                >
                  루틴이 끝나도,
                  <br />
                  내 운동은 계속됩니다.
                </h2>
                <div className="reveal d2 space-y-5 text-sm leading-8 md:text-base md:leading-9"
                  style={{ color: "#8A8D91" }}>
                  <p>
                    정해진 운동을 마친 뒤에는 그날 배운 자세와 스텝을 거울 앞에서
                    복습하거나, 샌드백 운동을 추가로 이어갈 수 있습니다.
                  </p>
                  <p>
                    각 지점에 마련된 운동기구를 활용해 부족한 체력과 근력을 더 채우는 것도
                    가능합니다.
                  </p>
                  <p>
                    복싱을 배우는 시간뿐만 아니라, 스스로 연습하고 운동을 완성할 수 있는
                    환경까지 준비합니다.
                  </p>
                </div>
              </div>

              {/* 시설 목록 */}
              <div className="reveal d2">
                <div
                  className="rounded-[20px] p-8"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#1A1A1C",
                  }}
                >
                  <p
                    className="mb-6 text-[10px] font-black tracking-[0.2em]"
                    style={{ color: "#5A5C61" }}
                  >
                    FACILITY EXAMPLES
                  </p>
                  <ul className="space-y-4">
                    {[
                      "샌드백과 미트 트레이닝 공간",
                      "복싱 전용 링",
                      "에어바이크",
                      "러닝머신",
                      "웨이트 및 체력운동 기구",
                      "거울을 활용한 자세 복습 공간",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-4 pb-4"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <span
                          className="h-1 w-4 shrink-0 rounded-full"
                          style={{ background: "#D01E2E" }}
                        />
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#F5F4F1" }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-xs leading-5" style={{ color: "#3A3A3E" }}>
                    ※ 운동기구 및 시설 구성은 지점별로 다를 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 7 · INBODY
        ════════════════════════════════════════ */}
        <section className="px-6 py-20 md:px-8" style={{ background: "#0E0E10" }}>
          <div className="mx-auto max-w-7xl">
            <div
              className="reveal relative overflow-hidden rounded-[24px] p-10 md:p-14"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#141416",
              }}
            >
              {/* 배경 장식 */}
              <div
                className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(208,30,46,0.06) 0%, transparent 65%)",
                }}
              />

              <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p
                    className="mb-4 text-[10px] font-black tracking-[0.3em]"
                    style={{ color: "#5A5C61" }}
                  >
                    TRACK YOUR CHANGE
                  </p>
                  <h2
                    className="mb-6 font-black leading-[0.9]"
                    style={{
                      fontSize: "clamp(30px, 4.5vw, 60px)",
                      letterSpacing: "-0.05em",
                      wordBreak: "keep-all",
                    }}
                  >
                    감으로만
                    <br />
                    운동하지 않도록.
                  </h2>
                  <p
                    className="mb-6 max-w-lg text-sm leading-7 md:text-base md:leading-8"
                    style={{ color: "#8A8D91" }}
                  >
                    스트롱복싱은 개봉·신정·목동·철산·영등포 전 지점에서 인바디 측정이 가능합니다.
                    현재 몸 상태를 확인하고, 운동을 통해 달라지는 과정을 수치로 비교하며
                    자신에게 필요한 운동 방향을 잡을 수 있습니다.
                  </p>
                  <div
                    className="inline-flex items-center gap-3 rounded-[10px] px-5 py-3"
                    style={{
                      border: "1px solid rgba(208,30,46,0.3)",
                      background: "rgba(208,30,46,0.07)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "#D01E2E" }}
                    />
                    <span
                      className="text-sm font-black"
                      style={{ color: "#D01E2E" }}
                    >
                      전 지점 인바디 측정 가능
                    </span>
                  </div>
                </div>

                {/* 지점 목록 */}
                <div
                  className="shrink-0 rounded-[16px] p-7"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#1A1A1C",
                    minWidth: 200,
                  }}
                >
                  <p
                    className="mb-4 text-[10px] font-black tracking-[0.2em]"
                    style={{ color: "#5A5C61" }}
                  >
                    5 BRANCHES
                  </p>
                  {["개봉점", "신정점", "목동점", "철산점", "영등포점"].map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-3 py-2.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="#D01E2E"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-bold" style={{ color: "#F5F4F1" }}>
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 8 · SAFE SPARRING
        ════════════════════════════════════════ */}
        <section
          className="px-6 py-28 md:px-8"
          style={{
            background: "#141416",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
              {/* 텍스트 */}
              <div>
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]"
                  style={{ color: "#5A5C61" }}>
                  SAFE, REAL BOXING
                </p>
                <h2
                  className="reveal d1 mb-8 font-black leading-[0.88]"
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 60px)",
                    letterSpacing: "-0.05em",
                    wordBreak: "keep-all",
                  }}
                >
                  실전의 재미는 살리고,
                  <br />
                  부상 걱정은 줄이고.
                </h2>
                <div className="reveal d2 space-y-5 text-sm leading-8 md:text-base md:leading-9"
                  style={{ color: "#8A8D91" }}>
                  <p>
                    스파링은 무조건 강하게 진행하지 않습니다.
                  </p>
                  <p>
                    회원의 실력과 경험에 맞춰 선수 출신 지도진이 직접 상대하며,
                    부담과 부상 걱정은 줄이고 실전 복싱의 재미를 안전하게 경험할 수 있도록
                    진행합니다.
                  </p>
                </div>
                <div className="reveal d3 mt-8 flex flex-col gap-3">
                  {[
                    "보호장비 착용 후 진행",
                    "회원 수준에 맞춘 강도 조절",
                    "선수 출신 지도진이 직접 상대",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-[10px] px-5 py-3.5"
                      style={{
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "#1A1A1C",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "#D01E2E" }}
                      />
                      <span className="text-sm font-bold" style={{ color: "#F5F4F1" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이미지 */}
              <div className="reveal group relative overflow-hidden"
                style={{ borderRadius: 20, minHeight: 360 }}>
                <img
                  src="/images/gallery/moments/story3.jpg"
                  alt="스트롱복싱 안전한 스파링 훈련 장면"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  style={{ filter: "brightness(0.85)", minHeight: 360 }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(20,20,22,0.5) 0%, transparent 55%)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 9 · WHO IT IS FOR
        ════════════════════════════════════════ */}
        <section className="px-6 py-28 md:px-8" style={{ background: "#0E0E10" }}>
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]"
              style={{ color: "#5A5C61" }}>
              START WHERE YOU ARE
            </p>
            <h2
              className="reveal d1 mb-14 font-black leading-[0.88]"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.05em",
                wordBreak: "keep-all",
              }}
            >
              어떤 이유로 시작해도
              <br />
              괜찮습니다.
            </h2>

            <div className="reveal d2 mb-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 p-5 reveal d${Math.min(i + 1, 5)} transition-all duration-300 hover:-translate-y-0.5`}
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#141416",
                  }}
                >
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "#D01E2E" }}
                  />
                  <span className="text-sm leading-6" style={{ color: "#F5F4F1", wordBreak: "keep-all" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* 마무리 문구 */}
            <div
              className="reveal rounded-[20px] px-10 py-10 text-center"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#141416",
              }}
            >
              <p
                className="text-base font-black leading-[1.8] md:text-lg"
                style={{ color: "#F5F4F1", wordBreak: "keep-all" }}
              >
                처음이라 자세를 하나도 몰라도 괜찮습니다.
                <br />
                아직 체력이 부족해도 괜찮습니다.
              </p>
              <p className="mt-3 text-sm leading-7" style={{ color: "#8A8D91" }}>
                각자의 시작점에 맞춰 운동을 시작합니다.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 10 · LOCATIONS
        ════════════════════════════════════════ */}
        <section
          id="locations"
          className="px-6 py-28 md:px-8"
          style={{
            background: "#141416",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            scrollMarginTop: "120px",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.3em]"
              style={{ color: "#5A5C61" }}>
              FIND YOUR STRONG
            </p>
            <h2
              className="reveal d1 mb-14 font-black leading-[0.88]"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.05em",
                wordBreak: "keep-all",
              }}
            >
              가까운 스트롱복싱에서
              <br />
              시작해보세요.
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b, i) => (
                <div
                  key={b.slug}
                  className={`reveal d${Math.min(i + 1, 5)} group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5`}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#1A1A1C",
                  }}
                >
                  {/* 지점 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={b.image}
                      alt={`스트롱복싱 ${b.name} 내부`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      style={{ filter: "brightness(0.8)" }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(26,26,28,0.7) 0%, transparent 55%)",
                      }}
                    />
                    <span
                      className="absolute bottom-4 left-4 text-xs font-black"
                      style={{ color: "#5A5C61" }}
                    >
                      {b.area}
                    </span>
                  </div>

                  {/* 지점 정보 */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="mb-1 text-lg font-black"
                      style={{ letterSpacing: "-0.03em", color: "#F5F4F1" }}
                    >
                      {b.name}
                    </h3>
                    <p className="mb-1 text-xs" style={{ color: "#5A5C61" }}>
                      {b.hours.join(" / ")}
                    </p>
                    <a
                      href={`tel:${b.phone.replace(/-/g, "")}`}
                      className="mb-5 text-xs transition-colors hover:text-white"
                      style={{ color: "#5A5C61" }}
                    >
                      {b.phone}
                    </a>

                    <div className="mt-auto flex gap-2">
                      <a
                        href={`/branches/${b.slug}`}
                        className="flex-1 rounded-[10px] py-2.5 text-center text-xs font-black transition-all duration-200 hover:bg-white/5"
                        style={{
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#8A8D91",
                        }}
                      >
                        지점 상세
                      </a>
                      {b.booking ? (
                        <a
                          href={b.booking}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-[10px] bg-[#D01E2E] py-2.5 text-center text-xs font-black text-white transition-colors hover:bg-[#B71C2B]"
                        >
                          상담 예약
                        </a>
                      ) : (
                        <a
                          href={`/branches/${b.slug}`}
                          className="flex-1 rounded-[10px] bg-[#D01E2E] py-2.5 text-center text-xs font-black text-white transition-colors hover:bg-[#B71C2B]"
                        >
                          지점 보기
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 11 · FINAL CTA
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden px-6 py-40 text-center md:px-8">
          <img
            src="/images/gallery/moments/story5.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.15) grayscale(0.3)" }}
          />
          <div
            className="pointer-events-none absolute left-0 top-0 h-[1px] w-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <p
              className="reveal mb-6 text-[10px] font-black tracking-[0.4em]"
              style={{ color: "#5A5C61" }}
            >
              STRONG BOXING
            </p>
            <h2
              className="reveal d1 mb-4 font-black leading-[0.88]"
              style={{
                fontSize: "clamp(40px, 7vw, 88px)",
                letterSpacing: "-0.05em",
                color: "#F5F4F1",
                wordBreak: "keep-all",
              }}
            >
              배우는 과정부터
              <br />
              운동하는 환경까지.
            </h2>
            <p
              className="reveal d2 mx-auto mb-3 max-w-md text-base leading-8"
              style={{ color: "#8A8D91" }}
            >
              복싱을 시작하는 순간부터 내 운동을 완성하는 시간까지 함께합니다.
            </p>
            <p
              className="reveal d3 mb-12 text-xs font-black tracking-[0.2em]"
              style={{ color: "#3A3A3E" }}
            >
              조용한 공간. 진짜 복싱. STRONG BOXING.
            </p>
            <div className="reveal d4 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/reservation"
                className="group inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D01E2E] px-10 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]"
              >
                원데이 클래스로 경험하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <ReservationButton
                className="group inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/[0.15] px-10 py-4 text-sm font-black text-[#F5F4F1] transition-all duration-300 hover:bg-white/5"
                location="about_final_cta"
              >
                방문 상담 예약하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </ReservationButton>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <footer
          className="px-6 py-16 md:px-8"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "#080809",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-center gap-2">
              <img
                src="/icon.png"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 object-contain opacity-60"
              />
              <div>
                <span className="text-base font-black" style={{ color: "#F5F4F1" }}>
                  STRONG
                </span>
                <span className="text-base font-black" style={{ color: "#3A3A3E" }}>
                  BOXING
                </span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {branches.map((b) => (
                <div key={b.slug}>
                  <a
                    href={`/branches/${b.slug}`}
                    className="mb-2 block text-xs font-black transition-colors duration-200 hover:text-[#F5F4F1]"
                    style={{ color: "#8A8D91" }}
                  >
                    {b.name}
                  </a>
                  <p className="text-xs leading-5" style={{ color: "#3A3A3E" }}>
                    {b.address}
                  </p>
                  <a
                    href={`tel:${b.phone.replace(/-/g, "")}`}
                    className="mt-1 block text-xs transition-colors duration-200 hover:text-[#8A8D91]"
                    style={{ color: "#5A5C61" }}
                  >
                    {b.phone}
                  </a>
                  <p className="text-xs" style={{ color: "#5A5C61" }}>
                    {b.hours.join(" / ")}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-10 pt-8 text-xs"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                color: "#3A3A3E",
              }}
            >
              © 2025 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      <FloatingCTA />
    </>
  );
}
