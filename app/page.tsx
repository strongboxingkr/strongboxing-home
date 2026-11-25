import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import NaverReviewsClient from "./components/NaverReviewsClient";
import { TabSection } from "./renewal/HomeRenewalClient";
import ReelsClient from "./components/ReelsClient";
import ConsultationForm from "./components/ConsultationForm";
import ReservationButton from "./components/ReservationButton";
import AiCoachChat from "./components/AiCoachChat";
import FaqSection from "./components/FaqSection";
//import SplashScreen from "./components/SplashScreen";
import GallerySection from "./components/GallerySection";
import RevealObserver from "./components/RevealObserver";
import SiteHeader from "./components/SiteHeader";
import FloatingCTA from "./components/FloatingCTA";
import HomeHeroVideo from "./components/HomeHeroVideo";
import PopupBanner from "./components/PopupBanner";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "스트롱복싱 | 서울·경기 복싱장 — 복싱 PT·다이어트 복싱·초보자 복싱" },
  description:
    "서울·경기 5개 지점 복싱장. 다이어트 복싱·복싱 PT·초보자 복싱 수업. 목동·개봉·철산·신정·영등포점 운영. 관장 직접 지도. 원데이 클래스 30,000원.",
  keywords: [
    "복싱","복싱장","복싱 PT","다이어트 복싱","초보자 복싱","여성 복싱","복싱 다이어트","복싱 체육관",
    "목동 복싱","오목교 복싱","양천구 복싱","목동 학생 복싱","목동 다이어트 복싱","목동 직장인 운동",
    "개봉 복싱","개봉동 복싱","고척 복싱","오류동 복싱","구로 복싱","구로구 복싱",
    "철산 복싱","철산동 복싱","광명 복싱","광명 여성 복싱",
    "신정 복싱","신정동 복싱","영등포 복싱","관장 직접 지도","스트레스 해소 복싱",
  ],
  alternates: { canonical: "https://strongboxing.kr" },
  openGraph: {
    title: "스트롱복싱 | 서울·경기 복싱장 — 복싱 PT·다이어트 복싱·초보자 복싱",
    description: "서울·경기 5개 지점 복싱장. 다이어트 복싱·복싱 PT·초보자 복싱 수업. 목동·개봉·철산·신정·영등포점 운영. 관장 직접 지도. 원데이 클래스 30,000원.",
    url: "https://strongboxing.kr",
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "스트롱복싱" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "스트롱복싱 | 서울·경기 복싱장 — 복싱 PT·다이어트 복싱·초보자 복싱",
    description: "서울·경기 5개 지점 복싱장. 다이어트 복싱·복싱 PT·초보자 복싱 수업. 관장 직접 지도. 원데이 클래스 30,000원.",
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
    landmark: "유원빌딩 지하 1층",
    hours: ["평일 13:00–23:00", "토·일 휴무"],
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
    landmark: "신정네거리 · 태화상가 2층",
    hours: ["평일 10:00–24:00 (14:00–15:00 휴게)", "토 10:00–16:00"],
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
    landmark: "우방빌딩 4층",
    hours: ["평일 14:00–24:00 (밤 12시까지)", "토 11:00–16:00", "일 휴무"],
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
    landmark: "메가커피 광명위브점 건물 3층",
    hours: ["평일 14:00–23:00", "토·일 14:00–18:00", "공휴일 휴무"],
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
    landmark: "건영상가 2층",
    hours: ["평일 13:00–23:00", "주말 운영 여부는 지점 문의"],
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

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "스트롱복싱",
    url: "https://strongboxing.kr",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://strongboxing.kr/blog?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "복싱 처음 시작하는데 괜찮나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "네, 스트롱복싱은 초보자 전용 커리큘럼을 운영합니다. 기초 자세·스텝·펀치부터 단계별로 배울 수 있어 운동 경험이 없어도 부담 없이 시작할 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "복싱 다이어트 효과가 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "복싱은 1시간에 600~800kcal를 소모하는 고강도 유산소 운동입니다. 전신 근육을 사용해 체지방 감소와 기초대사량 향상에 매우 효과적입니다.",
        },
      },
      {
        "@type": "Question",
        name: "스트롱복싱 지점은 어디에 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "서울·경기 5개 지점을 운영합니다. 개봉점(구로구), 신정점(양천구), 목동점(양천구), 철산점(광명시), 영등포점(영등포구)입니다.",
        },
      },
      {
        "@type": "Question",
        name: "방문 상담은 무료인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "네, 방문 상담은 무료입니다. 홈페이지에서 희망 지점과 날짜를 선택해 예약하시면 담당 코치가 운동 목적에 맞게 안내해드립니다.",
        },
      },
    ],
  },
];

