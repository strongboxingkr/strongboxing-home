import BoxingCalculator from "./components/BoxingCalculator";
import { db } from "@/lib/db";
import ConsultationForm from "./components/ConsultationForm";
import ScrollLink from "./components/ScrollLink";
import ReservationButton from "./components/ReservationButton";
import AiCoachChat from "./components/AiCoachChat";
import FaqSection from "./components/FaqSection";
import ReelsSection from "./components/ReelsSection";
//import SplashScreen from "./components/SplashScreen";
import NaverReviewsSection from "./components/NaverReviewsSection";
import GallerySection from "./components/GallerySection";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "스트롱복싱 | 복싱 PT · 다이어트 복싱 · 체력증진",
  description:
    "서울 복싱장 스트롱복싱. 철산·개봉·목동·신정·영등포 5개 지점 운영. 초보자 환영, 복싱 PT, 다이어트 복싱, 체력증진 프로그램. 네이버 평점 4.9.",
  alternates: {
    canonical: "https://strongboxing.kr",
  },
  openGraph: {
    title: "스트롱복싱 | 복싱 PT · 다이어트 복싱 · 체력증진",
    description:
      "서울 5개 지점 운영 복싱짐. 초보자부터 다이어트, PT까지. 네이버 평점 4.9.",
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
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
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
    review: "새롭게 준비된 스트롱복싱 지점",
    score: "NEW",
    reviewCount: 8,
    badges: ["신규 지점", "광명 복싱"],
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
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
  },
];

