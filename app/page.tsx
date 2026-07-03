import BoxingCalculator from "./components/BoxingCalculator";
import { db } from "@/lib/db";
import ConsultationForm from "./components/ConsultationForm";
import ReservationButton from "./components/ReservationButton";
import AiCoachChat from "./components/AiCoachChat";
import FaqSection from "./components/FaqSection";
import ReelsSection from "./components/ReelsSection";
//import SplashScreen from "./components/SplashScreen";
import NaverReviewsSection from "./components/NaverReviewsSection";
import GallerySection from "./components/GallerySection";
import RevealObserver from "./components/RevealObserver";
import BranchMap from "./components/BranchMap";
import BranchHeroGrid from "./components/BranchHeroGrid";
import SiteHeader from "./components/SiteHeader";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "스트롱복싱 | 복싱 PT · 다이어트 복싱 · 체력증진",
  description:
    "서울 복싱장 스트롱복싱. 철산·개봉·목동·신정·영등포 5개 지점 운영. 초보자 환영, 복싱 PT, 다이어트 복싱, 체력증진 프로그램. 네이버 평점 4.9.",
  alternates: { canonical: "https://strongboxing.kr" },
  openGraph: {
    title: "스트롱복싱 | 복싱 PT · 다이어트 복싱 · 체력증진",
    description: "서울 5개 지점 운영 복싱짐. 초보자부터 다이어트, PT까지. 네이버 평점 4.9.",
    url: "https://strongboxing.kr",
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "스트롱복싱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "스트롱복싱 | 복싱 PT · 다이어트 복싱 · 체력증진",
    description: "서울 5개 지점 운영 복싱짐. 초보자부터 다이어트, PT까지.",
    images: ["/og.png"],
  },
};

