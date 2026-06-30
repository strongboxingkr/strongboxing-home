import BoxingCalculator from "./components/BoxingCalculator";
import { db } from "@/lib/db";
import ConsultationForm from "./components/ConsultationForm";
import ScrollLink from "./components/ScrollLink";
import ReservationButton from "./components/ReservationButton";
import AiCoachChat from "./components/AiCoachChat";
import FaqSection from "./components/FaqSection";
import ReelsSection from "./components/ReelsSection";
import NaverReviewsSection from "./components/NaverReviewsSection";
import GallerySection from "./components/GallerySection";
import RevealObserver from "./components/RevealObserver";
import BranchMap from "./components/BranchMap";
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
    slug: "gaebong", name: "개봉점", image: "/images/branches/gaebong.jpg",
    phone: "02-2060-1279", address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"], review: "초보자도 분위기 좋게 시작하기 좋은 지점",
    score: "4.9", reviewCount: 229, badges: ["초보자 환영", "구로구 복싱"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
  },
  {
    slug: "sinjeong", name: "신정점", image: "/images/branches/sinjeong.jpg",
    phone: "02-2647-3373", address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    hours: ["월-금 10:00~24:00", "토 10:00~16:00"], review: "운동 루틴 만들기 좋은 밸런스형 복싱짐",
    score: "4.9", reviewCount: 277, badges: ["여성 회원 다수", "양천구 복싱"],
    instagram: "https://www.instagram.com/strongboxing_sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
  },
  {
    slug: "mokdong", name: "목동점", image: "/images/branches/mokdong.png",
    phone: "02-2643-5971", address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"], review: "깔끔한 공간에서 다이어트 복싱 시작하기 좋음",
    score: "4.9", reviewCount: 106, badges: ["다이어트 복싱", "직장인 운동"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
  },
  {
    slug: "cheolsan", name: "철산점", image: "/images/branches/cheolsan.jpg",
    phone: "02-2066-0406", address: "경기도 광명시 철산동 56-14 3층",
    hours: ["월-금 14:00~23:00", "토일 14:00~18:00"], review: "새롭게 준비된 스트롱복싱 지점",
    score: "NEW", reviewCount: 8, badges: ["신규 지점", "광명 복싱"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "", naverMap: "",
  },
  {
    slug: "yeongdeungpo", name: "영등포점", image: "/images/branches/yeongdeungpo.jpg",
    phone: "02-831-9312", address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"], review: "퇴근 후 운동하기 좋은 도심형 복싱짐",
    score: "4.8", reviewCount: 77, badges: ["퇴근 후 운동", "영등포 복싱"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
  },
];

const coaches = [
  { branch: "개봉점", name: "안진호", role: "관장", instagram: "dkswkd3" },
  { branch: "신정점", name: "유상혁", role: "관장", instagram: "robuste_hyeok" },
  { branch: "신정점", name: "정동주", role: "코치", instagram: "jdj_00_" },
  { branch: "목동점", name: "송재용", role: "관장", instagram: "nan_yong_" },
  { branch: "목동점", name: "양승호", role: "코치", instagram: "qortor0_0" },
  { branch: "철산점", name: "안도연", role: "코치", instagram: "strongboxing_andy" },
];

function getFirstImage(content: string) {
  const match = String(content || "").match(/!\[.*?\]\((.*?)\)/);
  return match?.[1] || null;
}

const TICKER_ITEMS = [
  "STRONG BOXING", "정해진 수업시간 없음", "코치 직접 지도",
  "5개 지점", "초보자 환영", "네이버 평점 4.9",
  "다이어트 복싱", "목동 · 신정 · 개봉 · 철산 · 영등포",
];

export default async function HomePage() {
  const [rows]: any = await db.query(`
    SELECT id, title, slug, description, content, branch_name, created_at
    FROM homepage_posts
    ORDER BY created_at DESC
    LIMIT 3
  `);
  const latestPosts = rows;

  return (
    <>
      <main className="min-h-screen bg-[#0A0A0B] text-white">
        <RevealObserver />

        {/* ── HEADER ── */}
        <header className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#0A0A0B]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <a href="/" className="flex items-center gap-3">
              <img src="/icon.png" alt="스트롱복싱" className="h-8 w-8 object-contain" />
              <span className="text-base font-black tracking-tight">
                STRONG<span className="text-[#FC5230]">BOXING</span>
              </span>
            </a>
            <nav className="hidden items-center gap-8 text-xs font-black tracking-[0.12em] text-zinc-500 md:flex">
              <ScrollLink targetId="branch" className="transition hover:text-white">지점</ScrollLink>
              <ScrollLink targetId="program" className="transition hover:text-white">프로그램</ScrollLink>
              <a href="/blog" className="transition hover:text-white">후기/소식</a>
            </nav>
            <ReservationButton className="bg-[#FC5230] px-5 py-2.5 text-xs font-black">
              방문 상담 예약
            </ReservationButton>
          </div>
        </header>

        {/* ── 01 HERO ── */}
        <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-5 pb-8 pt-20 md:px-10">
          <img
            src="/images/gallery/gallery-1.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/60 via-transparent to-[#0A0A0B]" />

          {/* top label */}
          <p className="relative z-10 pt-4 text-[10px] font-black tracking-[0.4em] text-white/25">
            STRONG BOXING · 서울 복싱 5개 지점
          </p>

          {/* main headline */}
          <h1 className="relative z-10 text-[clamp(58px,10.5vw,148px)] font-black leading-[0.86] tracking-[-0.05em]">
            오늘,<br />
            처음으로<br />
            주먹을<br />
            쥐었다.
          </h1>

          {/* bottom bar */}
          <div className="relative z-10 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-zinc-300">목동 · 신정 · 개봉 · 철산 · 영등포</p>
              <p className="mt-1 text-xs text-zinc-600">초보자 환영 · 정해진 수업시간 없음 · 코치 직접 지도</p>
            </div>
            <div className="flex gap-3">
              <ReservationButton className="shrink-0 bg-[#FC5230] px-6 py-3.5 text-sm font-black">
                방문 상담 예약
              </ReservationButton>
              <a href="/blog"
                className="shrink-0 border border-white/[0.08] px-6 py-3.5 text-sm font-black text-zinc-400 transition hover:text-white">
                운동 후기 보기
              </a>
            </div>
          </div>
        </section>

        {/* ── 02 TICKER ── */}
        <div className="overflow-hidden border-y border-white/[0.06] bg-[#0A0A0B] py-3.5">
          <div className="animate-marquee">
            {[...Array(2)].map((_, ri) => (
              <span key={ri} className="flex shrink-0 items-center">
                {TICKER_ITEMS.map((item, i) => (
                  <span key={i} className="flex shrink-0 items-center">
                    <span className="whitespace-nowrap px-6 text-[10px] font-black tracking-[0.28em] text-white/20">
                      {item}
                    </span>
                    <span className="text-white/8 text-xs">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── 03 THE DIFFERENCE ── */}
        <section className="bg-[#0A0A0B]">
          {/* big statement */}
          <div className="border-b border-white/[0.06] px-5 py-20 md:px-10 md:py-32">
            <div className="mx-auto max-w-7xl grid items-end gap-12 md:grid-cols-[1fr_360px]">
              <div>
                <h2 className="reveal text-[clamp(64px,9.5vw,136px)] font-black leading-[0.88] tracking-[-0.05em]">
                  수업<br />시간이<br />없습니다.
                </h2>
                <p className="reveal d1 mt-8 max-w-lg text-lg leading-8 text-zinc-500">
                  운영시간 내 언제든 방문하면 바로 운동이 시작됩니다.<br />
                  코치가 오늘 당신의 컨디션에 맞춰 운동을 조절합니다.
                </p>
              </div>
              <div className="overflow-hidden">
                <img
                  src="/images/gallery/gallery-2.jpg"
                  alt="스트롱복싱 운동"
                  className="h-[380px] w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* workout flow */}
          <div className="border-b border-white/[0.06] overflow-x-auto px-5 py-8 md:px-10">
            <div className="mx-auto max-w-7xl">
              <p className="mb-4 text-[10px] font-black tracking-[0.35em] text-zinc-700">1회 운동 구성</p>
              <div className="flex items-center gap-3 whitespace-nowrap">
                {["워밍업", "줄넘기 3R", "기초자세·스텝", "미트트레이닝", "샌드백", "체력운동"].map((s, i, arr) => (
                  <span key={s} className="flex items-center gap-3">
                    <span className="text-sm font-black text-white/60">{s}</span>
                    {i < arr.length - 1 && <span className="text-white/15 text-lg font-thin">—</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA strip */}
          <div className="border-b border-white/[0.06] px-5 py-6 md:px-10">
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">
              <p className="text-sm font-black text-zinc-400">
                직장인, 주부, 학생 — 누구든 운영시간 내 바로 시작 가능
              </p>
              <a href="/#branch" className="shrink-0 text-xs font-black text-zinc-600 transition hover:text-white">
                지점 운영시간 확인 →
              </a>
            </div>
          </div>
        </section>

        {/* ── 04 BRANCHES ── */}
        <section id="branch" className="bg-[#0A0A0B]">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-white/[0.06] px-5 py-5 md:px-10">
              <p className="text-[10px] font-black tracking-[0.35em] text-zinc-700">LOCATIONS — 5개 지점</p>
            </div>
            {branches.map((branch, i) => (
              <a
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className="group flex items-center border-b border-white/[0.06] px-5 py-5 transition hover:bg-white/[0.015] md:px-10"
              >
                <span className="mr-5 w-5 shrink-0 text-[10px] font-black text-zinc-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mr-4 h-12 w-12 shrink-0 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black tracking-[-0.03em]">{branch.name}</h3>
                  <p className="truncate text-xs text-zinc-600">{branch.address}</p>
                </div>
                <div className="ml-4 hidden shrink-0 text-right md:block">
                  <p className="text-xs text-zinc-600">{branch.hours[0]}</p>
                  {branch.score !== "NEW" && (
                    <p className="mt-0.5 text-xs font-black text-zinc-400">★ {branch.score} · {branch.reviewCount}개</p>
                  )}
                  {branch.score === "NEW" && (
                    <p className="mt-0.5 text-xs font-black text-[#FC5230]">NEW</p>
                  )}
                </div>
                <span className="ml-5 shrink-0 text-zinc-700 transition duration-200 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── 05 COACHES ── */}
        <section className="border-t border-white/[0.06] bg-[#0A0A0B] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="reveal mb-14 text-[clamp(48px,7vw,96px)] font-black leading-[0.9] tracking-[-0.05em]">
              직접<br />가르칩니다.
            </h2>

            {/* 대표 */}
            <a
              href="https://www.instagram.com/strongboxing_official"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-px block overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="h-64 w-full shrink-0 overflow-hidden md:h-72 md:w-64">
                  <img
                    src="/images/coaches/hansol.jpg"
                    alt="한솔 대표"
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-end bg-[#111113] p-8 md:p-10">
                  <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-zinc-600">REPRESENTATIVE</p>
                  <h3 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">한솔 대표</h3>
                  <p className="mt-2 text-sm text-zinc-500">스트롱복싱 대표 · 전 지점 총괄</p>
                </div>
              </div>
            </a>

            {/* 코치진 */}
            <div className="mt-px grid gap-px bg-white/[0.04] md:grid-cols-3">
              {coaches.map((coach) => (
                <a
                  key={coach.name}
                  href={`https://www.instagram.com/${coach.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#0A0A0B] p-7 transition hover:bg-[#111113]"
                >
                  <p className="mb-2 text-[10px] font-black tracking-[0.25em] text-zinc-700">{coach.branch}</p>
                  <h3 className="text-lg font-black">
                    {coach.name} <span className="text-zinc-600 font-normal text-sm">{coach.role}</span>
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-700 transition group-hover:text-zinc-500">
                    @{coach.instagram}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 REELS ── */}
        <ReelsSection />

        {/* ── 07 SOCIAL PROOF (light) ── */}
        <section className="bg-[#EDECEA] px-5 py-20 text-[#0A0A0B] md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[clamp(88px,14vw,180px)] font-black leading-none tracking-[-0.05em]">
                  4.9
                </p>
                <p className="mt-2 text-xs font-black tracking-[0.25em] text-[#0A0A0B]/40">
                  NAVER 평균 평점
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-[#0A0A0B]/40 md:text-right">
                <span>개봉점 229개</span>
                <span>신정점 277개</span>
                <span>목동점 106개</span>
                <span>영등포점 77개</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 NAVER REVIEWS ── */}
        <NaverReviewsSection />

        {/* ── 09 FIRST VISIT ── */}
        <section className="border-t border-white/[0.06] bg-[#0A0A0B] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14">
              <p className="reveal mb-3 text-[10px] font-black tracking-[0.35em] text-zinc-600">FIRST VISIT</p>
              <h2 className="reveal d1 text-3xl font-black tracking-[-0.04em] md:text-4xl">
                처음 오면 어떻게 되나요?
              </h2>
            </div>

            <div className="grid border-t border-white/[0.06] md:grid-cols-4">
              {[
                ["01", "방문 상담 예약", "홈페이지나 네이버로 간단히 예약"],
                ["02", "체육관 방문", "편한 복장으로 방문하시면 돼요"],
                ["03", "코치와 1:1 상담", "목적·체력·일정 맞춤 안내"],
                ["04", "바로 운동 시작", "당일 체험도 가능합니다"],
              ].map(([step, title, desc], i) => (
                <div
                  key={step}
                  className={`border-b border-white/[0.06] py-8 pr-6 md:border-b-0 ${i < 3 ? "md:border-r" : ""} md:border-white/[0.06]`}
                >
                  <p className="mb-6 text-xs font-black text-zinc-700 md:pl-6">{step}</p>
                  <h3 className="mb-2 text-lg font-black md:pl-6">{title}</h3>
                  <p className="text-sm leading-7 text-zinc-600 md:pl-6">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-start">
              <ReservationButton className="bg-[#FC5230] px-7 py-4 text-sm font-black">
                지금 시작하기
              </ReservationButton>
            </div>
          </div>
        </section>

        {/* ── 10 PROGRAM ── */}
        <section id="program" className="border-t border-white/[0.06] bg-[#0A0A0B] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-16 md:flex-row">
              <div className="md:w-80 md:shrink-0">
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-zinc-600">PROGRAM</p>
                <h2 className="reveal d1 text-[clamp(44px,6vw,80px)] font-black leading-[0.9] tracking-[-0.05em]">
                  복싱은<br />어렵지<br />않게.
                </h2>
                <p className="reveal d2 mt-6 text-sm leading-7 text-zinc-500">
                  처음 배우는 자세부터 다이어트, 체력향상, 스트레스 해소까지
                  목적에 맞는 방향으로 진행합니다.
                </p>
              </div>

              <div className="flex-1 border-t border-white/[0.06] md:border-l md:border-t-0 md:pl-12">
                {[
                  ["01", "복싱 입문", "기본자세, 스텝, 펀치부터 차근차근. 처음 오는 날부터 바로 배웁니다."],
                  ["02", "다이어트 복싱", "재밌게 땀나는 복싱 트레이닝. 지루하지 않게 운동량을 높입니다."],
                  ["03", "코치 직접 지도", "목적에 맞춘 밀착 트레이닝. 코치가 오늘의 컨디션에 맞게 조절합니다."],
                ].map(([num, title, desc], i) => (
                  <div
                    key={num}
                    className={`py-8 ${i > 0 ? "border-t border-white/[0.06]" : ""}`}
                  >
                    <p className="mb-3 text-[10px] font-black text-zinc-700">{num}</p>
                    <h3 className="mb-2 text-2xl font-black tracking-[-0.03em]">{title}</h3>
                    <p className="text-sm leading-7 text-zinc-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 11 CALCULATOR ── */}
        <section id="calculator" className="border-t border-white/[0.06] bg-[#0d0d0f]">
          <BoxingCalculator />
        </section>

        {/* ── 12 FAQ ── */}
        <FaqSection />

        {/* ── 13 NEWS ── */}
        <section id="news" className="border-t border-white/[0.06] bg-[#0A0A0B] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="reveal mb-2 text-[10px] font-black tracking-[0.35em] text-zinc-600">NEWS & REVIEW</p>
                <h2 className="reveal d1 text-4xl font-black tracking-[-0.04em] md:text-5xl">
                  지점별 소식과 후기.
                </h2>
              </div>
              <a href="/blog" className="text-xs font-black text-zinc-600 transition hover:text-white">
                전체 보기 →
              </a>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid gap-px bg-white/[0.04] md:grid-cols-3">
                {latestPosts.map((post: any) => {
                  const image = getFirstImage(post.content);
                  return (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group bg-[#0A0A0B] transition hover:bg-[#111113]"
                    >
                      {image && (
                        <div className="h-44 overflow-hidden">
                          <img
                            src={encodeURI(image)}
                            alt={post.title}
                            className="h-full w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-7">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="bg-[#FC5230] px-3 py-1 text-[11px] font-black">
                            {post.branch_name}
                          </span>
                          <span className="text-xs text-zinc-700">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="mb-3 text-xl font-black leading-tight tracking-[-0.03em]">
                          {post.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-7 text-zinc-500">
                          {post.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="border border-white/[0.06] p-10 text-center">
                <p className="text-zinc-600">곧 업데이트될 예정입니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── 14 BRANCH MAP ── */}
        <BranchMap />

        {/* ── 15 GALLERY ── */}
        <GallerySection />

        {/* ── 16 CERTIFICATIONS ── */}
        <section className="border-t border-white/[0.06] bg-[#0A0A0B] px-5 py-16 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-center gap-6">
              <p className="text-[10px] font-black tracking-[0.35em] text-zinc-700">CERTIFIED GYM</p>
              <p className="text-xs text-zinc-600">프로복싱 4개 단체 가입 · 승단 심사 가능 · 선수 등록 가능</p>
            </div>

            <div className="flex flex-wrap items-center gap-8 border-b border-white/[0.06] pb-10">
              {[
                { src: "/images/boxing-orgs/kbf.jpg", name: "KBF", full: "한국권투연맹" },
                { src: "/images/boxing-orgs/kbm.jpg", name: "KBM", full: "한국복싱커미션" },
                { src: "/images/boxing-orgs/kbc.jpg", name: "KBC", full: "한국권투위원회" },
                { src: "/images/boxing-orgs/kba.jpg", name: "KBA", full: "한국권투협회" },
              ].map((org) => (
                <div key={org.name} className="flex items-center gap-3">
                  <img src={org.src} alt={org.full} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-black">{org.name}</p>
                    <p className="text-[11px] text-zinc-600">{org.full}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img src="/images/boxing-orgs/kaba.jpg" alt="대한생활체육복싱협회" className="h-12 w-12 object-contain" />
                <div>
                  <p className="text-[10px] text-zinc-600">KOREA AMATEUR BOXING ASSOCIATION</p>
                  <p className="text-base font-black">대한생활체육복싱협회</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="border border-[#FC5230] px-4 py-2 text-xs font-black text-[#FC5230]">승단 심사 가능</span>
                <div className="text-xs text-zinc-600 space-y-1">
                  <p>✔ 체육관 자체 승단 심사 가능</p>
                  <p>✔ 공인 단증 취득 가능</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 17 PRICING ── */}
        <section className="border-t border-white/[0.06] bg-[#0A0A0B] px-5 py-14 md:px-10">
          <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black tracking-[0.35em] text-zinc-700">PRICING</p>
              <h2 className="text-2xl font-black tracking-[-0.04em]">수강료가 궁금하신가요?</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-500">
                수강료는 지점별·프로그램별로 다르게 운영됩니다. 방문 상담 시 안내해드립니다.
              </p>
            </div>
            <a href="/reservation"
              className="shrink-0 bg-[#FC5230] px-7 py-4 text-sm font-black text-white transition hover:brightness-110">
              상담 예약하고 문의하기 →
            </a>
          </div>
        </section>

        {/* ── 18 CONSULTATION FORM ── */}
        <ConsultationForm />

        {/* ── 19 AI COACH ── */}
        <AiCoachChat />

        {/* ── SEO (sr-only) ── */}
        <section className="sr-only">
          <h2>스트롱복싱 지점별 복싱장 안내</h2>
          <p>스트롱복싱은 개봉점, 신정점, 목동점, 철산점, 영등포점으로 운영되는 복싱 체육관입니다.
            개봉 복싱, 개봉동 복싱, 구로 복싱, 신정 복싱, 신정동 복싱, 양천구 복싱,
            목동 복싱, 목동 복싱장, 철산 복싱, 철산동 복싱, 광명 복싱,
            영등포 복싱, 영등포구 복싱을 찾는 분들이 방문하고 있습니다.</p>
          <p>초보자 복싱, 여성 복싱, 다이어트 복싱, 직장인 운동, 학생 운동,
            키즈 복싱, 어린이 복싱, 체력 향상 운동, 스트레스 해소 운동을
            목적에 맞게 시작할 수 있습니다.</p>
          <h3>개봉점</h3>
          <p>서울 구로구 개봉동 166-5 유원빌딩 지하 1층. 개봉 복싱, 개봉동 복싱장, 구로 복싱. 전화번호 02-2060-1279.</p>
          <h3>신정점</h3>
          <p>서울 양천구 신정동 1021-7 태화상가 2층. 신정 복싱, 신정동 복싱장, 양천구 복싱. 전화번호 02-2647-3373.</p>
          <h3>목동점</h3>
          <p>서울 양천구 목동 909-6 우방빌딩 4층. 목동 복싱, 목동 복싱장, 목동 다이어트 복싱. 전화번호 02-2643-5971.</p>
          <h3>철산점</h3>
          <p>경기도 광명시 철산동 56-14 3층. 철산 복싱, 철산동 복싱장, 광명 복싱. 전화번호 02-2066-0406.</p>
          <h3>영등포점</h3>
          <p>서울 영등포구 도림로 313 건영상가 2층. 영등포 복싱, 영등포구 복싱장, 도림동 복싱. 전화번호 02-831-9312.</p>
          <h2>스트롱복싱 운동 영상</h2>
          <p>스트롱복싱 운동 영상은 철산 복싱, 광명 복싱, 목동 복싱, 신정동 복싱, 개봉동 복싱, 영등포 복싱, 여성 복싱, 초보자 복싱, 다이어트 복싱, 체력 향상 운동 모습을 담고 있습니다.</p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/[0.06] bg-[#050506] px-5 py-14 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <span className="text-lg font-black tracking-tight">
                STRONG<span className="text-[#FC5230]">BOXING</span>
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {branches.map((b) => (
                <div key={b.slug}>
                  <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-[#FC5230]">{b.name}</p>
                  <p className="text-xs text-zinc-600">{b.address}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{b.phone}</p>
                  <p className="mt-0.5 text-xs text-zinc-700">{b.hours.join(" / ")}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 border-t border-white/[0.06] pt-8 text-xs text-zinc-700">
              © 2025 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