export default async function HomePage() {
  const [rows]: any = await db.query(`
    SELECT id, title, slug, description, branch_name, created_at
    FROM homepage_posts
    ORDER BY created_at DESC
    LIMIT 3
  `);

  const latestPosts = rows;

  return (

     <>
    {/*<SplashScreen />*/}

    <main className="min-h-screen bg-[#16171A] text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#16171A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="스트롱복싱"
              className="h-9 w-9 object-contain"
            />
            <span className="text-lg font-black tracking-tight">
              STRONG<span className="text-[#FC5230]">BOXING</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-bold text-zinc-300 md:flex">
            <ScrollLink targetId="branch" className="transition hover:text-[#FC5230]">
              지점
            </ScrollLink>
            <ScrollLink targetId="program" className="transition hover:text-[#FC5230]">
              프로그램
            </ScrollLink>
            <a href="/blog" className="transition hover:text-[#FC5230]">
              후기/소식
            </a>
          </nav>

          <ReservationButton className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black">
            방문 상담 예약
          </ReservationButton>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pt-24 pb-16 md:px-6">
        <img
          src="/images/gallery/gallery-1.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#16171A]/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(252,82,48,.10),transparent_30%)]" />

        <div className="relative z-10 mx-auto grid min-h-[76vh] max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-black tracking-[0.32em] text-[#FC5230] md:text-sm">
              STRONG BOXING
            </p>

            <h1 className="text-[52px] font-black leading-[0.85] tracking-[-0.08em] md:text-[92px]">
              누구나
              <br />
              시작할 수 있는
              <br />
              복싱
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 md:text-lg md:leading-8">
              처음이어도 괜찮습니다.
              <br />
              스트롱복싱은 운동을 오래 할 수 있는 분위기를 만듭니다.
            </p>

            <div className="mt-9 flex gap-3 overflow-x-auto pb-1 md:overflow-visible">
              <ReservationButton className="shrink-0 rounded-full bg-[#FC5230] px-7 py-4 text-center font-black transition hover:scale-[1.02]">
                방문 상담 예약
              </ReservationButton>

              <a
                href="/blog"
                className="shrink-0 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-center font-black backdrop-blur"
              >
                운동 후기 보기
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {["초보자 가능", "다이어트 복싱", "코치 직접 지도"].map(
                (item) => (
                  <div
                    key={item}
                    className="border border-white/10 bg-[#202126] px-5 py-3 text-sm font-bold text-zinc-300"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div
            id="branch"
            className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0"
          >
            {branches.slice(0, 5).map((branch, index) => (
              <a
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className={`group relative overflow-hidden border border-white/10 bg-[#202126] min-w-[78vw] md:min-w-0 ${
                  index === 0 ? "h-[320px] md:col-span-2" : "h-[250px]"
                }`}
              >
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#16171A] via-[#16171A]/15 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6">
                  <p className="mb-2 text-xs font-black tracking-[0.24em] text-[#FC5230]">
                    STRONG BOXING
                  </p>
                  <h3 className="text-4xl font-black tracking-[-0.06em]">
                    {branch.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-zinc-100">
                    ★ {branch.score} · 네이버 리뷰 {branch.reviewCount}개
                  </p>

                  <p className="mt-1 line-clamp-1 text-sm text-zinc-300">
                    {branch.review}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {branch.badges?.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 inline-flex rounded-full bg-[#FC5230] px-4 py-2 text-xs font-black text-white">
                    지점 자세히 보기 →
                  </p>

                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="program" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
                PROGRAM
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                복싱은 어렵지 않게,
                <br />
                운동은 확실하게.
              </h2>
            </div>
            <p className="max-w-md leading-8 text-zinc-400">
              처음 배우는 자세부터 다이어트, 체력향상, 스트레스 해소까지
              목적에 맞는 수업으로 진행합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "복싱 입문", "기본자세, 스텝, 펀치부터 차근차근"],
              ["02", "다이어트 복싱", "재밌게 땀나는 그룹 복싱 수업"],
              ["03", "코치 직접 지도", "목적에 맞춘 밀착 트레이닝"],
            ].map(([num, title, desc]) => (
              <div
                key={num}
                className="border border-white/10 bg-[#202126] p-8 transition hover:border-[#FC5230]"
              >
                <p className="mb-10 text-sm font-black text-[#FC5230]">
                  {num}
                </p>
                <h3 className="mb-4 text-3xl font-black tracking-[-0.05em]">
                  {title}
                </h3>
                <p className="leading-7 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE TRAIN 섹션 */}
      <section className="px-6 py-28 bg-[#111214]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">HOW WE TRAIN</p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
              정해진 수업 시간이
              <br />
              없습니다
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              운영시간 내 편하신 시간에 방문하시면 바로 운동을 시작할 수 있어요.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="border border-white/10 bg-[#202126] p-8">
              <p className="mb-4 text-xs font-black tracking-[0.2em] text-[#FC5230]">MY SCHEDULE</p>
              <h3 className="mb-4 text-3xl font-black tracking-[-0.05em]">내 시간에 맞게</h3>
              <p className="mb-7 leading-8 text-zinc-400">
                수업 예약 없이, 운영시간 내 언제든 방문하면 바로 운동 시작.
                직장인, 주부, 학생 모두 가능합니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-[#FC5230]/40 bg-[#FC5230]/10 px-4 py-2 text-sm font-black text-[#FC5230]">BEGINNER FRIENDLY</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-zinc-300">개인별 진행</span>
              </div>
            </div>

            <div className="border border-white/10 bg-[#202126] p-8">
              <p className="mb-4 text-xs font-black tracking-[0.2em] text-[#FC5230]">PROGRAM</p>
              <h3 className="mb-6 text-3xl font-black tracking-[-0.05em]">1회 운동 구성</h3>
              <div className="flex flex-col gap-4">
                {[
                  ["몸풀기", "스트레칭 & 워밍업"],
                  ["줄넘기 3R", "기초 체력 훈련"],
                  ["기초자세 & 스텝", "복싱 기본기"],
                  ["미트트레이닝", "코치와 1:1 실전"],
                  ["샌드백", "파워 & 지구력"],
                  ["체력운동", "코어 마무리"],
                ].map(([step, desc], i) => (
                  <div key={step} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="w-5 shrink-0 text-xs font-black text-[#FC5230]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-black">{step}</span>
                    <span className="ml-auto text-sm text-zinc-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-6 border border-[#FC5230] bg-[#202126] p-8 sm:flex-row">
            <p className="text-xl font-black">운영시간 내 언제든 시작 가능!</p>
            <a
              href="/#branch"
              className="shrink-0 border border-[#FC5230] px-7 py-4 text-sm font-black text-[#FC5230]"
            >
              지점 운영시간 확인 →
            </a>
          </div>
        </div>
      </section>

      {/* 코치 소개 섹션 */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
              COACH
            </p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
              직접 가르치는
              <br />
              전문 코치진.
            </h2>
          </div>

          {/* 대표 */}
          <a
            href="https://www.instagram.com/strongboxing_official"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 flex flex-col overflow-hidden border border-[#FC5230]/40 bg-[#1a1a1c] transition hover:border-[#FC5230] md:flex-row"
          >
            <div className="h-64 w-full shrink-0 md:h-auto md:w-64">
              <img src="/images/coaches/hansol.jpg" alt="한솔 대표" className="h-full w-full object-cover object-top" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-4 p-10">
              <p className="text-sm font-black tracking-[0.35em] text-[#FC5230]">REPRESENTATIVE</p>
              <h3 className="text-5xl font-black tracking-[-0.05em]">한솔 대표</h3>
              <p className="text-zinc-400">스트롱복싱 대표 · 전 지점 총괄</p>
            </div>
          </a>

          {/* 지점별 코치 */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { branch: "개봉점", name: "안진호", role: "관장", instagram: "dkswkd3" },
              { branch: "신정점", name: "유상혁", role: "관장", instagram: "robuste_hyeok" },
              { branch: "신정점", name: "정동주", role: "코치", instagram: "jdj_00_" },
              { branch: "목동점", name: "송재용", role: "관장", instagram: "nan_yong_" },
              { branch: "목동점", name: "양승호", role: "코치", instagram: "qortor0_0" },
              { branch: "철산점", name: "안도연", role: "코치", instagram: "andxyexn" },
            ].map((coach) => (
              <a
                key={coach.name}
                href={`https://www.instagram.com/${coach.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 bg-[#202126] p-6 transition hover:border-[#FC5230]"
              >
                <p className="mb-1 text-xs font-black tracking-[0.2em] text-[#FC5230]">{coach.branch}</p>
                <h3 className="mb-2 text-xl font-black tracking-[-0.03em]">{coach.name} {coach.role}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ReelsSection />

      <NaverReviewsSection />

      <section id="calculator" className="bg-[#111214]">
        <BoxingCalculator />
      </section>

      <FaqSection />

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
              STRONG SPACE
            </p>
            <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
              사진으로 먼저 보는
              <br />
              스트롱복싱의 공간.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="overflow-hidden border border-white/10">
              <img
                src="/images/gallery/gallery-1.jpg"
                alt="시설"
                className="h-full min-h-[520px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div className="grid gap-4">
              <div className="overflow-hidden border border-white/10">
                <img
                  src="/images/gallery/gallery-2.jpg"
                  alt="시설"
                  className="h-[250px] w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <img
                  src="/images/gallery/gallery-3.jpg"
                  alt="시설"
                  className="h-[250px] w-full border border-white/10 object-cover"
                />
                <img
                  src="/images/gallery/gallery-4.jpg"
                  alt="시설"
                  className="h-[250px] w-full border border-white/10 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[
            ["4.9", "평균 리뷰 만족도"],
            ["5", "운영 지점"],
            ["VISIT", "방문 상담 예약"],
            ["BEGINNER", "초보자 가능"],
          ].map(([num, text]) => (
            <div
              key={num}
              className="border border-white/10 bg-[#202126] p-8"
            >
              <p className="text-5xl font-black tracking-[-0.06em] text-[#FC5230]">
                {num}
              </p>
              <p className="mt-4 font-bold text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-32">
        <img
          src="/images/gallery/gallery-1.jpg"
          alt="스트롱복싱"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#16171A]/80" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            STRONG BOXING
          </p>
          <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.07em] md:text-8xl">
            스트롱복싱에서
            <br />
            첫 운동을 시작해보세요.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            가까운 지점에서 편하게 상담받고 운동을 시작해보세요.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <ReservationButton className="bg-[#FC5230] px-9 py-5 text-lg font-black">
            방문 상담 예약하기
            </ReservationButton>
            <a
              href="/blog"
              className="border border-white/20 bg-white/10 px-9 py-5 text-lg font-black backdrop-blur"
            >
              운동 후기 보기
            </a>
          </div>
        </div>
      </section>

      <section id="news" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
                NEWS & REVIEW
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                지점별 소식과 후기.
              </h2>
            </div>
            <a href="/blog" className="font-black text-[#FC5230]">
              전체 글 보기 →
            </a>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {latestPosts.map((post: any) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="border border-white/10 bg-[#202126] p-8 transition hover:border-[#FC5230]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="bg-[#FC5230] px-4 py-2 text-sm font-black">
                      {post.branch_name}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mb-4 text-3xl font-black leading-tight tracking-[-0.05em]">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 leading-7 text-zinc-400">
                    {post.description}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 bg-[#202126] p-10 text-center">
              <h3 className="mb-3 text-2xl font-black">소식 준비중</h3>
              <p className="text-zinc-400">
                곧 지점별 운동 소식과 후기를 업데이트할 예정입니다.
              </p>
            </div>
          )}
        </div>
      </section>

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
        <p>
          서울 구로구 개봉동 166-5 유원빌딩 지하 1층.
          개봉 복싱, 개봉동 복싱장, 구로 복싱, 개봉 다이어트 복싱.
          운영시간 월요일부터 금요일 13시부터 23시까지.
          전화번호 02-2060-1279.
        </p>

        <h3>신정점</h3>
        <p>
          서울 양천구 신정동 1021-7 태화상가 2층.
          신정 복싱, 신정동 복싱장, 양천구 복싱, 신정 다이어트 복싱.
          운영시간 평일 10시부터 24시까지, 14시부터 15시까지 휴게,
          토요일 10시부터 16시까지.
          전화번호 02-2647-3373.
        </p>

        <h3>목동점</h3>
        <p>
          서울 양천구 목동 909-6 우방빌딩 4층.
          목동 복싱, 목동 복싱장, 양천구 복싱, 목동 다이어트 복싱,
          목동 여성 복싱, 목동 직장인 운동.
          운영시간 평일 14시부터 24시까지, 토요일 11시부터 16시까지.
          전화번호 02-2643-5971.
        </p>

        <h3>철산점</h3>
        <p>
          경기도 광명시 철산동 56-14 3층.
          철산 복싱, 철산동 복싱장, 광명 복싱, 광명 다이어트 복싱,
          철산역 복싱, 철산 여성 복싱.
          운영시간 평일 14시부터 23시까지, 토요일과 일요일 14시부터 18시까지.
          전화번호 02-2066-0406.
        </p>

        <h3>영등포점</h3>
        <p>
          서울 영등포구 도림로 313 건영상가 2층.
          영등포 복싱, 영등포구 복싱장, 영등포 다이어트 복싱,
          영등포 직장인 운동, 도림동 복싱.
          운영시간 평일 13시부터 23시까지.
          전화번호 02-831-9312.
        </p>

        <h2>스트롱복싱 운동 영상</h2>
        <p>
          스트롱복싱 운동 영상은 철산 복싱, 광명 복싱, 목동 복싱,
          신정동 복싱, 개봉동 복싱, 영등포 복싱, 여성 복싱,
          초보자 복싱, 다이어트 복싱, 체력 향상 운동 모습을 담고 있습니다.
        </p>
      </section>

      <GallerySection />

      {/* 공인 단체 섹션 */}
      <section className="border-t border-white/10 bg-[#111214] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-black tracking-[0.35em] text-[#FC5230]">CERTIFIED GYM</p>
            <h2 className="mb-4 text-3xl font-black tracking-[-0.05em] md:text-4xl">
              프로복싱 <span className="text-[#FC5230]">4개 단체</span> 가입 체육관
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
              <span>✔ 프로테스트 참가 가능</span>
              <span>✔ 각종 대회 참가 가능</span>
              <span>✔ 선수 등록 및 활동 가능</span>
            </div>
          </div>

          <div className="mb-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { src: "/images/boxing-orgs/kbf.jpg", name: "KBF", full: "한국권투연맹" },
              { src: "/images/boxing-orgs/kbm.jpg", name: "KBM", full: "한국복싱커미션" },
              { src: "/images/boxing-orgs/kbc.jpg", name: "KBC", full: "한국권투위원회" },
              { src: "/images/boxing-orgs/kba.jpg", name: "KBA", full: "한국권투협회" },
            ].map((org) => (
              <div key={org.name} className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <img src={org.src} alt={org.full} className="h-20 w-20 rounded-full object-cover" />
                <div className="text-center">
                  <p className="text-lg font-black">{org.name}</p>
                  <p className="text-xs text-zinc-400">{org.full}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 overflow-hidden border border-white/10 bg-[#1a1a1c] p-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-5">
              <img src="/images/boxing-orgs/kaba.jpg" alt="대한생활체육복싱협회" className="h-20 w-20 object-contain" />
              <div>
                <p className="text-xs text-zinc-400">KOREA AMATEUR BOXING ASSOCIATION</p>
                <p className="text-xl font-black">대한생활체육복싱협회</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="border border-[#FC5230] px-4 py-2 text-sm font-black text-[#FC5230]">승단 심사 체육관</span>
            </div>
            <div className="flex flex-col gap-2 text-sm text-zinc-300">
              <span>✔ 체육관 자체 승단 심사 가능</span>
              <span>✔ 공인 단증 취득 가능</span>
            </div>
          </div>
        </div>
      </section>

      <ConsultationForm />

      <AiCoachChat />

      <footer className="border-t border-white/10 bg-[#0d0d0f] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <span className="text-xl font-black tracking-tight">
              STRONG<span className="text-[#FC5230]">BOXING</span>
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {branches.map((b) => (
              <div key={b.slug}>
                <p className="mb-1 text-xs font-black text-[#FC5230]">{b.name}</p>
                <p className="text-xs text-zinc-500">{b.address}</p>
                <p className="text-xs text-zinc-400">{b.phone}</p>
                <p className="text-xs text-zinc-600">{b.hours.join(" / ")}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 text-xs text-zinc-600">
            © 2025 STRONG BOXING. All rights reserved.
          </div>
        </div>
      </footer>

       </main>
  </>
);
}