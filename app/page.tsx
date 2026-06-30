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
    slug: "gaebong",
    name: "개봉점",
    image: "/images/branches/gaebong.jpg",
    phone: "02-2060-1279",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    review: "초보자도 분위기 좋게 시작하기 좋은 지점",
    score: "4.9", reviewCount: 229,
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
    score: "4.9", reviewCount: 277,
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
    score: "4.9", reviewCount: 106,
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
    review: "새롭게 준비된 스트롱복싱 지점",
    score: "NEW", reviewCount: 8,
    badges: ["신규 지점", "광명 복싱"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "", naverMap: "",
  },
  {
    slug: "yeongdeungpo",
    name: "영등포점",
    image: "/images/branches/yeongdeungpo.jpg",
    phone: "02-831-9312",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    review: "퇴근 후 운동하기 좋은 도심형 복싱짐",
    score: "4.8", reviewCount: 77,
    badges: ["퇴근 후 운동", "영등포 복싱"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
  },
];

function getFirstImage(content: string) {
  const match = String(content || "").match(/!\[.*?\]\((.*?)\)/);
  return match?.[1] || null;
}

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
      <main className="bg-[#F2F2F0] text-[#111]">
        <RevealObserver />

        {/* ── HEADER ── */}
        <header className="fixed left-0 top-0 z-50 w-full bg-[#2B2B2B]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <a href="/" className="flex items-center gap-3">
              <img src="/icon.png" alt="스트롱복싱" className="h-8 w-8 object-contain brightness-0 invert" />
              <span className="text-base font-black tracking-widest text-white uppercase">
                Strong Boxing
              </span>
            </a>
            <nav className="hidden items-center gap-8 text-xs font-bold tracking-widest text-white/50 md:flex">
              <ScrollLink targetId="routine" className="transition hover:text-white">루틴</ScrollLink>
              <ScrollLink targetId="branch" className="transition hover:text-white">지점</ScrollLink>
              <ScrollLink targetId="program" className="transition hover:text-white">프로그램</ScrollLink>
              <a href="/blog" className="transition hover:text-white">후기/소식</a>
            </nav>
            <ReservationButton className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-black tracking-widest text-white transition hover:bg-white hover:text-[#111]">
              무료 체험 신청
            </ReservationButton>
          </div>
        </header>

        {/* ── 01 HERO ── */}
        <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-20 md:px-12">
          {/* watermark */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-black uppercase leading-none tracking-[-0.04em] text-[#111]/[0.045]"
            style={{ fontSize: "clamp(80px, 18vw, 260px)", lineHeight: 0.88 }}
            aria-hidden="true"
          >
            STRONG<br />BOXING
          </div>

          {/* top label */}
          <div className="relative z-10 flex items-center gap-3 pt-4">
            <span className="h-px w-10 bg-[#111]/30" />
            <p className="text-[11px] font-bold tracking-[0.3em] text-[#111]/40">
              복싱 트레이닝 클럽 · 서울
            </p>
          </div>

          {/* center content */}
          <div className="relative z-10 flex flex-1 flex-col justify-center py-16">
            <p className="mb-5 text-[11px] font-black tracking-[0.35em] text-[#111]/30 uppercase">
              Boxing Training Club · Seoul &amp; Gwangmyeong
            </p>
            <p className="mb-8 max-w-sm text-xl font-bold leading-8 text-[#111]/60 md:text-2xl">
              묵직한 정통 체육관에서 실전 감각을 깨우세요.<br />
              당신의 속도로 강해지는 곳.
            </p>

            {/* FIT / FIGHT toggle */}
            <div className="mb-8 flex w-fit rounded-full border border-[#111]/15 bg-white p-1 shadow-sm">
              <div className="rounded-full bg-[#111] px-8 py-3 text-center">
                <p className="text-xs font-black tracking-widest text-white">FIT</p>
                <p className="text-[10px] text-white/50">가볍게 시작</p>
              </div>
              <div className="px-8 py-3 text-center">
                <p className="text-xs font-black tracking-widest text-[#111]">FIGHT</p>
                <p className="text-[10px] text-[#111]/40">제대로 붙는다</p>
              </div>
            </div>

            <ReservationButton className="w-fit text-sm font-black text-[#111] underline-offset-4 hover:underline">
              무료 체험 신청 →
            </ReservationButton>
          </div>

          {/* bottom */}
          <div className="relative z-10 flex items-center gap-3">
            <span className="h-8 w-px bg-[#111]/20" />
            <p className="text-[10px] font-black tracking-[0.4em] text-[#111]/30">SCROLL</p>
          </div>
        </section>

        {/* ── 02 BRAND STATEMENT ── */}
        <section className="bg-[#2B2B2B] px-6 py-24 text-white md:px-12 md:py-36">
          <div className="mx-auto max-w-5xl">
            <p className="reveal mb-8 text-[10px] font-black tracking-[0.35em] text-white/30">HOW WE TRAIN</p>
            <h2 className="reveal d1 text-[clamp(36px,6.5vw,88px)] font-black leading-[0.9] tracking-[-0.06em]">
              화려한 말이 아니라<br />반복이 사람을 바꿉니다.
            </h2>
            <p className="reveal d2 mt-8 max-w-xl text-lg leading-9 text-white/40">
              스트롱복싱은 가장 정직한 방식으로 당신을 단련합니다 — 한 번에 한 라운드씩.
              정해진 수업시간 없이, 운영시간 내 방문하면 바로 운동이 시작됩니다.
              코치가 오늘의 컨디션에 맞춰 루틴을 조절합니다.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              {["초보자 환영", "정해진 수업시간 없음", "코치 직접 지도", "아프면 대체 운동"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-black tracking-wider text-white/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 STRONG ROUTINE ── */}
        <section id="routine" className="bg-[#F2F2F0] px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-5xl">
            <p className="reveal mb-8 text-[10px] font-black tracking-[0.35em] text-[#111]/30">STRONG ROUTINE</p>
            <h2 className="reveal d1 mb-4 text-[clamp(36px,6vw,80px)] font-black leading-[0.9] tracking-[-0.06em]">
              하루 운동은<br />이렇게 이어집니다.
            </h2>
            <p className="reveal d2 mb-16 text-base text-[#111]/40">
              아프거나 어려운 동작은 다른 운동으로 대체합니다.
            </p>

            <div className="border-t border-[#111]/10">
              {[
                ["01", "몸풀기", "운동 전 몸을 깨우는 준비"],
                ["02", "줄넘기 3R", "복싱 리듬과 기초 체력"],
                ["03", "기본자세 & 스텝", "자세, 중심, 발 움직임"],
                ["04", "미트 트레이닝", "코치와 1:1로 타격 감각"],
                ["05", "샌드백", "펀치, 파워, 지구력"],
                ["06", "체력운동", "마지막까지 확실하게"],
              ].map(([no, title, desc], i) => (
                <div
                  key={no}
                  className={`reveal d${Math.min(i + 1, 5)} grid items-center gap-4 border-b border-[#111]/10 py-7 md:grid-cols-[80px_1fr_1fr]`}
                >
                  <p className="text-sm font-black text-[#FC5230]">{no}</p>
                  <h3 className="text-2xl font-black tracking-[-0.04em] md:text-3xl">{title}</h3>
                  <p className="text-sm text-[#111]/40">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 BRANCHES ── */}
        <section id="branch" className="bg-white px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-[#111]/30">5 LOCATIONS</p>
                <h2 className="reveal d1 text-[clamp(36px,5.5vw,72px)] font-black leading-[0.9] tracking-[-0.06em]">
                  가까운 지점에서<br />시작하세요.
                </h2>
              </div>
              <a href="/reservation" className="hidden text-sm font-black text-[#FC5230] md:block">
                방문 상담 예약 →
              </a>
            </div>

            {/* 지점 카드 그리드 */}
            <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0">
              {branches.map((branch, index) => (
                <a
                  key={branch.slug}
                  href={`/branches/${branch.slug}`}
                  className={`group relative overflow-hidden border border-[#111]/[0.06] bg-[#F2F2F0] min-w-[80vw] shrink-0 md:min-w-0 ${index === 0 ? "h-[340px] md:col-span-2" : "h-[260px]"}`}
                >
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111]/80 via-[#111]/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-7">
                    <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-white/50">STRONG BOXING</p>
                    <h3 className="text-4xl font-black tracking-[-0.05em] text-white">{branch.name}</h3>
                    {branch.score !== "NEW" ? (
                      <p className="mt-2 text-sm font-bold text-white/70">★ {branch.score} · 리뷰 {branch.reviewCount}개</p>
                    ) : (
                      <p className="mt-2 text-sm font-black text-[#FC5230]">NEW OPEN</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 COACHES ── */}
        <section className="bg-[#F2F2F0] px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-[#111]/30">COACH</p>
            <h2 className="reveal d1 mb-14 text-[clamp(36px,5.5vw,72px)] font-black leading-[0.9] tracking-[-0.06em]">
              직접 가르치는<br />전문 코치진.
            </h2>

            <a
              href="https://www.instagram.com/strongboxing_official"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-px flex flex-col overflow-hidden border border-[#111]/[0.06] bg-white md:flex-row"
            >
              <div className="h-64 w-full shrink-0 overflow-hidden md:h-72 md:w-64">
                <img src="/images/coaches/hansol.jpg" alt="한솔 대표"
                  className="h-full w-full object-cover object-top grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col justify-center p-10">
                <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-[#FC5230]">REPRESENTATIVE</p>
                <h3 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">한솔 대표</h3>
                <p className="mt-2 text-[#111]/40">스트롱복싱 대표 · 전 지점 총괄</p>
              </div>
            </a>

            <div className="mt-px grid gap-px bg-[#111]/[0.06] md:grid-cols-3">
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
                  className="group bg-white p-7 transition hover:bg-[#F2F2F0]"
                >
                  <p className="mb-2 text-[10px] font-black tracking-[0.25em] text-[#FC5230]">{coach.branch}</p>
                  <h3 className="text-lg font-black">{coach.name} <span className="font-normal text-[#111]/30 text-sm">{coach.role}</span></h3>
                  <p className="mt-1 text-xs text-[#111]/25 transition group-hover:text-[#111]/50">@{coach.instagram}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 REELS ── */}
        <ReelsSection />

        {/* ── 07 SOCIAL PROOF ── */}
        <section className="bg-[#2B2B2B] px-6 py-20 text-white md:px-12">
          <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-white/30">NAVER 평균 평점</p>
              <p className="text-[clamp(80px,14vw,160px)] font-black leading-none tracking-[-0.05em]">4.9</p>
            </div>
            <div className="text-sm text-white/30 space-y-1 md:text-right">
              <p>개봉점 229개 · 신정점 277개</p>
              <p>목동점 106개 · 영등포점 77개</p>
            </div>
          </div>
        </section>

        {/* ── 08 NAVER REVIEWS ── */}
        <NaverReviewsSection />

        {/* ── 09 PROGRAM ── */}
        <section id="program" className="bg-[#F2F2F0] px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto max-w-5xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-[#111]/30">PROGRAM</p>
            <h2 className="reveal d1 mb-16 text-[clamp(36px,5.5vw,72px)] font-black leading-[0.9] tracking-[-0.06em]">
              복싱은 어렵지 않게,<br />운동은 확실하게.
            </h2>
            <div className="border-t border-[#111]/10">
              {[
                ["복싱 입문", "기본자세, 스텝, 펀치부터 차근차근. 처음 오는 날부터 바로 배웁니다."],
                ["다이어트 복싱", "재밌게 땀나는 복싱 트레이닝. 지루하지 않게 운동량을 높입니다."],
                ["코치 직접 지도", "목적에 맞춘 밀착 트레이닝. 오늘의 컨디션에 맞게 조절합니다."],
              ].map(([title, desc], i) => (
                <div key={title} className={`reveal d${i + 1} grid items-start gap-4 border-b border-[#111]/10 py-9 md:grid-cols-[1fr_2fr]`}>
                  <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
                  <p className="leading-8 text-[#111]/40">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <ReservationButton className="rounded-full bg-[#111] px-8 py-4 text-sm font-black text-white transition hover:bg-[#FC5230]">
                지금 시작하기 →
              </ReservationButton>
            </div>
          </div>
        </section>

        {/* ── 10 FIRST VISIT ── */}
        <section className="bg-white px-6 py-24 md:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-[#111]/30">FIRST VISIT</p>
            <h2 className="reveal d1 mb-14 text-[clamp(32px,4.5vw,60px)] font-black leading-[0.92] tracking-[-0.05em]">
              처음 오면 어떻게 되나요?
            </h2>
            <div className="grid border-t border-[#111]/10 md:grid-cols-4">
              {[
                ["01", "방문 상담 예약", "홈페이지나 네이버로 간단히 예약"],
                ["02", "체육관 방문", "편한 복장으로 방문하시면 돼요"],
                ["03", "코치와 1:1 상담", "목적·체력·일정 맞춤 안내"],
                ["04", "바로 운동 시작", "당일 체험도 가능합니다"],
              ].map(([step, title, desc], i) => (
                <div key={step}
                  className={`reveal d${i + 1} border-b border-[#111]/10 py-8 pr-4 md:border-b-0 ${i < 3 ? "md:border-r md:border-[#111]/10" : ""}`}
                >
                  <p className="mb-6 text-xl font-black text-[#FC5230] md:pl-5">{step}</p>
                  <h3 className="mb-2 font-black md:pl-5">{title}</h3>
                  <p className="text-sm leading-7 text-[#111]/40 md:pl-5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11 CALCULATOR ── */}
        <section id="calculator" className="bg-[#F2F2F0]">
          <BoxingCalculator />
        </section>

        {/* ── 12 FAQ ── */}
        <FaqSection />

        {/* ── 13 NEWS ── */}
        <section id="news" className="bg-white px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-[#111]/30">NEWS & REVIEW</p>
                <h2 className="reveal d1 text-[clamp(32px,4.5vw,60px)] font-black leading-[0.9] tracking-[-0.05em]">
                  지점별 소식과 후기.
                </h2>
              </div>
              <a href="/blog" className="text-xs font-black text-[#111]/30 transition hover:text-[#111]">전체 보기 →</a>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid gap-px bg-[#111]/[0.06] md:grid-cols-3">
                {latestPosts.map((post: any) => {
                  const image = getFirstImage(post.content);
                  return (
                    <a key={post.id} href={`/blog/${post.slug}`}
                      className="group bg-white transition hover:bg-[#F2F2F0]">
                      {image && (
                        <div className="h-44 overflow-hidden">
                          <img src={encodeURI(image)} alt={post.title}
                            className="h-full w-full object-cover object-[center_30%] grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-7">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="bg-[#111] px-3 py-1 text-[11px] font-black text-white">{post.branch_name}</span>
                          <span className="text-xs text-[#111]/25">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="mb-2 text-lg font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
                        <p className="line-clamp-2 text-sm leading-7 text-[#111]/40">{post.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="border border-[#111]/[0.06] p-10 text-center">
                <p className="text-[#111]/30">곧 업데이트될 예정입니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── 14 BRANCH MAP ── */}
        <BranchMap />

        {/* ── 15 GALLERY ── */}
        <GallerySection />

        {/* ── 16 CERTIFICATIONS ── */}
        <section className="border-t border-[#111]/[0.06] bg-[#F2F2F0] px-6 py-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-center gap-6">
              <p className="text-[10px] font-black tracking-[0.35em] text-[#111]/30">CERTIFIED GYM</p>
              <p className="text-xs font-black text-[#FC5230]">프로복싱 4개 단체 가입 · 승단 심사 가능</p>
            </div>
            <div className="flex flex-wrap items-center gap-8 border-b border-[#111]/10 pb-8">
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
                    <p className="text-[11px] text-[#111]/30">{org.full}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 pt-7 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img src="/images/boxing-orgs/kaba.jpg" alt="대한생활체육복싱협회" className="h-10 w-10 object-contain" />
                <div>
                  <p className="text-[10px] text-[#111]/30">KOREA AMATEUR BOXING ASSOCIATION</p>
                  <p className="text-sm font-black">대한생활체육복싱협회</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-xs text-[#111]/40">
                <span className="border border-[#FC5230] px-3 py-1.5 text-[11px] font-black text-[#FC5230]">승단 심사 가능</span>
                <span>✔ 체육관 자체 승단 심사 가능</span>
                <span>✔ 공인 단증 취득 가능</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 17 CTA ── */}
        <section className="bg-[#2B2B2B] px-6 py-24 text-white md:px-12 md:py-36">
          <div className="mx-auto max-w-5xl">
            <h2 className="reveal mb-8 text-[clamp(44px,7vw,100px)] font-black leading-[0.9] tracking-[-0.06em]">
              첫 운동을<br />시작해보세요.
            </h2>
            <p className="reveal d1 mb-10 max-w-lg text-lg leading-9 text-white/40">
              가까운 지점에서 상담받고, 내 체력에 맞는 복싱 루틴으로 시작하세요.
            </p>
            <ReservationButton className="reveal d2 inline-block rounded-full border border-white/20 px-8 py-4 text-sm font-black text-white transition hover:bg-white hover:text-[#111]">
              무료 체험 신청하기 →
            </ReservationButton>
          </div>
        </section>

        {/* ── 18 PRICING ── */}
        <section className="bg-[#F2F2F0] px-6 py-14 md:px-12">
          <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black tracking-[0.35em] text-[#111]/30">PRICING</p>
              <h2 className="text-xl font-black tracking-[-0.04em]">수강료가 궁금하신가요?</h2>
              <p className="mt-1 text-sm text-[#111]/40">지점별·프로그램별로 다르게 운영됩니다. 방문 상담 시 안내해드립니다.</p>
            </div>
            <a href="/reservation"
              className="shrink-0 rounded-full bg-[#111] px-7 py-3.5 text-sm font-black text-white transition hover:bg-[#FC5230]">
              상담 예약하고 문의하기 →
            </a>
          </div>
        </section>

        {/* ── 19 CONSULTATION ── */}
        <ConsultationForm />

        {/* ── 20 AI COACH ── */}
        <AiCoachChat />

        {/* ── SEO (sr-only) ── */}
        <section className="sr-only">
          <h2>스트롱복싱 지점별 복싱장 안내</h2>
          <p>스트롱복싱은 개봉점, 신정점, 목동점, 철산점, 영등포점으로 운영되는 복싱 체육관입니다.
            개봉 복싱, 개봉동 복싱, 구로 복싱, 신정 복싱, 신정동 복싱, 양천구 복싱,
            목동 복싱, 목동 복싱장, 철산 복싱, 철산동 복싱, 광명 복싱,
            영등포 복싱, 영등포구 복싱을 찾는 분들이 방문하고 있습니다.</p>
          <p>초보자 복싱, 여성 복싱, 다이어트 복싱, 직장인 운동, 학생 운동,
            키즈 복싱, 어린이 복싱, 체력 향상 운동, 스트레스 해소 운동을 목적에 맞게 시작할 수 있습니다.</p>
          <h3>개봉점</h3>
          <p>서울 구로구 개봉동 166-5 유원빌딩 지하 1층. 전화번호 02-2060-1279.</p>
          <h3>신정점</h3>
          <p>서울 양천구 신정동 1021-7 태화상가 2층. 전화번호 02-2647-3373.</p>
          <h3>목동점</h3>
          <p>서울 양천구 목동 909-6 우방빌딩 4층. 전화번호 02-2643-5971.</p>
          <h3>철산점</h3>
          <p>경기도 광명시 철산동 56-14 3층. 전화번호 02-2066-0406.</p>
          <h3>영등포점</h3>
          <p>서울 영등포구 도림로 313 건영상가 2층. 전화번호 02-831-9312.</p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#111]/[0.06] bg-[#2B2B2B] px-6 py-14 text-white md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <span className="text-base font-black tracking-widest uppercase text-white">
                Strong Boxing
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {branches.map((b) => (
                <div key={b.slug}>
                  <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-[#FC5230]">{b.name}</p>
                  <p className="text-xs text-white/30">{b.address}</p>
                  <p className="mt-0.5 text-xs text-white/40">{b.phone}</p>
                  <p className="mt-0.5 text-xs text-white/20">{b.hours.join(" / ")}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 border-t border-white/[0.06] pt-6 text-xs text-white/15">
              © 2025 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
