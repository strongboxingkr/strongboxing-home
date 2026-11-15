import { db } from "@/lib/db";
import BranchMapLight from "@/app/components/BranchMapLight";
import ReelsClient from "@/app/components/ReelsClient";
import type { Metadata } from "next";
import RenewalHeader from "./RenewalHeader";
import { TabSection, FirstVisitAccordion, CalorieCalcPanel } from "./HomeRenewalClient";
import { ConsultationModalButton } from "./ConsultationModal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "스트롱복싱 홈 리뉴얼 미리보기",
  robots: { index: false, follow: false },
};

const branches = [
  { slug: "gaebong",      name: "개봉점",   area: "구로·개봉",   image: "/images/branches/gaebong.jpg",      phone: "02-2060-1279", hours: "월–금 13:00~23:00",               booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll", naverMap: "https://naver.me/5aFquqcz" },
  { slug: "sinjeong",     name: "신정점",   area: "양천·신정",   image: "/images/branches/sinjeong.jpg",     phone: "02-2647-3373", hours: "월–금 10:00~24:00  토 10:00~16:00", booking: "https://booking.naver.com/booking/13/bizes/1367177",                                         naverMap: "https://naver.me/5nhXvzXH" },
  { slug: "mokdong",      name: "목동점",   area: "양천·목동",   image: "/images/branches/mokdong.png",      phone: "02-2643-5971", hours: "월–금 14:00~24:00  토 11:00~16:00", booking: "https://booking.naver.com/booking/13/bizes/1510638",                                         naverMap: "https://naver.me/GII8f9Qv" },
  { slug: "cheolsan",     name: "철산점",   area: "광명·철산",   image: "/images/branches/cheolsan.jpg",     phone: "02-2066-0406", hours: "월–금 14:00~23:00  토일 14:00~18:00",booking: "https://booking.naver.com/booking/12/bizes/1673598",                                         naverMap: "https://naver.me/F8lwn3Te" },
  { slug: "yeongdeungpo", name: "영등포점", area: "영등포",      image: "/images/branches/yeongdeungpo.jpg", phone: "02-831-9312",  hours: "월–금 13:00~23:00",               booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll", naverMap: "https://naver.me/G4yQwkR0" },
];

/* 코치 사진: hansol만 존재, 나머지 7명은 이니셜 플레이스홀더 */
const allCoaches = [
  { name: "한솔",   role: "대표",   branch: "전지점 총괄", instagram: "strongboxing_kr",  photo: "/images/coaches/hansol.jpg" },
  { name: "안진호", role: "관장",   branch: "개봉점",      instagram: "dkswkd3",           photo: null },
  { name: "유상혁", role: "관장",   branch: "신정점",      instagram: "robuste_hyeok",     photo: null },
  { name: "정동주", role: "코치",   branch: "신정점",      instagram: "jdj_00_",           photo: null },
  { name: "송재용", role: "관장",   branch: "목동점",      instagram: "nan_yong_",         photo: null },
  { name: "김민찬", role: "코치",   branch: "목동점",      instagram: "chan.__2",           photo: null },
  { name: "안도연", role: "관장",   branch: "철산점",      instagram: "strongboxing_andy", photo: null },
  { name: "신우수", role: "코치",   branch: "철산점",      instagram: "ws_nakmuay",         photo: null },
];

const facilityImages = [
  "/images/gallery/gallery-1.jpg",
  "/images/gallery/gallery-2.jpg",
  "/images/gallery/gallery-3.jpg",
  "/images/gallery/gallery-4.jpg",
];

const momentImages = [
  "/images/gallery/moments/story1.jpg",
  "/images/gallery/moments/story2.jpg",
  "/images/gallery/moments/story3.jpg",
  "/images/gallery/moments/story4.jpg",
  "/images/gallery/moments/story5.jpg",
  "/images/gallery/moments/story6.jpg",
];

/* ── 운동 방식 패널 — 지도 방식 + 6단계 흐름 ── */
function WorkoutMethodPanel() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          ["1:1 직접 지도", "관장·코치가 개인 수준에 맞게 1:1로 직접 지도합니다."],
          ["맞춤형 훈련", "초보·다이어트·실력 향상 목표에 따라 프로그램을 조정합니다."],
          ["안전한 환경", "기초 자세부터 단계별로 배워 부상 없이 오래 운동합니다."],
        ].map(([title, desc]) => (
          <div key={title} style={{ borderTop: "2px solid #E0DDD6", paddingTop: 16 }}>
            <h3 className="mb-2 font-black text-sm" style={{ color: "#0E0E10" }}>{title}</h3>
            <p className="text-sm leading-6" style={{ color: "#6B6B72" }}>{desc}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-4 text-[10px] font-black tracking-[0.3em]" style={{ color: "#aaa" }}>1회 수업 흐름</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {[["01","몸풀기"],["02","줄넘기"],["03","자세 & 스텝"],["04","미트 트레이닝"],["05","샌드백"],["06","체력 운동"]].map(([n, s]) => (
            <div key={n} className="flex flex-col items-center gap-2 rounded-[10px] p-4 text-center"
              style={{ background: "#F7F6F3", border: "1px solid #E0DDD6" }}>
              <span className="text-[10px] font-black" style={{ color: "#ccc" }}>{n}</span>
              <span className="text-xs font-bold leading-tight" style={{ color: "#0E0E10" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 프로그램 패널 — 목적별 프로그램 ── */
function ProgramPanel() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {[
        ["복싱 입문", "처음 배우는 분도 스텝과 기본 자세부터 차근차근 익힙니다."],
        ["다이어트 복싱", "지루하지 않게 땀 흘리는 복싱 트레이닝으로 운동량을 높입니다."],
        ["체력 향상", "운동 목적과 체력에 맞춰 무리 없이 꾸준히 운동할 수 있습니다."],
      ].map(([title, desc]) => (
        <div key={title} style={{ borderTop: "2px solid #E0DDD6", paddingTop: 16 }}>
          <h3 className="mb-2 font-black text-base" style={{ color: "#0E0E10" }}>{title}</h3>
          <p className="text-sm leading-7" style={{ color: "#6B6B72" }}>{desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ── 첫 방문 패널 — 4단계 ── */
function FirstVisitStepsPanel() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["01", "예약 또는 방문",   "네이버·홈페이지로 예약하거나 바로 방문해도 됩니다"],
        ["02", "편한 복장으로",    "편한 운동복과 실내용 운동화만 준비해주세요"],
        ["03", "관장과 상담",      "운동 목적·체력에 맞춰 맞춤 안내해드립니다"],
        ["04", "바로 운동 시작",   "처음 오셔도 기본 자세부터 천천히 알려드립니다"],
      ].map(([step, title, desc]) => (
        <div key={step} style={{ borderTop: "2px solid #E0DDD6", paddingTop: 16 }}>
          <p className="mb-3 text-2xl font-black" style={{ color: "#E0DDD6" }}>{step}</p>
          <h3 className="mb-1 font-black text-sm" style={{ color: "#0E0E10" }}>{title}</h3>
          <p className="text-sm leading-6" style={{ color: "#6B6B72" }}>{desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ── 시설 패널 ── */
function FacilityPanel() {
  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {facilityImages.map((src, i) => (
        <div key={i} className="overflow-hidden rounded-[10px]" style={{ aspectRatio: "4/3" }}>
          <img src={src} alt={`스트롱복싱 시설 ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      ))}
    </div>
  );
}

/* ── 활동기록 패널 ── */
function MomentsPanel() {
  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
      {momentImages.map((src, i) => (
        <div key={i} className="overflow-hidden rounded-[10px]" style={{ aspectRatio: "4/3" }}>
          <img src={src} alt={`활동 기록 ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      ))}
    </div>
  );
}

export default async function RenewalHomePage() {
  let latestPosts: any[] = [];
  let reviews: any[] = [];
  let reels: any[] = [];

  try {
    const [rows]: any = await db.query(`
      SELECT id, title, slug, description, branch_name, created_at, content, thumbnail
      FROM homepage_posts
      WHERE branch_name IS NOT NULL AND branch_name NOT IN ('', '전체')
      ORDER BY created_at DESC
      LIMIT 6
    `);
    latestPosts = rows;
  } catch {}

  try {
    const [r]: any = await db.query(`SELECT * FROM homepage_naver_reviews ORDER BY sort_order ASC LIMIT 6`);
    reviews = r;
  } catch {}

  try {
    const [rl]: any = await db.query(`
      SELECT id, branch_name, title, aria_label, video_url, is_muted
      FROM homepage_reels
      WHERE is_active = 1
      ORDER BY sort_order ASC, id DESC
    `);
    reels = rl;
  } catch {}

  function getThumb(post: any): string | null {
    if (post.thumbnail) return post.thumbnail;
    const s = String(post.content || "");
    const m = s.match(/<img[^>]+src=["']([^"']+)["']/i) || s.match(/!\[.*?\]\((.*?)\)/);
    return m?.[1] ?? null;
  }

  /* 소식 패널 */
  const NewsPanel = () => (
    <div>
      {latestPosts.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: "#aaa" }}>소식이 없습니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => {
            const thumb = getThumb(post);
            return (
              <a key={post.id} href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[12px] transition-opacity hover:opacity-90"
                style={{ border: "1px solid #E8E6DF" }}>
                <div className="h-[160px] overflow-hidden bg-[#F5F5F7]">
                  {thumb
                    ? <img src={thumb} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="flex h-full items-center justify-center text-3xl opacity-20">🥊</div>
                  }
                </div>
                <div className="p-5" style={{ background: "#fff" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white" style={{ background: "#D01E2E" }}>{post.branch_name}</span>
                    <span className="text-[11px]" style={{ color: "#aaa" }}>
                      {new Date(post.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                    </span>
                  </div>
                  <h3 className="font-black text-sm line-clamp-2 leading-snug" style={{ color: "#0E0E10" }}>{post.title}</h3>
                  <p className="mt-1 text-xs line-clamp-2" style={{ color: "#6B6B72" }}>{post.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
      <div className="mt-8">
        <a href="/blog" className="text-sm font-black transition-colors hover:text-[#0E0E10]" style={{ color: "#6B6B72" }}>
          전체 소식 보기 →
        </a>
      </div>
    </div>
  );

  /* 클립 패널 */
  const ClipsPanel = () => (
    reels.length === 0 ? (
      <p className="py-12 text-center text-sm" style={{ color: "#aaa" }}>클립을 불러오는 중입니다.</p>
    ) : (
      <ReelsClient reels={reels} />
    )
  );

  /* 네이버 후기 패널 */
  const ReviewsPanel = () => (
    <div>
      {reviews.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: "#aaa" }}>후기를 불러오는 중입니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r: any, i: number) => (
            <div key={i} className="rounded-[12px] p-6" style={{ border: "1px solid #E8E6DF", background: "#fff" }}>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} style={{ color: j < (r.rating ?? 5) ? "#D01E2E" : "#E0DDD6", fontSize: 12 }}>★</span>
                  ))}
                </div>
                {r.branch_name && <span className="text-[11px] font-bold" style={{ color: "#aaa" }}>{r.branch_name}</span>}
              </div>
              <p className="text-sm leading-6 line-clamp-4" style={{ color: "#0E0E10" }}>{r.content || r.review || r.text}</p>
              {r.author && <p className="mt-3 text-[11px]" style={{ color: "#aaa" }}>{r.author}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "#F9F8F5", color: "#0E0E10", zoom: 0.8 }}>
      <RenewalHeader />

      {/* ── HERO — 왼쪽 카피 / 오른쪽 사진 1장 ── */}
      <section style={{ background: "#F9F8F5" }}>
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid min-h-[90vh] items-stretch gap-0 lg:grid-cols-2">

            {/* 왼쪽 카피 */}
            <div className="flex flex-col justify-center py-20 lg:py-24 lg:pr-16">
              <p className="mb-6 text-[10px] font-black tracking-[0.45em]" style={{ color: "#aaa" }}>
                STRONG BOXING — 서울·경기 5개 지점
              </p>
              <h1
                style={{
                  fontSize: "clamp(52px, 7vw, 96px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  color: "#0E0E10",
                  wordBreak: "keep-all",
                }}
              >
                처음이어도<br />괜찮습니다
              </h1>
              <div className="my-7 h-[2px] w-14" style={{ background: "#D01E2E" }} />
              <p className="max-w-sm text-sm leading-[1.9]" style={{ color: "#6B6B72", wordBreak: "keep-all" }}>
                초보부터 실력자까지, 수준에 맞춘 맞춤형 복싱
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/reservation"
                  className="inline-flex items-center gap-2 rounded-[10px] px-7 py-3.5 text-sm font-black text-white transition-opacity hover:opacity-90"
                  style={{ background: "#D01E2E" }}
                >
                  원데이 클래스 예약하기 →
                </a>
              </div>
              <p className="mt-4 text-xs" style={{ color: "#aaa" }}>
                원데이 클래스{" "}
                <span style={{ color: "#0E0E10", fontWeight: 700 }}>30,000원</span> 현장결제
                &nbsp;·&nbsp; 등록 시 회원권에서{" "}
                <span style={{ color: "#0E0E10", fontWeight: 700 }}>전액 차감</span>
              </p>
            </div>

            {/* 오른쪽 사진 1장 */}
            <div className="relative hidden lg:block" style={{ minHeight: 560 }}>
              <img
                src="/images/branches/sinjeong.jpg"
                alt="스트롱복싱 신정점"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "center" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, #F9F8F5 0%, transparent 20%)" }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 지점 안내 — 왼쪽 제목 / 가운데 지도 / 오른쪽 목록 ── */}
      <section
        id="branches"
        className="px-6 py-20 md:px-10"
        style={{ background: "#fff", scrollMarginTop: "72px" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[200px_1fr_300px] lg:gap-8">

            {/* 왼쪽 제목 */}
            <div className="lg:pt-2">
              <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>BRANCHES</p>
              <h2 className="font-black leading-tight" style={{ fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.04em", color: "#0E0E10", wordBreak: "keep-all" }}>
                가까운<br />지점을<br />찾아보세요
              </h2>
            </div>

            {/* 가운데 지도 */}
            <BranchMapLight />

            {/* 오른쪽 지점 목록 */}
            <div className="space-y-2">
              {branches.map((b) => (
                <a
                  key={b.slug}
                  href={`/branches/${b.slug}`}
                  className="group flex items-center gap-3 rounded-[12px] px-4 py-4 transition-all duration-200"
                  style={{ border: "1px solid #E8E6DF", background: "#F9F8F5" }}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px]">
                    <img src={b.image} alt={b.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm" style={{ color: "#0E0E10" }}>{b.name}</span>
                      <span className="text-[10px]" style={{ color: "#aaa" }}>{b.area}</span>
                    </div>
                    <p className="mt-0.5 text-xs truncate" style={{ color: "#6B6B72" }}>{b.hours.split("  ")[0]}</p>
                  </div>
                  <span className="shrink-0 text-sm font-black transition-transform duration-200 group-hover:translate-x-1" style={{ color: "#D01E2E" }}>→</span>
                </a>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 운동 안내 — 왼쪽 제목 / 오른쪽 탭 ── */}
      <section
        id="workout"
        className="px-6 py-20 md:px-10"
        style={{ background: "#F9F8F5", scrollMarginTop: "72px" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            <div className="lg:pt-1">
              <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>PROGRAM</p>
              <h2 className="font-black leading-tight" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.04em", color: "#0E0E10", wordBreak: "keep-all" }}>
                운동 안내
              </h2>
            </div>
            <TabSection
              tabs={["운동 방식", "프로그램", "첫 방문", "칼로리 계산기"]}
              panels={[
                <WorkoutMethodPanel key="method" />,
                <ProgramPanel key="program" />,
                <FirstVisitStepsPanel key="steps" />,
                <CalorieCalcPanel key="calc" />,
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── 지도진 — 왼쪽 제목 / 오른쪽 균등 그리드 ── */}
      <section
        id="coaches"
        className="px-6 py-20 md:px-10"
        style={{ background: "#fff", scrollMarginTop: "72px" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            <div className="lg:pt-1">
              <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>COACHES</p>
              <h2 className="font-black leading-tight" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.04em", color: "#0E0E10", wordBreak: "keep-all" }}>
                지도진
              </h2>
            </div>

            {/* 8인 균등 그리드 */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {allCoaches.map((c) => (
                <a
                  key={c.name}
                  href={`https://www.instagram.com/${c.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[14px] transition-opacity hover:opacity-90"
                  style={{ border: "1px solid #E8E6DF" }}
                >
                  {/* 사진 영역 */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    {c.photo ? (
                      <img
                        src={c.photo}
                        alt={c.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center" style={{ background: "#F0EFEC" }}>
                        <span className="font-black text-3xl" style={{ color: "#C8C5BC" }}>
                          {c.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 정보 */}
                  <div className="p-4" style={{ background: "#fff" }}>
                    <p className="text-[10px] font-black tracking-[0.1em] mb-0.5" style={{ color: "#aaa" }}>{c.branch}</p>
                    <p className="font-black text-sm" style={{ color: "#0E0E10" }}>{c.name} {c.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 스트롱 이야기 — 왼쪽 제목 / 오른쪽 5탭 ── */}
      <section
        id="story"
        className="px-6 py-20 md:px-10"
        style={{ background: "#F9F8F5", scrollMarginTop: "72px" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            <div className="lg:pt-1">
              <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>STRONG STORY</p>
              <h2 className="font-black leading-tight" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.04em", color: "#0E0E10", wordBreak: "keep-all" }}>
                스트롱<br />이야기
              </h2>
            </div>
            <TabSection
              tabs={["클립", "시설", "활동기록", "소식", "네이버 후기"]}
              panels={[
                <ClipsPanel key="clips" />,
                <FacilityPanel key="facility" />,
                <MomentsPanel key="moments" />,
                <NewsPanel key="news" />,
                <ReviewsPanel key="reviews" />,
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── 처음 방문하시나요? — 왼쪽 / 오른쪽 아코디언 ── */}
      <section
        id="firstvisit"
        className="px-6 py-20 md:px-10"
        style={{ background: "#fff", scrollMarginTop: "72px" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">

            <div>
              <p className="mb-2 text-[10px] font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>FIRST VISIT</p>
              <h2 className="mb-6 font-black leading-tight" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.04em", color: "#0E0E10", wordBreak: "keep-all" }}>
                처음<br />방문하시나요?
              </h2>
              <p className="mb-10 text-sm leading-7" style={{ color: "#6B6B72", wordBreak: "keep-all" }}>
                복싱을 처음 시작하는 분들이 가장 많이 묻는 질문을 모았습니다.
              </p>
              <ConsultationModalButton
                className="inline-flex items-center gap-2 rounded-[10px] px-7 py-4 text-sm font-black text-white transition-opacity hover:opacity-90"
                style={{ background: "#D01E2E" }}
              >
                무료 방문 상담 신청 →
              </ConsultationModalButton>
            </div>

            <FirstVisitAccordion />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        id="contact"
        className="px-6 py-14 md:px-10"
        style={{ background: "#0E0E10", color: "#5A5C61", scrollMarginTop: "72px" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-start justify-between gap-8">
            {/* 로고 */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <img src="/icon.png" alt="스트롱복싱" className="h-7 w-7 object-contain" />
                <div className="flex flex-col leading-none">
                  <span className="text-[15px] font-black tracking-[0.08em]" style={{ color: "#F5F4F1" }}>STRONG</span>
                  <span className="text-[9px] font-black tracking-[0.22em]" style={{ color: "#D01E2E" }}>— BOXING —</span>
                </div>
              </div>
              <p className="text-xs" style={{ color: "#5A5C61" }}>서울·경기 5개 지점 복싱장</p>
            </div>

            {/* 지점 링크 */}
            <div className="flex flex-wrap gap-4 text-xs">
              {branches.map((b) => (
                <a key={b.slug} href={`/branches/${b.slug}`} className="transition-colors hover:text-white">
                  {b.name}
                </a>
              ))}
            </div>

            {/* 상담 CTA */}
            <ConsultationModalButton
              className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-black text-white transition-opacity hover:opacity-90"
              style={{ background: "#D01E2E" }}
            >
              방문 상담 신청 →
            </ConsultationModalButton>
          </div>

          <div
            className="text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}
          >
            <p>strongboxing.kr@gmail.com · © 2024 STRONG BOXING. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
