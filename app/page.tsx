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
import NewsReviewClient from "./components/NewsReviewClient";
import FloatingCTA from "./components/FloatingCTA";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "스트롱복싱 | 관장 직접 지도 · 초보자 환영 · 목동 개봉 철산 영등포 복싱",
  description:
    "관장이 직접 가르치는 스트롱복싱. 목동·오목교·개봉·고척·오류동·구로·철산·광명·철산역·신정·영등포 5개 지점. 초보자 환영, 여성·학생·직장인 복싱, 다이어트 복싱. 원데이 클래스 30,000원.",
  keywords: [
    "목동 복싱","오목교 복싱","양천구 복싱","목동 학생 복싱","목동 다이어트 복싱","목동 직장인 운동",
    "개봉 복싱","개봉동 복싱","고척 복싱","오류동 복싱","구로 복싱","구로구 복싱","개봉 여성 복싱","개봉 초보 복싱",
    "철산 복싱","철산동 복싱","광명 복싱","철산역 복싱","광명 여성 복싱","철산 직장인 복싱",
    "신정 복싱","신정동 복싱","영등포 복싱","관장 직접 지도","초보자 복싱","여성 복싱","다이어트 복싱","스트레스 해소 복싱",
  ],
  alternates: { canonical: "https://strongboxing.kr" },
  openGraph: {
    title: "스트롱복싱 | 관장 직접 지도 · 목동 개봉 철산 영등포 복싱",
    description: "관장이 직접 가르치는 복싱장. 목동·개봉·고척·철산·광명·신정·영등포 5개 지점. 초보자 환영, 원데이 클래스 30,000원.",
    url: "https://strongboxing.kr",
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "스트롱복싱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "스트롱복싱 | 관장 직접 지도 · 목동 개봉 철산 영등포 복싱",
    description: "관장이 직접 가르치는 복싱장. 목동·개봉·고척·철산·광명·신정·영등포. 초보자 환영.",
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
    review: "관장 직접 지도 · 고척동에서도 가까운 개봉동 복싱장",
    score: "4.9",
    reviewCount: 229,
    badges: ["관장 직접 지도", "개봉동 · 고척동 복싱"],
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
    review: "초보자 · 다이어트 · 꾸준히 다니기 좋은 신정동 복싱장",
    score: "4.9",
    reviewCount: 277,
    badges: ["초보자 · 다이어트", "양천구 · 신정동 복싱"],
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
    review: "학생 · 키즈 · 방학특강 · 목동 복싱장",
    score: "4.9",
    reviewCount: 106,
    badges: ["학생 · 키즈 복싱", "방학특강 · 목동 복싱"],
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
    review: "직장인 · 여성 · 퇴근 후 운동하기 좋은 광명 복싱장",
    score: "4.9",
    reviewCount: 32,
    badges: ["직장인 · 여성 환영", "철산 · 광명 복싱"],
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
    review: "학생 · 초보자 · 직장인 복싱 · 영등포 복싱장",
    score: "4.8",
    reviewCount: 77,
    badges: ["학생 · 직장인 복싱", "영등포 복싱"],
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
          {/* 배경 텍스처 — 도트 그리드 */}
          <div className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
          {/* 배경 그라디언트 — 왼쪽 빛 */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 55% at 28% 50%, rgba(255,255,255,0.012) 0%, transparent 65%)" }} />
          {/* 상단 레드 라인 */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full" style={{ background: "#D01E2E" }} />

          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <div className="grid min-h-[92vh] items-center gap-12 py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:py-16">

              {/* ── 왼쪽: 카피 ── */}
              <div className="flex flex-col justify-center">
                <p className="mb-7 text-[10px] font-black tracking-[0.45em]" style={{ color: "#8A8D91" }}>
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
                  <span style={{ color: "#F5F4F1", fontWeight: 700 }}>관장이 기본기부터 직접 잡아드립니다.</span><br />
                  체력이나 운동 경험 없어도 — 오늘 바로 시작할 수 있어요.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <ReservationButton className="btn-primary group rounded-[10px] bg-[#D01E2E] px-7 py-3.5 text-sm font-black text-white hover:bg-[#B71C2B]">
                    원데이 클래스 예약하기
                    <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </ReservationButton>
                  <a
                    href="#branch"
                    className="group inline-flex items-center gap-2 rounded-[10px] px-7 py-3.5 text-sm font-black transition-all duration-300 hover:bg-white/6"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}
                  >
                    가까운 지점 보기
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>

                <p className="mt-4 text-xs leading-5" style={{ color: "#5A5C61" }}>
                  원데이 클래스 <span style={{ color: "#8A8D91", fontWeight: 700 }}>30,000원</span> 현장결제
                  &nbsp;·&nbsp; 당일 등록 시 회원권에서 <span style={{ color: "#8A8D91", fontWeight: 700 }}>전액 페이백</span>
                </p>

                {/* 스탯 */}
                <div className="mt-14 flex gap-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
                  {[["4.9", "평균 리뷰 평점"], ["5", "운영 지점"], ["100%", "초보자 환영"]].map(([n, t]) => (
                    <div key={n}>
                      <p className="text-2xl font-black" style={{ color: "#F5F4F1" }}>{n}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: "#5A5C61" }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 오른쪽: Magazine 지점 그리드 ── */}
              <BranchHeroGrid branches={branches} />
            </div>
          </div>

          {/* 스크롤 유도 */}
          <div className="pointer-events-none absolute bottom-7 left-0 right-0 hidden justify-center lg:flex">
            <div className="flex animate-bounce flex-col items-center gap-1" style={{ color: "#3A3A3E" }}>
              <span className="text-[9px] font-black tracking-[0.35em]">SCROLL</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v8M2 6.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURE STRIP
        ══════════════════════════════════════ */}
        <div style={{ background: "#141416", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-6 md:grid-cols-4">

            <div className="reveal px-8 py-8 transition-all duration-300 hover:bg-white/[0.02]"
              style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="mb-4" style={{ color: "#D01E2E" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="11" cy="7" r="4"/>
                </svg>
              </div>
              <p className="mb-1.5 text-sm font-black" style={{ color: "#F5F4F1" }}>관장 직접 지도</p>
              <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>관장·코치가 개인 진도에 맞춰 직접 지도</p>
            </div>

            <div className="reveal d1 px-8 py-8 transition-all duration-300 hover:bg-white/[0.02]"
              style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="mb-4" style={{ color: "#D01E2E" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 7 12.5 14.5 7.5 9.5 1 16"/><polyline points="15 7 20 7 20 12"/>
                </svg>
              </div>
              <p className="mb-1.5 text-sm font-black" style={{ color: "#F5F4F1" }}>기본기부터 차근차근</p>
              <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>자세, 스텝, 미트, 샌드백까지 단계적으로</p>
            </div>

            <div className="reveal d2 px-8 py-8 transition-all duration-300 hover:bg-white/[0.02]"
              style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="mb-4" style={{ color: "#D01E2E" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 13 11 13 10 21 20 10 11 10 12 2"/>
                </svg>
              </div>
              <p className="mb-1.5 text-sm font-black" style={{ color: "#F5F4F1" }}>다이어트 &amp; 체력</p>
              <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>전신 운동으로 체지방 감량과 체력증진 동시에</p>
            </div>

            <div className="reveal d3 px-8 py-8 transition-all duration-300 hover:bg-white/[0.02]">
              <div className="mb-4" style={{ color: "#D01E2E" }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 10v1a8 8 0 1 1-4.88-7.31"/><polyline points="19 4 10 13 7 10"/>
                </svg>
              </div>
              <p className="mb-1.5 text-sm font-black" style={{ color: "#F5F4F1" }}>초보자 환영</p>
              <p className="text-xs leading-5" style={{ color: "#5A5C61" }}>운동이 처음이어도 기본기부터 편하게 시작</p>
            </div>

          </div>
        </div>


        <div id="reviews" style={{ scrollMarginTop: "120px" }}>
          <NaverReviewsSection />
        </div>

        {/* ══════════════════════════════════════
            HOW WE TRAIN
        ══════════════════════════════════════ */}
        <section id="programs" className="px-6 py-24 md:px-8" style={{ background: "#141416", scrollMarginTop: "120px" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>HOW WE TRAIN</p>
              <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                관장이 직접<br />가르칩니다
              </h2>
              <p className="reveal d2 mt-6 max-w-lg text-base leading-8" style={{ color: "#8A8D91" }}>
                정해진 단체 수업이 아닙니다. 운영시간 내 언제든 방문하면 관장·코치가 개인 진도에 맞춰 직접 지도합니다.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col p-8 transition-all duration-300 hover:-translate-y-0.5" style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                <p className="mb-3 text-[10px] font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>MY SCHEDULE</p>
                <h3 className="mb-4 text-2xl font-black" style={{ letterSpacing: "-0.04em" }}>내 시간에 맞게</h3>
                <p className="mb-6 leading-8 text-sm" style={{ color: "#8A8D91" }}>
                  예약 없이 운영시간 내 방문하면 바로 시작할 수 있어요.
                  직장인, 주부, 학생, 처음 운동하는 분 모두 가능합니다.
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

              <div className="p-8 transition-all duration-300 hover:-translate-y-0.5" style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
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
              <div>
                <p className="font-black text-lg" style={{ color: "#F5F4F1" }}>원데이 클래스로 먼저 경험해보세요.</p>
                <p className="mt-1 text-xs" style={{ color: "#5A5C61" }}>30,000원 현장결제 · 당일 등록 시 회원권에서 전액 차감</p>
              </div>
              <a href="/reservation"
                className="group inline-flex items-center gap-2 shrink-0 rounded-[10px] bg-[#D01E2E] px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                원데이 클래스 예약하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            코치 소개
        ══════════════════════════════════════ */}
        <section id="coaches" className="px-6 py-24 md:px-8" style={{ scrollMarginTop: "120px" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>COACH</p>
              <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                직접 가르치는<br />전문 코치진.
              </h2>
              <p className="reveal d2 mt-6 max-w-lg text-base leading-8" style={{ color: "#8A8D91" }}>
                선수 출신 관장·코치가 모든 지점에서 직접 지도합니다.<br />
                단체 수업 없이, 개인 수준에 맞춰 1:1로 진도를 잡아드립니다.
              </p>
            </div>

            {/* 대표 카드 — red border 강조 */}
            <a
              href="https://www.instagram.com/strongboxing_official"
              target="_blank" rel="noopener noreferrer"
              className="reveal group mb-4 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 md:flex-row"
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

            <div className="mt-4 flex flex-col items-center justify-between gap-4 p-7 sm:flex-row"
              style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
              <div>
                <p className="font-black text-base" style={{ color: "#F5F4F1" }}>직접 만나서 확인해보세요.</p>
                <p className="mt-1 text-xs" style={{ color: "#5A5C61" }}>
                  원데이 클래스로 부담 없이 코치진과 함께 운동해볼 수 있습니다.
                </p>
              </div>
              <a href="/reservation"
                className="group inline-flex items-center gap-2 shrink-0 rounded-[10px] bg-[#D01E2E] px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                원데이 클래스 예약하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        <div id="clips" style={{ scrollMarginTop: "120px" }}>
          <ReelsSection />
        </div>

        {/* ══════════════════════════════════════
            FIRST VISIT
        ══════════════════════════════════════ */}
        <section className="px-6 py-24 md:px-8" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>FIRST VISIT</p>
              <h2 className="reveal d1 font-black" style={{ fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-0.05em" }}>
                처음 오면 어떻게 되나요?
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["01", "예약 또는 방문", "네이버·홈페이지로 예약하거나 바로 방문해도 됩니다"],
                ["02", "편한 복장으로", "편한 복장과 실내용 운동화만 준비해주세요"],
                ["03", "관장과 상담", "운동 목적·체력에 맞춰 맞춤 안내해드립니다"],
                ["04", "바로 운동 시작", "처음 오셔도 기본 자세부터 천천히 알려드립니다"],
              ].map(([step, title, desc], i) => (
                <div key={step}
                  className={`reveal d${i + 1} p-7 transition-all duration-300 hover:-translate-y-1`}
                  style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                  <p className="mb-6 text-2xl font-black" style={{ color: "#3A3A3E" }}>{step}</p>
                  <h3 className="mb-2 text-base font-black" style={{ color: "#F5F4F1" }}>{title}</h3>
                  <p className="text-sm leading-6" style={{ color: "#8A8D91" }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <a href="/reservation"
                className="group inline-flex items-center gap-2 rounded-[10px] bg-[#D01E2E] px-10 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                지금 바로 시작해보세요
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROGRAM
        ══════════════════════════════════════ */}
        <section id="program" className="px-6 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>PROGRAM</p>
                <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                  가능한 만큼부터<br />시작합니다.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7" style={{ color: "#8A8D91" }}>
                입문, 다이어트, 체력증진, 스트레스 해소까지 운동 목적에 맞게 진행합니다.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["01", "복싱 입문", "기본자세, 스텝, 펀치부터 차근차근. 처음 오셔도 바로 시작할 수 있습니다."],
                ["02", "다이어트 · 체력", "전신 운동으로 체지방 감량과 체력증진을 동시에."],
                ["03", "관장 직접 지도", "개인 수준과 목표에 맞춰 관장·코치가 직접 잡아드립니다."],
              ].map(([num, title, desc], i) => (
                <div key={num} className={`group reveal d${i + 1} p-10 transition-all duration-300 hover:-translate-y-1`}
                  style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                  <p className="mb-12 text-xs font-black" style={{ color: "rgba(208,30,46,0.25)" }}>{num}</p>
                  <h3 className="mb-3 text-2xl font-black" style={{ letterSpacing: "-0.04em", color: "#F5F4F1" }}>{title}</h3>
                  <p className="text-sm leading-7" style={{ color: "#8A8D91" }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-4 p-7 sm:flex-row"
              style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
              <div>
                <p className="font-black text-base" style={{ color: "#F5F4F1" }}>어떤 목적이든 시작할 수 있습니다.</p>
                <p className="mt-1 text-xs" style={{ color: "#5A5C61" }}>
                  입문·다이어트·체력증진 모두, 원데이 클래스로 먼저 경험해보세요.
                </p>
              </div>
              <a href="/reservation"
                className="group inline-flex items-center gap-2 shrink-0 rounded-[10px] bg-[#D01E2E] px-6 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-[#B71C2B]">
                원데이 클래스 예약하기
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        <FaqSection />

        <section id="calculator" style={{ background: "#0E0E10" }}>
          <BoxingCalculator />
        </section>

        {/* ══════════════════════════════════════
            SPACE GALLERY
        ══════════════════════════════════════ */}
        <section className="px-6 py-24 md:px-8" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>STRONG SPACE</p>
              <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
                사진으로 먼저 보는<br />스트롱복싱의 공간.
              </h2>
              <p className="reveal d2 mt-5 text-sm leading-7" style={{ color: "#8A8D91" }}>
                복싱 전용 링, 샌드백, 미트 트레이닝 공간. 처음 방문해도 편하게 운동할 수 있는 환경입니다.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="group relative overflow-hidden" style={{ borderRadius: 14 }}>
                <img src="/images/gallery/gallery-1.jpg" alt="시설"
                  className="h-full min-h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(0.85)" }} />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(14,14,16,0.35) 100%)" }} />
              </div>
              <div className="grid gap-3">
                <div className="group relative overflow-hidden" style={{ borderRadius: 14 }}>
                  <img src="/images/gallery/gallery-2.jpg" alt="시설"
                    className="h-[240px] w-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ filter: "brightness(0.85)" }} />
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "rgba(14,14,16,0.2)" }} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="group relative overflow-hidden" style={{ borderRadius: 14 }}>
                    <img src="/images/gallery/gallery-3.jpg" alt="시설"
                      className="h-[240px] w-full object-cover transition duration-700 group-hover:scale-105" style={{ filter: "brightness(0.85)" }} />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "rgba(14,14,16,0.2)" }} />
                  </div>
                  <div className="group relative overflow-hidden" style={{ borderRadius: 14 }}>
                    <img src="/images/gallery/gallery-4.jpg" alt="시설"
                      className="h-[240px] w-full object-cover transition duration-700 group-hover:scale-105" style={{ filter: "brightness(0.85)" }} />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "rgba(14,14,16,0.2)" }} />
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
              가까운 지점에서<br />원데이 클래스로 시작해보세요.
            </h2>
            <p className="reveal d2 mx-auto mt-8 max-w-lg text-base leading-8" style={{ color: "#8A8D91" }}>
              30,000원 현장결제 · 당일 등록 시 회원권에서 전액 차감됩니다.
            </p>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <ReservationButton className="btn-primary group rounded-[10px] bg-[#D01E2E] px-10 py-5 text-base font-black text-white hover:bg-[#B71C2B]">
                원데이 클래스 예약하기
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
        <section id="news" className="px-6 py-20 md:px-8" style={{ background: "#0E0E10" }}>
          <div className="mx-auto max-w-7xl">
            <NewsReviewClient posts={latestPosts} />
          </div>
        </section>
        {/* /NEWS & REVIEW */}

        {/* SEO sr-only */}
        <section className="sr-only">
          <h2>스트롱복싱 지점별 복싱장 안내</h2>
          <p>
            스트롱복싱은 목동점, 개봉점, 철산점, 신정점, 영등포점으로 운영되는 복싱 체육관입니다.
            관장이 직접 지도하는 정통 복싱장으로, 초보자도 기본기부터 편하게 시작할 수 있습니다.
            운동이 처음이어도 자유롭게 방문할 수 있고, 시간을 맞출 필요 없이 운영시간 내 언제든 이용 가능합니다.
            원데이 클래스 30,000원 현장결제, 당일 등록 시 회원권에서 전액 차감됩니다.
          </p>

          <h3>목동점 — 목동 복싱 · 오목교 복싱 · 양천구 복싱</h3>
          <p>
            서울 양천구 목동 909-6 우방빌딩 4층. 전화 02-2643-5971. 운영 평일 14~24시, 토 11~16시.
            목동 복싱, 오목교 복싱, 양천구 복싱, 목동 복싱장을 찾는 분들이 방문합니다.
            학생 복싱, 키즈 복싱, 방학특강, 다이어트 복싱, 직장인 운동 모두 가능합니다.
            초보자 환영, 개인 맞춤 지도, 자유롭게 방문할 수 있는 복싱장입니다.
            시간 맞출 필요 없는 복싱장으로 학생, 직장인, 다이어트가 목적인 분 모두 환영합니다.
          </p>

          <h3>개봉점 — 개봉 복싱 · 고척 복싱 · 구로 복싱 · 오류동 복싱</h3>
          <p>
            서울 구로구 개봉동 166-5 유원빌딩 지하 1층. 전화 02-2060-1279. 운영 평일 13~23시.
            개봉 복싱, 개봉동 복싱, 고척 복싱, 고척동 복싱, 오류동 복싱, 구로 복싱, 구로구 복싱을 찾는 분들이 방문합니다.
            여학생도 부담 없는 복싱장, 초보자 환영, 처음 시작해도 안 뻘쭘한 복싱장입니다.
            스트레스 해소, 다이어트, 여성 복싱, 초보 복싱, 관장 직접 지도로 심리적 진입장벽이 낮은 복싱장입니다.
          </p>

          <h3>철산점 — 철산 복싱 · 광명 복싱 · 철산역 복싱 · 광명시 복싱</h3>
          <p>
            경기도 광명시 철산동 56-14 3층. 전화 02-2066-0406. 운영 평일 14~23시, 토일 14~18시.
            철산 복싱, 철산동 복싱, 광명 복싱, 철산역 복싱, 광명시 복싱장을 찾는 분들이 방문합니다.
            선수 출신 지도진이 안전하게 가르치는 복싱장입니다.
            초보자 환영, 개인 맞춤 지도, 직장인 복싱, 여성 복싱, 퇴근 후 운동하기 좋은 광명 복싱장입니다.
            지도 잘하는 복싱장으로 안전하게 배우는 복싱을 원하는 분께 추천합니다.
          </p>

          <h3>신정점 — 신정 복싱 · 신정동 복싱 · 양천구 복싱</h3>
          <p>
            서울 양천구 신정동 1021-7 태화상가 2층. 전화 02-2647-3373. 운영 평일 10~24시, 토 10~16시.
            신정 복싱, 신정동 복싱, 양천구 복싱장. 초보자 환영, 다이어트 복싱, 꾸준히 다니기 좋은 복싱장입니다.
          </p>

          <h3>영등포점 — 영등포 복싱 · 영등포구 복싱</h3>
          <p>
            서울 영등포구 도림로 313 건영상가 2층. 전화 02-831-9312. 운영 평일 13~23시.
            영등포 복싱, 영등포구 복싱, 영등포 학생 복싱, 영등포 직장인 복싱, 초보자 복싱장입니다.
          </p>

          <h2>스트롱복싱 수업 방식 및 특징</h2>
          <p>
            몸풀기, 줄넘기, 기초자세와 스텝, 미트 트레이닝, 샌드백, 체력운동 순으로 개인 진도에 맞춰 진행합니다.
            단체 수업이 아닌 관장·코치가 각 회원 수준에 맞춰 직접 지도합니다.
            초보자도 기본기부터 차근차근, 여성도 부담 없이, 학생·직장인·다이어트 목적 모두 가능합니다.
          </p>
        </section>

        <BranchMap />

        <GallerySection />

        {/* ══════════════════════════════════════
            공인 단체
        ══════════════════════════════════════ */}
        <section className="px-6 py-24 md:px-8" style={{ background: "#0E0E10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>CERTIFIED GYM</p>
              <h2 className="reveal d1 font-black" style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.04em", color: "#F5F4F1" }}>
                프로복싱 4개 단체 가입 체육관
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs" style={{ color: "#5A5C61" }}>
                {["프로테스트 참가 가능", "각종 대회 참가 가능", "선수 등록 및 활동 가능"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#D01E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { src: "/images/boxing-orgs/kbf.jpg", name: "KBF", full: "한국권투연맹" },
                { src: "/images/boxing-orgs/kbm.jpg", name: "KBM", full: "한국복싱커미션" },
                { src: "/images/boxing-orgs/kbc.jpg", name: "KBC", full: "한국권투위원회" },
                { src: "/images/boxing-orgs/kba.jpg", name: "KBA", full: "한국권투협회" },
              ].map((org, i) => (
                <div key={org.name} className={`reveal d${i + 1} flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-[#1A1A1C]`}
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
                {["체육관 자체 승단 심사 가능", "공인 단증 취득 가능"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#D01E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            가격 안내
        ══════════════════════════════════════ */}
        <section className="px-6 py-16 md:px-8" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-7xl">
            <div className="reveal flex flex-col items-center gap-8 p-10 text-center md:flex-row md:text-left"
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
                className="btn-primary group inline-flex items-center gap-2 shrink-0 rounded-[10px] bg-[#D01E2E] px-8 py-4 font-black text-white hover:bg-[#B71C2B]">
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

        <FloatingCTA />

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
                  <a href={`/branches/${b.slug}`}
                    className="mb-2 block text-xs font-black transition-colors duration-200 hover:text-[#F5F4F1]"
                    style={{ color: "#8A8D91" }}>{b.name}</a>
                  <p className="text-xs leading-5" style={{ color: "#3A3A3E" }}>{b.address}</p>
                  <a href={`tel:${b.phone.replace(/-/g, "")}`}
                    className="mt-1 block text-xs transition-colors duration-200 hover:text-[#8A8D91]"
                    style={{ color: "#5A5C61" }}>{b.phone}</a>
                  <p className="text-xs" style={{ color: "#5A5C61" }}>{b.hours.join(" / ")}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#3A3A3E" }}>
              © 2025 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
