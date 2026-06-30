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
    score: "4.9",
    reviewCount: 229,
    badges: ["초보자 환영", "구로구 복싱"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
    area: "구로구 개봉동",
    desc: "초보자·다이어트 복싱",
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
    area: "양천구 신정동",
    desc: "초보자·여성 회원 운동",
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
    area: "양천구 목동",
    desc: "학생·직장인·다이어트 복싱",
  },
  {
    slug: "cheolsan",
    name: "철산점",
    image: "/images/branches/cheolsan.jpg",
    phone: "02-2066-0406",
    address: "경기도 광명시 철산동 56-14 3층",
    hours: ["월-금 14:00~23:00", "토일 14:00~18:00"],
    review: "새롭게 준비된 스트롱복싱 지점",
    score: "NEW",
    reviewCount: 8,
    badges: ["신규 지점", "광명 복싱"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "",
    naverMap: "",
    area: "광명 철산동",
    desc: "성인·직장인·주말 운영",
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
    area: "영등포 도림동",
    desc: "퇴근 후 복싱 트레이닝",
  },
];

const routine = [
  ["01", "몸풀기", "운동 전 몸을 깨우는 준비"],
  ["02", "줄넘기 3R", "복싱 리듬과 기초 체력"],
  ["03", "기본자세 & 스텝", "자세, 중심, 발 움직임"],
  ["04", "미트 트레이닝", "코치와 1:1로 타격 감각"],
  ["05", "샌드백", "펀치, 파워, 지구력"],
  ["06", "체력운동", "마지막까지 확실하게"],
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
      <main className="bg-[#f7f4ef] text-[#111]">
        <RevealObserver />

        {/* ── HEADER ── */}
        <header className="fixed left-0 top-0 z-50 w-full border-b border-black/[0.06] bg-[#f7f4ef]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2">
              <img src="/icon.png" alt="스트롱복싱" className="h-8 w-8 object-contain" />
              <span className="text-base font-black tracking-tight leading-none">
                STRONG<span className="text-[#e94124]">BOXING</span>
              </span>
            </a>
            <nav className="hidden items-center gap-8 text-xs font-black tracking-[0.12em] text-black/40 md:flex">
              <ScrollLink targetId="routine" className="transition hover:text-black">ROUTINE</ScrollLink>
              <ScrollLink targetId="branch" className="transition hover:text-black">LOCATIONS</ScrollLink>
              <a href="/blog" className="transition hover:text-black">후기/소식</a>
            </nav>
            <ReservationButton className="rounded-full bg-[#e94124] px-5 py-2.5 text-sm font-black text-white">
              방문 상담 예약
            </ReservationButton>
          </div>
        </header>

        {/* ── 01 HERO ── */}
        <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-24 md:px-16">
          {/* right photo block */}
          <div className="absolute bottom-0 right-0 hidden h-[72vh] w-[46vw] md:block">
            <img
              src="/images/gallery/gallery-1.jpg"
              alt="스트롱복싱 운동 모습"
              className="h-full w-full object-cover grayscale"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-[#f7f4ef]/60" />
          </div>

          <p className="relative z-10 pt-4 text-[10px] font-black tracking-[0.4em] text-black/20">
            BOXING TRAINING CLUB · SEOUL & GWANGMYEONG
          </p>

          <div className="relative z-10 max-w-4xl">
            <p className="mb-7 text-xs font-black tracking-[0.35em] text-[#e94124]">
              STRONG BOXING
            </p>
            <h1 className="text-[clamp(52px,10vw,140px)] font-black leading-[0.92] tracking-[-0.07em]">
              처음이어도,<br />
              운동은<br />
              이어집니다.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-8 text-black/50">
              정해진 수업시간 없이 운영시간 내 방문하면 운동을 시작할 수 있습니다.<br />
              코치가 체력과 목표에 맞춰 루틴을 조절합니다.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ReservationButton className="rounded-full bg-[#111] px-7 py-4 text-sm font-black text-white transition hover:bg-[#e94124]">
                가까운 지점 예약하기
              </ReservationButton>
              <a href="#routine"
                className="rounded-full border border-black/20 px-7 py-4 text-sm font-black text-black transition hover:border-black">
                루틴 보기
              </a>
            </div>
          </div>

          <p className="relative z-10 text-[10px] font-black tracking-[0.4em] text-black/20">SCROLL</p>
        </section>

        {/* ── 02 HOW WE TRAIN ── */}
        <section className="bg-white px-6 py-28 md:px-16 md:py-40">
          <div className="mx-auto max-w-7xl grid items-end gap-16 md:grid-cols-2">
            <div>
              <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">HOW WE TRAIN</p>
              <h2 className="reveal d1 text-[clamp(40px,6.5vw,88px)] font-black leading-[0.92] tracking-[-0.06em]">
                수업시간에<br />맞추는 복싱이<br />아닙니다.
              </h2>
            </div>
            <div>
              <p className="reveal d2 text-xl leading-9 text-black/50">
                스트롱복싱은 운영시간 내 원하는 시간에 방문하면 바로 운동을 시작할 수 있습니다.
                모든 회원이 같은 운동을 강제로 하는 방식이 아니라,
                컨디션과 목표에 맞춰 루틴을 조절합니다.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {["초보자 가능", "다이어트 복싱", "코치 직접 지도"].map((tag) => (
                  <span key={tag} className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-black text-black/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 STRONG ROUTINE ── */}
        <section id="routine" className="bg-[#111] px-6 py-28 text-white md:px-16 md:py-40">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20">
              <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">STRONG ROUTINE</p>
              <h2 className="reveal d1 text-[clamp(48px,8vw,120px)] font-black leading-[0.9] tracking-[-0.07em]">
                하루 운동은<br />이렇게<br />이어집니다.
              </h2>
              <p className="reveal d2 mt-8 text-lg text-white/40">
                아프거나 어려운 동작은 다른 운동으로 대체합니다.
              </p>
            </div>

            <div className="border-t border-white/10">
              {routine.map(([no, title, desc], i) => (
                <div
                  key={no}
                  className={`reveal d${Math.min(i + 1, 5)} grid items-center gap-6 border-b border-white/10 py-8 md:grid-cols-[120px_1fr_1fr]`}
                >
                  <p className="text-2xl font-black text-[#e94124]">{no}</p>
                  <h3 className="text-[clamp(28px,4vw,52px)] font-black tracking-[-0.05em]">{title}</h3>
                  <p className="text-lg text-white/40">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 BRANCHES ── */}
        <section id="branch" className="bg-[#f7f4ef] px-6 py-28 md:px-16 md:py-40">
          <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">5 LOCATIONS</p>
              <h2 className="reveal d1 text-[clamp(44px,6vw,80px)] font-black leading-[0.92] tracking-[-0.06em]">
                가까운<br />동네에서<br />시작하세요.
              </h2>
              <a href="/reservation"
                className="mt-10 inline-block border-b border-black pb-1 text-sm font-black transition hover:text-[#e94124] hover:border-[#e94124]">
                지점별 방문 상담 예약 →
              </a>
            </div>

            <div className="divide-y divide-black/10">
              {branches.map((b, i) => (
                <a
                  key={b.slug}
                  href={`/branches/${b.slug}`}
                  className={`reveal d${Math.min(i + 1, 5)} group grid items-center gap-4 py-7 transition md:grid-cols-[160px_1fr_80px]`}
                >
                  <h3 className="text-2xl font-black tracking-[-0.04em] transition group-hover:text-[#e94124]">
                    {b.name}
                  </h3>
                  <p className="text-black/50 text-sm">
                    {b.area} · {b.desc}
                  </p>
                  <span className="text-[#e94124] font-black text-sm transition group-hover:translate-x-1 group-hover:opacity-100 opacity-0 md:opacity-100">
                    VIEW →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 COACHES ── */}
        <section className="bg-white px-6 py-28 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">COACH</p>
            <h2 className="reveal d1 mb-16 text-[clamp(44px,6vw,80px)] font-black leading-[0.92] tracking-[-0.06em]">
              직접 가르치는<br />전문 코치진.
            </h2>

            <a
              href="https://www.instagram.com/strongboxing_official"
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-px flex flex-col overflow-hidden md:flex-row"
            >
              <div className="h-64 w-full shrink-0 overflow-hidden md:h-72 md:w-72">
                <img src="/images/coaches/hansol.jpg" alt="한솔 대표"
                  className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col justify-end bg-[#f7f4ef] p-10">
                <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-[#e94124]">REPRESENTATIVE</p>
                <h3 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">한솔 대표</h3>
                <p className="mt-2 text-black/50">스트롱복싱 대표 · 전 지점 총괄</p>
              </div>
            </a>

            <div className="mt-px grid gap-px bg-black/5 md:grid-cols-3">
              {[
                { branch: "개봉점", name: "안진호", role: "관장", instagram: "dkswkd3" },
                { branch: "신정점", name: "유상혁", role: "관장", instagram: "robuste_hyeok" },
                { branch: "신정점", name: "정동주", role: "코치", instagram: "jdj_00_" },
                { branch: "목동점", name: "송재용", role: "관장", instagram: "nan_yong_" },
                { branch: "목동점", name: "양승호", role: "코치", instagram: "qortor0_0" },
                { branch: "철산점", name: "안도연", role: "코치", instagram: "strongboxing_andy" },
              ].map((coach) => (
                <a
                  key={coach.name}
                  href={`https://www.instagram.com/${coach.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white p-7 transition hover:bg-[#f7f4ef]"
                >
                  <p className="mb-2 text-[10px] font-black tracking-[0.25em] text-[#e94124]">{coach.branch}</p>
                  <h3 className="text-lg font-black">
                    {coach.name} <span className="font-normal text-black/40 text-sm">{coach.role}</span>
                  </h3>
                  <p className="mt-1 text-xs text-black/30 transition group-hover:text-black/50">
                    @{coach.instagram}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 REELS ── */}
        <ReelsSection />

        {/* ── 07 PROGRAM ── */}
        <section id="program" className="bg-white px-6 py-28 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">PROGRAM</p>
            <h2 className="reveal d1 mb-16 text-[clamp(44px,6vw,80px)] font-black leading-[0.92] tracking-[-0.06em]">
              복싱은 어렵지 않게,<br />운동은 확실하게.
            </h2>
            <div className="grid gap-px bg-black/5 md:grid-cols-3">
              {[
                ["복싱 입문", "기본자세, 스텝, 펀치부터 차근차근. 처음 오는 날부터 바로 배웁니다."],
                ["다이어트 복싱", "재밌게 땀나는 복싱 트레이닝. 지루하지 않게 운동량을 높입니다."],
                ["코치 직접 지도", "목적에 맞춘 밀착 트레이닝. 오늘의 컨디션에 맞게 조절합니다."],
              ].map(([title, desc], i) => (
                <div key={title} className={`reveal d${i + 1} bg-white border-t-4 border-t-[#e94124] p-9`}>
                  <h3 className="mb-5 text-2xl font-black tracking-[-0.04em]">{title}</h3>
                  <p className="leading-8 text-black/50">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 08 REVIEWS ── */}
        <section className="bg-[#f7f4ef] px-6 py-28 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">REAL REVIEWS</p>
            <h2 className="reveal d1 mb-16 text-[clamp(44px,6vw,80px)] font-black leading-[0.92] tracking-[-0.06em]">
              실제 회원들의<br />솔직한 후기.
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["개봉점", "처음인데도 자세를 하나하나 알려주셔서 재밌게 운동했어요."],
                ["신정점", "운동량이 확실하고, 코치님들이 친절해서 꾸준히 다니고 있어요."],
                ["목동점", "정해진 수업시간이 없어서 퇴근 후에도 부담 없이 갈 수 있어요."],
              ].map(([branch, review], i) => (
                <div key={i} className={`reveal d${i + 1} bg-white p-9 rounded-3xl`}>
                  <div className="mb-1 text-[10px] font-black tracking-[0.25em] text-[#e94124]">{branch}</div>
                  <div className="mb-6 text-yellow-500">★★★★★</div>
                  <p className="text-lg leading-8">{review}</p>
                  <p className="mt-8 text-xs text-black/30 font-black tracking-widest">NAVER REVIEW</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 09 NAVER REVIEWS ── */}
        <NaverReviewsSection />

        {/* ── 10 FIRST VISIT ── */}
        <section className="bg-white px-6 py-28 md:px-16">
          <div className="mx-auto max-w-7xl">
            <p className="reveal mb-6 text-[10px] font-black tracking-[0.35em] text-[#e94124]">FIRST VISIT</p>
            <h2 className="reveal d1 mb-16 text-[clamp(36px,5vw,64px)] font-black leading-[0.92] tracking-[-0.06em]">
              처음 오면 어떻게 되나요?
            </h2>
            <div className="grid border-t border-black/10 md:grid-cols-4">
              {[
                ["01", "방문 상담 예약", "홈페이지나 네이버로 간단히 예약"],
                ["02", "체육관 방문", "편한 복장으로 방문하시면 돼요"],
                ["03", "코치와 1:1 상담", "목적·체력·일정 맞춤 안내"],
                ["04", "바로 운동 시작", "당일 체험도 가능합니다"],
              ].map(([step, title, desc], i) => (
                <div
                  key={step}
                  className={`reveal d${i + 1} border-b border-black/10 py-9 pr-6 md:border-b-0 ${i < 3 ? "md:border-r md:border-black/10" : ""}`}
                >
                  <p className="mb-7 text-2xl font-black text-[#e94124] md:pl-6">{step}</p>
                  <h3 className="mb-2 text-xl font-black md:pl-6">{title}</h3>
                  <p className="text-sm leading-7 text-black/50 md:pl-6">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <ReservationButton className="rounded-full bg-[#e94124] px-8 py-4 text-sm font-black text-white transition hover:brightness-110">
                지금 시작하기
              </ReservationButton>
            </div>
          </div>
        </section>

        {/* ── 11 CALCULATOR ── */}
        <section id="calculator" className="bg-[#f7f4ef]">
          <BoxingCalculator />
        </section>

        {/* ── 12 FAQ ── */}
        <FaqSection />

        {/* ── 13 NEWS ── */}
        <section id="news" className="bg-white px-6 py-28 md:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="reveal mb-4 text-[10px] font-black tracking-[0.35em] text-[#e94124]">NEWS & REVIEW</p>
                <h2 className="reveal d1 text-[clamp(36px,5vw,64px)] font-black leading-[0.92] tracking-[-0.06em]">
                  지점별 소식과 후기.
                </h2>
              </div>
              <a href="/blog" className="text-xs font-black text-black/40 transition hover:text-black">
                전체 보기 →
              </a>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid gap-px bg-black/5 md:grid-cols-3">
                {latestPosts.map((post: any) => {
                  const image = getFirstImage(post.content);
                  return (
                    <a key={post.id} href={`/blog/${post.slug}`}
                      className="group bg-white transition hover:bg-[#f7f4ef]">
                      {image && (
                        <div className="h-44 overflow-hidden">
                          <img src={encodeURI(image)} alt={post.title}
                            className="h-full w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="p-8">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="bg-[#e94124] px-3 py-1 text-[11px] font-black text-white">
                            {post.branch_name}
                          </span>
                          <span className="text-xs text-black/30">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="mb-3 text-xl font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
                        <p className="line-clamp-2 text-sm leading-7 text-black/50">{post.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="border border-black/10 p-10 text-center">
                <p className="text-black/40">곧 업데이트될 예정입니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── 14 BRANCH MAP ── */}
        <BranchMap />

        {/* ── 15 GALLERY ── */}
        <GallerySection />

        {/* ── 16 CERTIFICATIONS ── */}
        <section className="border-t border-black/[0.06] bg-[#f7f4ef] px-6 py-20 md:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-center gap-6">
              <p className="text-[10px] font-black tracking-[0.35em] text-black/30">CERTIFIED GYM</p>
              <p className="text-sm font-black text-[#e94124]">프로복싱 4개 단체 가입 · 승단 심사 가능</p>
            </div>
            <div className="flex flex-wrap items-center gap-8 border-b border-black/10 pb-10">
              {[
                { src: "/images/boxing-orgs/kbf.jpg", name: "KBF", full: "한국권투연맹" },
                { src: "/images/boxing-orgs/kbm.jpg", name: "KBM", full: "한국복싱커미션" },
                { src: "/images/boxing-orgs/kbc.jpg", name: "KBC", full: "한국권투위원회" },
                { src: "/images/boxing-orgs/kba.jpg", name: "KBA", full: "한국권투협회" },
              ].map((org) => (
                <div key={org.name} className="flex items-center gap-3">
                  <img src={org.src} alt={org.full} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-black">{org.name}</p>
                    <p className="text-[11px] text-black/40">{org.full}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-5 pt-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img src="/images/boxing-orgs/kaba.jpg" alt="대한생활체육복싱협회" className="h-12 w-12 object-contain" />
                <div>
                  <p className="text-[10px] text-black/30">KOREA AMATEUR BOXING ASSOCIATION</p>
                  <p className="text-base font-black">대한생활체육복싱협회</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="border border-[#e94124] px-4 py-2 text-xs font-black text-[#e94124]">승단 심사 가능</span>
                <div className="text-xs text-black/40 space-y-1">
                  <p>✔ 체육관 자체 승단 심사 가능</p>
                  <p>✔ 공인 단증 취득 가능</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 17 CTA ── */}
        <section className="bg-[#e94124] px-6 py-28 text-white md:px-16 md:py-40">
          <div className="mx-auto max-w-7xl grid items-end gap-12 md:grid-cols-2">
            <h2 className="reveal text-[clamp(52px,8vw,112px)] font-black leading-[0.9] tracking-[-0.07em]">
              첫 운동을<br />시작해보세요.
            </h2>
            <div>
              <p className="reveal d1 mb-10 text-xl leading-9 text-white/70">
                가까운 지점에서 상담받고,<br />내 체력에 맞는 복싱 루틴으로 시작하세요.
              </p>
              <ReservationButton className="inline-block rounded-full bg-white px-8 py-5 font-black text-[#e94124] transition hover:bg-[#111] hover:text-white">
                방문 상담 예약하기 →
              </ReservationButton>
            </div>
          </div>
        </section>

        {/* ── 18 PRICING ── */}
        <section className="bg-[#f7f4ef] px-6 py-16 md:px-16">
          <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black tracking-[0.35em] text-black/30">PRICING</p>
              <h2 className="text-2xl font-black tracking-[-0.04em]">수강료가 궁금하신가요?</h2>
              <p className="mt-2 text-sm leading-7 text-black/50">
                수강료는 지점별·프로그램별로 다르게 운영됩니다. 방문 상담 시 안내해드립니다.
              </p>
            </div>
            <a href="/reservation"
              className="shrink-0 rounded-full bg-[#111] px-7 py-4 text-sm font-black text-white transition hover:bg-[#e94124]">
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
        <footer className="border-t border-black/[0.06] bg-[#111] px-6 py-16 text-white md:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <span className="text-lg font-black tracking-tight">
                STRONG<span className="text-[#e94124]">BOXING</span>
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {branches.map((b) => (
                <div key={b.slug}>
                  <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-[#e94124]">{b.name}</p>
                  <p className="text-xs text-white/40">{b.address}</p>
                  <p className="mt-0.5 text-xs text-white/50">{b.phone}</p>
                  <p className="mt-0.5 text-xs text-white/25">{b.hours.join(" / ")}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 border-t border-white/[0.06] pt-8 text-xs text-white/20">
              © 2025 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