const branches = [
  {
    slug: "gaebong",
    name: "개봉점",
    image: "/images/branches/gaebong.jpg",
    phone: "02-2060-1279",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    review: "초보자도 분위기 좋게 시작하기 좋은 지점",
    score: "4.9",
    reviewCount: 229,
    badges: ["초보자 환영", "구로구 복싱"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
  },
  {
    slug: "sinjeong",
    name: "신정점",
    image: "/images/branches/sinjeong.jpg",
    phone: "02-2647-3373",
    address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    hours: ["월-금 10:00~24:00", "토 10:00~16:00"],
    review: "운동 루틴 만들기 좋은 밸런스형 복싱짐",
    score: "4.9",
    reviewCount: 277,
    badges: ["여성 회원 다수", "양천구 복싱"],
    instagram: "https://www.instagram.com/strongboxing_sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
  },
  {
    slug: "mokdong",
    name: "목동점",
    image: "/images/branches/mokdong.png",
    phone: "02-2643-5971",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    review: "깔끔한 공간에서 다이어트 복싱 시작하기 좋음",
    score: "4.9",
    reviewCount: 106,
    badges: ["다이어트 복싱", "직장인 운동"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
  },
  {
    slug: "cheolsan",
    name: "철산점",
    image: "/images/branches/cheolsan.jpg",
    phone: "02-2066-0406",
    address: "경기도 광명시 철산동 56-14 3층",
    hours: ["월-금 14:00~23:00", "토일 14:00~18:00"],
    review: "네이버 리뷰 4.9",
    score: "4.9",
    reviewCount: 32,
    badges: ["광명 복싱"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "",
    naverMap: "",
  },
  {
    slug: "yeongdeungpo",
    name: "영등포점",
    image: "/images/branches/yeongdeungpo.jpg",
    phone: "02-831-9312",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    review: "퇴근 후 운동하기 좋은 도심형 복싱짐",
    score: "4.8",
    reviewCount: 77,
    badges: ["퇴근 후 운동", "영등포 복싱"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
  },
];

/* ─────────────────────────────────────────────
   Design tokens
   PRIMARY  #0E0E10
   SURFACE  #141416
   CARD     #1A1A1C
   BORDER   rgba(255,255,255,0.07)
   GRAY1    #8A8D91   (body text muted)
   GRAY2    #5A5C61   (very muted)
   WHITE    #F5F4F1
   RED      #D01E2E   (CTA only — ≤5%)
───────────────────────────────────────────── */

export default async function HomePage() {
  const [rows]: any = await db.query(`
    SELECT id, title, slug, description, branch_name, created_at, content
    FROM homepage_posts
    ORDER BY created_at DESC
    LIMIT 3
  `);
  const latestPosts = rows;

  return (
    <>
      {/*<SplashScreen />*/}
      <main style={{ background: "#0E0E10", color: "#F5F4F1" }} className="min-h-screen">
        <RevealObserver />

        <SiteHeader />

        {/* ══════════════════════════════════════
            HERO — 좌: 카피 / 우: 지점 Magazine Grid
        ══════════════════════════════════════ */}
        <section id="branches" className="relative overflow-hidden" style={{ background: "#0E0E10", scrollMarginTop: "120px" }}>
          {/* 배경 텍스처 — 아주 살짝 */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(255,255,255,0.015) 0%, transparent 70%)" }} />
          {/* 상단 레드 라인 */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full" style={{ background: "#D01E2E" }} />

          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <div className="grid min-h-screen items-center gap-12 py-28 lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:py-24">

              {/* ── 왼쪽: 카피 ── */}
              <div className="flex flex-col justify-center">
                <p className="mb-7 text-[10px] font-black tracking-[0.45em]" style={{ color: "#5A5C61" }}>
                  STRONG BOXING — 서울 · 경기 5개 지점
                </p>

                <h1 style={{ fontSize: "clamp(56px, 8.5vw, 120px)", lineHeight: 0.87, letterSpacing: "-0.05em", fontWeight: 900 }}>
                  <span style={{ color: "#F5F4F1" }}>STRONGER</span>
                  <br />
                  <span style={{ WebkitTextStroke: "1.5px #F5F4F1", WebkitTextFillColor: "transparent", color: "transparent" }}>
                    EVERY DAY
                  </span>
                </h1>

                <div className="my-7 h-[2px] w-14" style={{ background: "#D01E2E" }} />

                <p className="max-w-md text-sm leading-[2] md:text-base md:leading-[2.1]" style={{ color: "#C9C9C9", wordBreak: "keep-all" }}>
                  처음이어도 괜찮습니다.<br />
                  정해진 단체 수업이 아니라,{" "}
                  <span style={{ color: "#F5F4F1", fontWeight: 700 }}>회원님의 목적과 실력에 맞춰</span>{" "}
                  지도합니다.<br />
                  기초부터 미트, 샌드백, 체력운동까지{" "}
                  차근차근 맞춰나갑니다.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <ReservationButton className="group rounded-[10px] bg-[#D01E2E] px-7 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                    지점 상담/예약
                    <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </ReservationButton>
                  <a
                    href="#program"
                    className="group inline-flex items-center gap-2 rounded-[10px] px-7 py-3.5 text-sm font-black transition-all duration-300 hover:bg-white/6"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}
                  >
                    프로그램 보기
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>

                {/* 스탯 */}
                <div className="mt-14 flex gap-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
                  {[["4.9", "평균 리뷰 평점"], ["5", "운영 지점"], ["100%", "초보자 환영"]].map(([n, t]) => (
                    <div key={n}>
                      <p className="text-2xl font-black" style={{ color: "#F5F4F1" }}>{n}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: "#3A3A3E" }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 오른쪽: Magazine 지점 그리드 ── */}
              <BranchHeroGrid branches={branches} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURE STRIP (아이콘 4개)
        ══════════════════════════════════════ */}
        <div style={{ background: "#141416", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-6 md:grid-cols-4">
            {[
              ["전문 코칭", "경험 많은 관장·코치의 체계적인 지도"],
              ["체력 & 기술 향상", "기술 향상은 물론 체력과 자신감까지"],
              ["다이어트 효과", "전신 운동으로 효과적인 체지방 감량"],
              ["초보자 환영", "복싱이 처음이어도 걱정 없이 시작"],
            ].map(([title, desc], i) => (
              <div
                key={title}
                className="px-8 py-7"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <p className="mb-1.5 text-sm font-black" style={{ color: "#F5F4F1" }}>{title}</p>
                <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>


        {/* ══════════════════════════════════════
            HOW WE TRAIN
        ══════════════════════════════════════ */}
        <section id="programs" className="px-6 py-32 md:px-8" style={{ background: "#141416", scrollMarginTop: "120px" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>HOW WE TRAIN</p>
              <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                정해진 수업 시간이<br />없습니다
              </h2>
              <p className="reveal d2 mt-6 max-w-lg text-base leading-8" style={{ color: "#8A8D91" }}>
                운영시간 내 편하신 시간에 방문하시면 바로 운동을 시작할 수 있어요.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col p-8" style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                <p className="mb-3 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>MY SCHEDULE</p>
                <h3 className="mb-4 text-2xl font-black" style={{ letterSpacing: "-0.04em" }}>내 시간에 맞게</h3>
                <p className="mb-6 leading-8 text-sm" style={{ color: "#8A8D91" }}>
                  수업 예약 없이, 운영시간 내 언제든 방문하면 바로 운동 시작.
                  직장인, 주부, 학생 모두 가능합니다.
                </p>
                <div className="mb-6 space-y-3">
                  {[
                    ["방문", "예약 없이 운영시간 내 자유 방문"],
                    ["개인별", "개인 수준·목표에 맞춘 운동 진행"],
                    ["유연", "1개월 단위 등록, 중단 부담 없음"],
                  ].map(([label, desc]) => (
                    <div key={label} className="flex items-start gap-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="mt-0.5 shrink-0 text-[10px] font-black" style={{ color: "#D01E2E" }}>●</span>
                      <div>
                        <span className="text-sm font-bold" style={{ color: "#F5F4F1" }}>{label}</span>
                        <span className="ml-2 text-xs" style={{ color: "#5A5C61" }}>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <span className="rounded-[10px] px-3 py-1.5 text-xs font-bold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>BEGINNER FRIENDLY</span>
                  <span className="rounded-[10px] px-3 py-1.5 text-xs font-bold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>개인별 진행</span>
                  <span className="rounded-[10px] px-3 py-1.5 text-xs font-bold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>자유 방문</span>
                </div>
              </div>

              <div className="p-8" style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                <p className="mb-3 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>1 SESSION</p>
                <h3 className="mb-6 text-2xl font-black" style={{ letterSpacing: "-0.04em" }}>1회 운동 구성</h3>
                <div className="space-y-3">
                  {[
                    ["01", "몸풀기", "스트레칭 & 워밍업"],
                    ["02", "줄넘기 3R", "기초 체력 훈련"],
                    ["03", "기초자세 & 스텝", "복싱 기본기"],
                    ["04", "미트트레이닝", "코치와 1:1 실전"],
                    ["05", "샌드백", "파워 & 지구력"],
                    ["06", "체력운동", "코어 마무리"],
                  ].map(([num, step, desc], i) => (
                    <div key={step} className="flex items-center gap-4 pb-3" style={{ borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <span className="w-5 shrink-0 text-[10px] font-black" style={{ color: "#5A5C61" }}>{num}</span>
                      <span className="text-sm font-bold" style={{ color: "#F5F4F1" }}>{step}</span>
                      <span className="ml-auto text-xs" style={{ color: "#5A5C61" }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center justify-between gap-4 p-7 sm:flex-row"
              style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
              <p className="font-black text-lg" style={{ color: "#F5F4F1" }}>운영시간 내 언제든 시작 가능!</p>
              <a href="/#branch"
                className="group inline-flex items-center gap-2 shrink-0 rounded-[10px] px-6 py-3 text-sm font-black transition-all duration-300 hover:bg-white/6"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#F5F4F1" }}>
                지점 운영시간 확인
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            코치 소개
        ══════════════════════════════════════ */}
        <section id="coaches" className="px-6 py-32 md:px-8" style={{ scrollMarginTop: "120px" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>COACH</p>
              <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                직접 가르치는<br />전문 코치진.
              </h2>
            </div>

            {/* 대표 카드 — red border 강조 */}
            <a
              href="https://www.instagram.com/strongboxing_official"
              target="_blank" rel="noopener noreferrer"
              className="group mb-4 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 md:flex-row"
              style={{
                borderRadius: 16,
                border: "1px solid rgba(208,30,46,0.45)",
                boxShadow: "0 0 0 1px rgba(208,30,46,0.08)",
                background: "#141416",
              }}
            >
              <div className="h-60 w-full shrink-0 overflow-hidden md:h-auto md:w-72">
                <img
                  src="/images/coaches/hansol.jpg"
                  alt="한솔 대표"
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  style={{ filter: "grayscale(0.1)" }}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-3 p-10">
                <div className="flex items-center gap-2">
                  <span className="rounded-[6px] px-2 py-0.5 text-[10px] font-black" style={{ border: "1px solid rgba(208,30,46,0.35)", color: "#D01E2E" }}>DIRECTOR</span>
                </div>
                <h3 className="font-black" style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.04em", color: "#F5F4F1" }}>한솔 대표</h3>
                <p className="text-sm" style={{ color: "#8A8D91" }}>스트롱복싱 대표 · 전 지점 총괄</p>
              </div>
            </a>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { branch: "개봉점", name: "안진호", role: "관장", instagram: "dkswkd3" },
                { branch: "신정점", name: "유상혁", role: "관장", instagram: "robuste_hyeok" },
                { branch: "신정점", name: "정동주", role: "코치", instagram: "jdj_00_" },
                { branch: "목동점", name: "송재용", role: "관장", instagram: "nan_yong_" },
                { branch: "목동점", name: "양승호", role: "코치", instagram: "qortor0_0" },
                { branch: "철산점", name: "안도연", role: "코치", instagram: "strongboxing_andy" },
              ].map((coach) => (
                <a key={coach.name}
                  href={`https://www.instagram.com/${coach.instagram}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-6 rounded-[14px] border border-[rgba(74,76,80,0.3)] bg-[#141416] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(138,141,145,0.45)] hover:bg-[rgba(74,76,80,0.08)]"
                >
                  <p className="mb-1 text-[10px] font-black tracking-[0.2em]" style={{ color: "#5A5C61" }}>{coach.branch}</p>
                  <h3 className="mb-1 text-lg font-black" style={{ letterSpacing: "-0.03em", color: "#F5F4F1" }}>
                    {coach.name} {coach.role}
                  </h3>
                  <p className="text-xs" style={{ color: "#5A5C61" }}>@{coach.instagram}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div id="clips" style={{ scrollMarginTop: "120px" }}>
          <ReelsSection />
        </div>

        <div id="reviews" style={{ scrollMarginTop: "120px" }}>
          <NaverReviewsSection />
        </div>

        <section id="calculator" style={{ background: "#0E0E10" }}>
          <BoxingCalculator />
        </section>

        {/* ══════════════════════════════════════
            FIRST VISIT
        ══════════════════════════════════════ */}
        <section className="px-6 py-32 md:px-8" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>FIRST VISIT</p>
              <h2 className="reveal d1 font-black" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.05em" }}>
                처음 오면 어떻게 되나요?
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["01", "방문 상담 예약", "홈페이지나 네이버로 간단히 예약"],
                ["02", "체육관 방문", "편한 복장으로 방문하시면 돼요"],
                ["03", "코치와 1:1 상담", "목적·체력·일정 맞춤 안내"],
                ["04", "바로 운동 시작", "당일 체험도 가능합니다"],
              ].map(([step, title, desc]) => (
                <div key={step} className="p-7"
                  style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                  <p className="mb-6 text-2xl font-black" style={{ color: "#2A2A2E" }}>{step}</p>
                  <h3 className="mb-2 text-base font-black" style={{ color: "#F5F4F1" }}>{title}</h3>
                  <p className="text-sm leading-6" style={{ color: "#8A8D91" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROGRAM
        ══════════════════════════════════════ */}
        <section id="program" className="px-6 py-32 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>PROGRAM</p>
                <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                  복싱은 어렵지 않게,<br />운동은 확실하게.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7" style={{ color: "#8A8D91" }}>
                처음 배우는 자세부터 다이어트, 체력향상, 스트레스 해소까지 목적에 맞는 수업으로 진행합니다.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["01", "복싱 입문", "기본자세, 스텝, 펀치부터 차근차근"],
                ["02", "다이어트 복싱", "재밌게 땀나는 그룹 복싱 수업"],
                ["03", "코치 직접 지도", "목적에 맞춘 밀착 트레이닝"],
              ].map(([num, title, desc]) => (
                <div key={num} className="group p-10 transition-transform hover:-translate-y-1"
                  style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                  <p className="mb-12 text-xs font-black" style={{ color: "#3A3A3E" }}>{num}</p>
                  <h3 className="mb-3 text-2xl font-black" style={{ letterSpacing: "-0.04em", color: "#F5F4F1" }}>{title}</h3>
                  <p className="text-sm leading-7" style={{ color: "#8A8D91" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqSection />

        {/* ══════════════════════════════════════
            SPACE GALLERY
        ══════════════════════════════════════ */}
        <section className="px-6 py-32 md:px-8" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>STRONG SPACE</p>
              <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                사진으로 먼저 보는<br />스트롱복싱의 공간.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="overflow-hidden" style={{ borderRadius: 14 }}>
                <img src="/images/gallery/gallery-1.jpg" alt="시설"
                  className="h-full min-h-[500px] w-full object-cover transition duration-700 hover:scale-105"
                  style={{ filter: "brightness(0.85)" }} />
              </div>
              <div className="grid gap-3">
                <div className="overflow-hidden" style={{ borderRadius: 14 }}>
                  <img src="/images/gallery/gallery-2.jpg" alt="시설"
                    className="h-[240px] w-full object-cover transition duration-700 hover:scale-105"
                    style={{ filter: "brightness(0.85)" }} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="overflow-hidden" style={{ borderRadius: 14 }}>
                    <img src="/images/gallery/gallery-3.jpg" alt="시설"
                      className="h-[240px] w-full object-cover" style={{ filter: "brightness(0.85)" }} />
                  </div>
                  <div className="overflow-hidden" style={{ borderRadius: 14 }}>
                    <img src="/images/gallery/gallery-4.jpg" alt="시설"
                      className="h-[240px] w-full object-cover" style={{ filter: "brightness(0.85)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA — 풀스크린
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden px-6 py-40 text-center md:px-8">
          <img src="/images/gallery/gallery-1.jpg" alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.18) grayscale(0.3)" }} />
          <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full" style={{ background: "rgba(255,255,255,0.08)" }} />

          <div className="relative z-10 mx-auto max-w-4xl">
            <p className="reveal mb-6 text-xs font-black tracking-[0.4em]" style={{ color: "#5A5C61" }}>STRONG BOXING</p>
            <h2 className="reveal d1 font-black leading-[0.88]"
              style={{ fontSize: "clamp(44px, 8vw, 96px)", letterSpacing: "-0.05em", color: "#F5F4F1" }}>
              스트롱복싱에서<br />첫 운동을 시작해보세요.
            </h2>
            <p className="reveal d2 mx-auto mt-8 max-w-lg text-base leading-8" style={{ color: "#8A8D91" }}>
              가까운 지점에서 편하게 상담받고 운동을 시작해보세요.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <ReservationButton className="group rounded-[10px] bg-[#D01E2E] px-10 py-5 text-base font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                방문 상담 예약하기
                <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </ReservationButton>
              <a href="/blog"
                className="group inline-flex items-center gap-2 rounded-[10px] px-10 py-5 text-base font-black transition-all duration-300 hover:bg-white/6"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#F5F4F1" }}>
                운동 후기 보기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            NEWS & REVIEW
        ══════════════════════════════════════ */}
        <section id="news" className="relative overflow-hidden px-6 py-32 md:px-8">
          {/* 배경 체육관 이미지 */}
          <img
            src="/images/gallery/gallery-1.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.2) grayscale(0.3)" }}
          />
          {/* 오버레이 — 상단/하단 진하게, 중앙 살짝 열기 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(14,14,16,0.72) 0%, rgba(14,14,16,0.48) 40%, rgba(14,14,16,0.72) 100%)" }}
          />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>NEWS & REVIEW</p>
                <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                  지점별 소식과 후기.
                </h2>
              </div>
              <a href="/blog" className="text-sm font-black transition hover:opacity-60" style={{ color: "#8A8D91" }}>
                전체 글 보기 →
              </a>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-3">
                {latestPosts.map((post: any) => {
                  const thumb = (() => {
                    const s = String(post.content || "");
                    const html = s.match(/<img[^>]+src=["']([^"']+)["']/i);
                    if (html?.[1]) return html[1];
                    const md = s.match(/!\[.*?\]\((.*?)\)/);
                    return md?.[1] || null;
                  })();
                  return (
                  <a key={post.id} href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
                    style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                    {thumb && (
                      <div className="h-[160px] overflow-hidden">
                        <img src={thumb} alt={post.title}
                          className="h-full w-full object-cover object-[center_25%] transition duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-[10px] px-2.5 py-1 text-[10px] font-black"
                          style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8A8D91" }}>
                          {post.branch_name}
                        </span>
                        <span className="text-xs" style={{ color: "#3A3A3E" }}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="mb-2 flex-1 text-lg font-black leading-tight" style={{ letterSpacing: "-0.04em", color: "#F5F4F1" }}>
                        {post.title}
                      </h3>
                      <p className="line-clamp-1 text-sm leading-6" style={{ color: "#8A8D91" }}>
                        {post.description}
                      </p>
                      <p className="mt-4 text-xs font-bold" style={{ color: "#5A5C61" }}>읽기 →</p>
                    </div>
                  </a>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center"
                style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                <h3 className="mb-3 text-xl font-black" style={{ color: "#F5F4F1" }}>소식 준비중</h3>
                <p className="text-sm" style={{ color: "#8A8D91" }}>곧 지점별 운동 소식과 후기를 업데이트할 예정입니다.</p>
              </div>
            )}
          </div>
        </section>
        {/* /NEWS & REVIEW */}

        {/* SEO sr-only */}
        <section className="sr-only">
          <h2>스트롱복싱 지점별 복싱장 안내</h2>
          <p>
            스트롱복싱은 개봉점, 신정점, 목동점, 철산점, 영등포점으로 운영되는 복싱 체육관입니다.
            개봉 복싱, 개봉동 복싱, 구로 복싱, 신정 복싱, 신정동 복싱, 양천구 복싱,
            목동 복싱, 목동 복싱장, 철산 복싱, 철산동 복싱, 광명 복싱,
            영등포 복싱, 영등포구 복싱을 찾는 분들이 방문하고 있습니다.
          </p>
          <p>
            초보자 복싱, 여성 복싱, 다이어트 복싱, 직장인 운동, 학생 운동,
            키즈 복싱, 어린이 복싱, 체력 향상 운동, 스트레스 해소 운동을
            목적에 맞게 시작할 수 있습니다.
          </p>
          <h3>개봉점</h3>
          <p>서울 구로구 개봉동 166-5 유원빌딩 지하 1층. 개봉 복싱, 개봉동 복싱장, 구로 복싱, 개봉 다이어트 복싱. 운영시간 월요일부터 금요일 13시부터 23시까지. 전화번호 02-2060-1279.</p>
          <h3>신정점</h3>
          <p>서울 양천구 신정동 1021-7 태화상가 2층. 신정 복싱, 신정동 복싱장, 양천구 복싱, 신정 다이어트 복싱. 운영시간 평일 10시부터 24시까지, 토요일 10시부터 16시까지. 전화번호 02-2647-3373.</p>
          <h3>목동점</h3>
          <p>서울 양천구 목동 909-6 우방빌딩 4층. 목동 복싱, 목동 복싱장, 양천구 복싱, 목동 다이어트 복싱, 목동 여성 복싱, 목동 직장인 운동. 운영시간 평일 14시부터 24시까지, 토요일 11시부터 16시까지. 전화번호 02-2643-5971.</p>
          <h3>철산점</h3>
          <p>경기도 광명시 철산동 56-14 3층. 철산 복싱, 철산동 복싱장, 광명 복싱, 광명 다이어트 복싱, 철산역 복싱, 철산 여성 복싱. 운영시간 평일 14시부터 23시까지, 토요일과 일요일 14시부터 18시까지. 전화번호 02-2066-0406.</p>
          <h3>영등포점</h3>
          <p>서울 영등포구 도림로 313 건영상가 2층. 영등포 복싱, 영등포구 복싱장, 영등포 다이어트 복싱, 영등포 직장인 운동, 도림동 복싱. 운영시간 평일 13시부터 23시까지. 전화번호 02-831-9312.</p>
          <h2>스트롱복싱 운동 영상</h2>
          <p>스트롱복싱 운동 영상은 철산 복싱, 광명 복싱, 목동 복싱, 신정동 복싱, 개봉동 복싱, 영등포 복싱, 여성 복싱, 초보자 복싱, 다이어트 복싱, 체력 향상 운동 모습을 담고 있습니다.</p>
        </section>

        <BranchMap />

        <GallerySection />

        {/* ══════════════════════════════════════
            공인 단체
        ══════════════════════════════════════ */}
        <section className="px-6 py-24 md:px-8" style={{ background: "#0E0E10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>CERTIFIED GYM</p>
              <h2 className="font-black" style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.04em", color: "#F5F4F1" }}>
                프로복싱 4개 단체 가입 체육관
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs" style={{ color: "#5A5C61" }}>
                <span>✔ 프로테스트 참가 가능</span>
                <span>✔ 각종 대회 참가 가능</span>
                <span>✔ 선수 등록 및 활동 가능</span>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { src: "/images/boxing-orgs/kbf.jpg", name: "KBF", full: "한국권투연맹" },
                { src: "/images/boxing-orgs/kbm.jpg", name: "KBM", full: "한국복싱커미션" },
                { src: "/images/boxing-orgs/kbc.jpg", name: "KBC", full: "한국권투위원회" },
                { src: "/images/boxing-orgs/kba.jpg", name: "KBA", full: "한국권투협회" },
              ].map((org) => (
                <div key={org.name} className="flex flex-col items-center gap-3 p-6"
                  style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                  <img src={org.src} alt={org.full} className="h-16 w-16 rounded-full object-cover" />
                  <div className="text-center">
                    <p className="text-base font-black" style={{ color: "#F5F4F1" }}>{org.name}</p>
                    <p className="text-xs" style={{ color: "#5A5C61" }}>{org.full}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6 overflow-hidden p-8 md:flex-row md:justify-between"
              style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
              <div className="flex items-center gap-5">
                <img src="/images/boxing-orgs/kaba.jpg" alt="대한생활체육복싱협회" className="h-16 w-16 object-contain" />
                <div>
                  <p className="text-[10px]" style={{ color: "#5A5C61" }}>KOREA AMATEUR BOXING ASSOCIATION</p>
                  <p className="text-lg font-black" style={{ color: "#F5F4F1" }}>대한생활체육복싱협회</p>
                </div>
              </div>
              <span className="rounded-[10px] px-4 py-2 text-sm font-black"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>
                승단 심사 체육관
              </span>
              <div className="flex flex-col gap-1.5 text-xs" style={{ color: "#8A8D91" }}>
                <span>✔ 체육관 자체 승단 심사 가능</span>
                <span>✔ 공인 단증 취득 가능</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            가격 안내
        ══════════════════════════════════════ */}
        <section className="px-6 py-16 md:px-8" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-8 p-10 text-center md:flex-row md:text-left"
              style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
              <div className="flex-1">
                <p className="mb-3 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>PRICING</p>
                <h2 className="mb-3 text-2xl font-black" style={{ letterSpacing: "-0.04em", color: "#F5F4F1" }}>수강료가 궁금하신가요?</h2>
                <p className="text-sm leading-7" style={{ color: "#8A8D91" }}>
                  수강료는 지점별·프로그램별로 다르게 운영됩니다.<br />
                  방문 상담 시 목적에 맞는 플랜을 안내해드립니다.
                </p>
              </div>
              <a href="/reservation"
                className="group inline-flex items-center gap-2 shrink-0 rounded-[10px] bg-[#D01E2E] px-8 py-4 font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                상담 예약하고 문의하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        <div id="contact" style={{ scrollMarginTop: "120px" }}>
          <ConsultationForm />
        </div>

        <AiCoachChat />

        {/* ══════════════════════════════════════
            FOOTER
        ══════════════════════════════════════ */}
        <footer className="px-6 py-16 md:px-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#080809" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-center gap-2">
              <img src="/icon.png" alt="" className="h-6 w-6 object-contain opacity-60" />
              <div>
                <span className="text-base font-black" style={{ color: "#F5F4F1" }}>STRONG</span>
                <span className="text-base font-black" style={{ color: "#3A3A3E" }}>BOXING</span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {branches.map((b) => (
                <div key={b.slug}>
                  <p className="mb-2 text-xs font-black" style={{ color: "#8A8D91" }}>{b.name}</p>
                  <p className="text-xs leading-5" style={{ color: "#3A3A3E" }}>{b.address}</p>
                  <p className="mt-1 text-xs" style={{ color: "#5A5C61" }}>{b.phone}</p>
                  <p className="text-xs" style={{ color: "#2A2A2E" }}>{b.hours.join(" / ")}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#2A2A2E" }}>
              © 2025 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