type StoryPost = RowDataPacket & { id: number; title: string; slug: string; description: string | null; branch_name: string; category: string | null };
type StoryReel = RowDataPacket & { id: number; branch_name: string; title: string; aria_label: string | null; video_url: string; poster?: string };
type StoryReview = RowDataPacket & { id: number; branch_name: string; reviewer_name: string | null; content: string; image_url: string | null; review_date: string | null };

async function loadStoryRows<T extends RowDataPacket>(sql: string, legacySql?: string): Promise<T[]> {
  if (!process.env.DB_HOST) return [];
  try {
    const [rows] = await db.query<T[]>(sql);
    return rows;
  } catch (error) {
    if (legacySql && (error as { code?: string }).code === "ER_BAD_FIELD_ERROR") {
      return loadStoryRows<T>(legacySql);
    }
    console.error("스트롱 이야기 콘텐츠를 불러오지 못했습니다.", error);
    return [];
  }
}

export default async function HomePage() {
  const [posts, reels, reviews] = await Promise.all([
    loadStoryRows<StoryPost>(`
      SELECT id, title, slug, description, branch_name, category
      FROM homepage_posts
      WHERE branch_name IS NOT NULL AND branch_name != ''
        AND NOT (branch_name = '전체' AND COALESCE(category, '') = '복싱정보')
      ORDER BY created_at DESC, id DESC LIMIT 6
    `, `
      SELECT id, title, slug, description, branch_name, NULL AS category
      FROM homepage_posts
      WHERE branch_name IS NOT NULL AND branch_name != ''
      ORDER BY created_at DESC, id DESC LIMIT 6
    `),
    loadStoryRows<StoryReel>(`
      SELECT id, branch_name, title, aria_label, video_url
      FROM homepage_reels WHERE is_active = 1
      ORDER BY sort_order ASC, id DESC
    `),
    loadStoryRows<StoryReview>(`
      SELECT id, branch_name, reviewer_name, content, image_url, review_date
      FROM homepage_naver_reviews WHERE is_active = 1
      ORDER BY review_date DESC, id DESC
    `),
  ]);

  return (
    <>
      {homeJsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      {/*<SplashScreen />*/}
      <PopupBanner />
      <main style={{ background: "#0E0E10", color: "#F5F4F1" }} className="min-h-screen">
        <RevealObserver />

        <SiteHeader />

        {/* ══════════════════════════════════════
            HERO — 좌: 카피 / 우: 소개 영상
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: "#0E0E10", scrollMarginTop: "120px" }}>
          {/* 배경 텍스처 — 도트 그리드 */}
          <div className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
          {/* 배경 그라디언트 — 왼쪽 빛 */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 55% at 28% 50%, rgba(255,255,255,0.012) 0%, transparent 65%)" }} />
          {/* 상단 레드 라인 */}
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full" style={{ background: "#D01E2E" }} />

          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <div className="grid min-h-[70vh] items-center gap-9 pb-12 pt-28 lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:pb-14 lg:pt-32">

              {/* ── 왼쪽: 카피 ── */}
              <div className="flex flex-col justify-center">
                <p className="mb-4 text-xs font-semibold tracking-wide" style={{ color: "#8A8D91" }}>
                  서울·경기 5개 지점
                </p>

                <h1 className="break-keep text-[clamp(30px,5.2vw,58px)] font-black leading-[1.12] tracking-[-.05em]">
                  운동을 또 그만둘까 봐<br />
                  등록부터 망설여진다면
                </h1>

                <div className="my-7 h-[2px] w-14" style={{ background: "#D01E2E" }} />

                <p className="max-w-md text-sm leading-[2] md:text-base md:leading-[2.1]" style={{ color: "#C9C9C9", wordBreak: "keep-all" }}>
                  <span style={{ color: "#F5F4F1", fontWeight: 700 }}>초보부터 실력자까지, 수준에 맞춘 맞춤형 복싱</span>
                </p>

                <p className="mt-3 text-sm font-semibold text-[#C9C9C9] md:text-base">어느 스트롱에 가도, 같은 기준으로 배웁니다.</p>
                <a href="/about" className="mt-2 w-fit text-sm font-semibold text-[#F5F4F1] underline decoration-[#D01E2E] underline-offset-4">스트롱복싱이 가르치는 방식 ↗</a>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#branches" className="btn-primary inline-flex items-center gap-2 rounded-[4px] bg-[#D01E2E] px-7 py-3.5 text-sm font-black text-white hover:bg-[#B71C2B]">
                    가까운 지점 보기 <span aria-hidden="true">→</span>
                  </a>
                  <ReservationButton oneDay location="hero" className="rounded-[4px] border border-white/20 px-7 py-3.5 text-sm font-bold text-[#F5F4F1] hover:bg-white/10">
                    원데이 체험 예약 <span aria-hidden="true">→</span>
                  </ReservationButton>
                </div>
                <p className="mt-4 text-xs leading-5 text-[#B5B5BC]"><strong>원데이 체험 30,000원</strong> · 당일 등록 시 체험비 전액 차감<br />회원권 가격은 지점에 문의해 주세요.</p>

                {/* 스탯 */}
                <div className="mt-14 flex gap-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
                  {[["4.9★", "네이버 평균 리뷰"], ["5개", "서울·경기 지점"], ["초보자", "언제나 환영"]].map(([n, t]) => (
                    <div key={n}>
                      <p className="text-2xl font-black" style={{ color: "#F5F4F1" }}>{n}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: "#5A5C61" }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              <figure className="m-0 overflow-hidden rounded-[4px]">
                <HomeHeroVideo />
              </figure>
            </div>
          </div>
        </section>

        <section id="branches" aria-labelledby="branch-title" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pb-10 pt-4 md:px-10">
          <h2 id="branch-title" className="mb-5 text-3xl font-black tracking-tight md:text-4xl">가까운 스트롱 찾기</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {branches.map((branch) => (
              <a
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className="group overflow-hidden rounded-[4px] border border-white/10 bg-[#151517] transition-colors hover:border-[#D01E2E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D01E2E]"
              >
                <img src={branch.image} alt="" loading="lazy" className="aspect-[2.2/1] w-full object-cover" />
                <div className="px-3.5 py-3">
                  <span className="flex items-center justify-between gap-2 text-[15px] font-bold">
                    {branch.name}
                    <span aria-hidden="true" className="text-sm text-[#A0A0A6] transition-colors group-hover:text-[#D01E2E]">↗</span>
                  </span>
                  <p className="mt-1 break-keep text-xs font-semibold leading-5 text-[#E5E5E8]">{branch.landmark}</p>
                  <ul aria-label="운영시간" className="mt-2 border-t border-white/10 pt-2 text-xs leading-5 text-[#B5B5BC]">
                    {branch.hours.map((hours) => <li key={hours}>{hours}</li>)}
                  </ul>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="first-visit-title" className="mx-auto max-w-[1440px] border-t border-white/10 px-6 py-8 md:px-10">
          <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-9">
            <h2 id="first-visit-title" className="text-2xl font-bold tracking-tight md:text-3xl">복싱 첫날 안내</h2>
            <div className="max-w-3xl space-y-3 break-keep text-sm leading-7 text-[#C9C9C9] md:text-base">
              <p><strong className="text-[#F5F4F1]">첫날에는 기본 자세와 스텝부터 배웁니다.</strong> 운영시간 내 편한 시간에 방문하면 관장·코치가 개인별 진도를 봐드립니다.</p>
              <p>한솔 대표는 현역 프로 복서입니다. 선수 출신 + 지도자 자격증 보유 코치진이 지도하며, 프로·아마추어 선수를 배출했습니다.</p>
              <a href="#coaches" className="inline-block font-semibold text-[#F5F4F1] underline decoration-[#D01E2E] underline-offset-4">지도진 보기 →</a>
            </div>
          </div>
        </section>

        <section id="story" aria-labelledby="story-title" className="mx-auto max-w-[1440px] scroll-mt-24 border-t border-white/10 px-6 pb-12 pt-8 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-9">
            <h2 id="story-title" className="text-2xl font-bold tracking-tight md:text-3xl">스트롱 이야기</h2>
            <TabSection
              dark
              tabs={["클립", "시설", "활동기록", "블로그", "네이버 후기"]}
              panels={[
                <ReelsClient key="clips" reels={reels.length ? reels : branches.flatMap((branch, branchIndex) => [1, 2].map((clip) => ({
                  id: branchIndex * 2 + clip,
                  branch_name: branch.name,
                  title: `${branch.name} 운동 영상 ${clip}`,
                  aria_label: null,
                  video_url: `/videos/${branch.slug}/00${clip}.mp4`,
                  poster: branch.image,
                })))} />,
                <div key="facility">
                  <p className="mb-4 text-sm leading-7 text-[#C9C9C9]">복싱 전용 링, 샌드백, 미트 트레이닝 공간. 처음 방문해도 편하게 운동할 수 있는 환경입니다.</p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      ["gallery-1.jpg", "스트롱복싱 신정점 샌드백과 복싱 링"],
                      ["gallery-2.jpg", "창가 복싱 링과 샌드백"],
                      ["gallery-3.jpg", "벽면을 따라 배치된 샌드백 훈련 공간"],
                      ["gallery-4.jpg", "샌드백과 바닥 매트를 갖춘 복싱 훈련 공간"],
                    ].map(([image, alt]) => (
                      <img key={image} src={`/images/gallery/${image}`} alt={alt} loading="lazy" className="aspect-[4/3] w-full rounded-[4px] object-cover" />
                    ))}
                  </div>
                </div>,
                <GallerySection key="moments" compact />,
                <div key="news">
                  {posts.length > 0 && (
                    <ul className="divide-y divide-white/10 border-y border-white/10">
                      {posts.map((post) => (
                        <li key={post.id}>
                          <a href={`/blog/${encodeURIComponent(post.slug)}`} className="block px-1 py-4 hover:text-[#D01E2E]">
                            <span className="block text-xs font-medium text-[#B5B5BC]">{post.branch_name}{post.category && ` · ${post.category}`}</span>
                            <strong className="mt-1 block break-keep text-base">{post.title}</strong>
                            {post.description && <span className="mt-1 line-clamp-2 text-sm text-[#B5B5BC]">{post.description}</span>}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a href={process.env.DB_HOST ? "/blog" : "https://strongboxing.kr/blog"} className="mt-3 inline-block text-sm font-semibold text-[#C9C9C9] underline">전체 블로그 보기 ↗</a>
                </div>,
                <div key="reviews">
                  {reviews.length > 0 ? <NaverReviewsClient reviews={reviews} /> : (
                    <div className="flex flex-wrap gap-4 rounded-[4px] border border-white/10 bg-[#141416] p-5 text-sm font-semibold text-[#C9C9C9]">
                      <a href="https://m.place.naver.com/place/2036376446/review/visitor" className="underline">목동점 네이버 후기 ↗</a>
                      <a href="https://m.place.naver.com/place/2037244259/review/visitor" className="underline">철산점 네이버 후기 ↗</a>
                    </div>
                  )}
                </div>,
              ]}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════
            HOW WE TRAIN
        ══════════════════════════════════════ */}
        <section id="programs" className="px-6 py-24 md:px-8" style={{ background: "#141416", scrollMarginTop: "120px" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h2 className="reveal d1 font-black leading-[1.05]" style={{ fontSize: "clamp(34px, 5vw, 62px)", letterSpacing: "-0.05em" }}>
                스트롱에서 배우는 방식
              </h2>
              <p className="reveal d2 mt-6 max-w-lg text-base leading-8" style={{ color: "#8A8D91" }}>
                운영시간 내 편한 시간에 오면 전 지점이 같은 수업 흐름으로 진행합니다. 일반 회원 운동 중 관장·코치가 한 사람씩 자세를 살피고 각자의 진도에 맞춰 코칭합니다.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col p-8 transition-all duration-300 hover:-translate-y-0.5" style={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
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
                  <span className="rounded-[4px] px-3 py-1.5 text-xs font-bold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>개인별 진행</span>
                  <span className="rounded-[4px] px-3 py-1.5 text-xs font-bold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>자유 방문</span>
                </div>
              </div>

              <div className="p-8 transition-all duration-300 hover:-translate-y-0.5" style={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                <h3 className="mb-6 text-2xl font-black" style={{ letterSpacing: "-0.04em" }}>1회 운동 구성</h3>
                <div className="space-y-3">
                  {[
                    ["01", "몸풀기", "스트레칭 & 워밍업"],
                    ["02", "줄넘기 3R", "기초 체력 훈련"],
                    ["03", "기초자세 & 스텝", "복싱 기본기"],
                    ["04", "미트트레이닝", "코치와 타이밍·거리 연습"],
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


            <div id="program" className="mt-10 scroll-mt-24">
              <h3 className="mb-2 text-2xl font-black">운동 목적별 프로그램</h3>
              <p className="mb-4 text-sm leading-7 text-[#B5B5BC]">입문, 다이어트, 체력증진, 스트레스 해소까지 운동 목적에 맞게 진행합니다.</p>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["01", "복싱 입문", "기본자세, 스텝, 펀치부터 차근차근. 처음 오셔도 바로 시작할 수 있습니다."],
                  ["02", "다이어트 · 체력", "전신 운동으로 체지방 감량과 체력증진을 동시에."],
                  ["03", "관장 직접 지도", "개인 수준과 목표에 맞춰 관장·코치가 직접 잡아드립니다."],
                ].map(([num, title, desc], i) => (
                  <div key={num} className={`group reveal d${i + 1} p-6 transition-all duration-300 hover:-translate-y-1`}
                    style={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                    <h3 className="mb-3 text-2xl font-black" style={{ letterSpacing: "-0.04em", color: "#F5F4F1" }}>{title}</h3>
                    <p className="text-sm leading-7" style={{ color: "#8A8D91" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <a id="calculator" href="/tools/boxing-calorie" className="mt-5 inline-block scroll-mt-24 text-sm text-[#B5B5BC] underline decoration-white/25 underline-offset-4 hover:text-[#F5F4F1]">복싱 칼로리 계산기 ↗</a>
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
                일반 운동 중 한 사람씩 자세를 살피고, 각자의 수준에 맞춰 진도를 잡아드립니다.
              </p>
            </div>

            {/* 대표 카드 — red border 강조 */}
            <a
              href="https://www.instagram.com/strongboxing_official"
              target="_blank" rel="noopener noreferrer"
              className="reveal group mb-4 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 md:flex-row"
              style={{
                borderRadius: 4,
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
                <p className="text-sm" style={{ color: "#8A8D91" }}>스트롱복싱 대표 · 현역 프로 복서</p>
              </div>
            </a>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                { branch: "개봉점", name: "안진호", role: "관장", instagram: "dkswkd3" },
                { branch: "신정점", name: "유상혁", role: "관장", instagram: "robuste_hyeok" },
                { branch: "신정점", name: "정동주", role: "코치", instagram: "jdj_00_" },
                { branch: "목동점", name: "송재용", role: "관장", instagram: "nan_yong_" },
                { branch: "목동점", name: "김민찬", role: "코치", instagram: "chan.__2" },
                { branch: "철산점", name: "안도연", role: "관장", instagram: "strongboxing_andy" },
                { branch: "철산점", name: "신우수", role: "코치", instagram: "ws_nakmuay" },
              ].map((coach) => (
                <a key={coach.name}
                  href={`https://www.instagram.com/${coach.instagram}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-6 rounded-[4px] border border-[rgba(74,76,80,0.3)] bg-[#141416] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(138,141,145,0.45)] hover:bg-[rgba(74,76,80,0.08)]"
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
                  style={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)", background: "#1A1A1C" }}>
                  <p className="mb-6 text-2xl font-black" style={{ color: "#3A3A3E" }}>{step}</p>
                  <h3 className="mb-2 text-base font-black" style={{ color: "#F5F4F1" }}>{title}</h3>
                  <p className="text-sm leading-6" style={{ color: "#8A8D91" }}>{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>



        <FaqSection />





        {/* SEO sr-only */}
        <section className="sr-only">
          <h2>스트롱복싱 지점별 복싱장 안내</h2>
          <p>
            스트롱복싱은 목동점, 개봉점, 철산점, 신정점, 영등포점으로 운영되는 복싱 체육관입니다.
            관장이 직접 지도하는 정통 복싱장으로, 초보자도 기본기부터 편하게 시작할 수 있습니다.
            운동이 처음이어도 자유롭게 방문할 수 있고, 시간을 맞출 필요 없이 운영시간 내 언제든 이용 가능합니다.
            원데이 체험 30,000원 현장결제. 당일 등록 시 체험비 전액 차감.
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

        {/* ══════════════════════════════════════
            공인 단체
        ══════════════════════════════════════ */}
        <section className="px-6 py-24 md:px-8" style={{ background: "#0E0E10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="reveal mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>CERTIFIED GYM</p>
              <h2 className="reveal d1 font-black" style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.04em", color: "#F5F4F1" }}>
                프로복싱 4개 단체 및 KABA 가입 체육관
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
                  style={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
                  <img src={org.src} alt={org.full} className="h-16 w-16 rounded-full object-cover" />
                  <div className="text-center">
                    <p className="text-base font-black" style={{ color: "#F5F4F1" }}>{org.name}</p>
                    <p className="text-xs" style={{ color: "#5A5C61" }}>{org.full}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6 overflow-hidden p-8 md:flex-row md:justify-between"
              style={{ borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)", background: "#141416" }}>
              <div className="flex items-center gap-5">
                <img src="/images/boxing-orgs/kaba.jpg" alt="대한생활체육복싱협회" className="h-16 w-16 object-contain" />
                <div>
                  <p className="text-[10px]" style={{ color: "#5A5C61" }}>KOREA AMATEUR BOXING ASSOCIATION</p>
                  <p className="text-lg font-black" style={{ color: "#F5F4F1" }}>대한생활체육복싱협회</p>
                </div>
              </div>
              <span className="rounded-[4px] px-4 py-2 text-sm font-black"
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
                    style={{ color: "#8A8D91" }}>스트롱복싱 {b.name}</a>
                  <p className="text-xs leading-5" style={{ color: "#3A3A3E" }}>{b.address}</p>
                  <a href={`tel:${b.phone.replace(/-/g, "")}`}
                    className="mt-1 block text-xs transition-colors duration-200 hover:text-[#8A8D91]"
                    style={{ color: "#5A5C61" }}>{b.phone}</a>
                  <p className="text-xs" style={{ color: "#5A5C61" }}>{b.hours.join(" / ")}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#3A3A3E" }}>
              © 2026 STRONG BOXING. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
