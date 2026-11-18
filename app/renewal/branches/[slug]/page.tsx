import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/SiteHeader";
import BranchReelCard from "@/app/components/BranchReelCard";
import BranchPreview, { type PreviewPost, type PreviewReel, type PreviewReview } from "./BranchPreview";
import type { RowDataPacket } from "mysql2";
import ConsultationForm from "@/app/components/ConsultationForm";
import { BranchTabSection, FaqAccordion } from "./BranchRenewalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "지점 리뉴얼 미리보기",
  robots: { index: false, follow: false },
};

type Branch = Parameters<typeof BranchPreview>[0]["branch"] & { image: string };

const branches: Record<string, Branch> = {
  gaebong: {
    name: "개봉점", fullName: "스트롱복싱 개봉점", area: "개봉",
    image: "/images/branches/gaebong.jpg",
    phone: "02-2060-1279", hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz", kakaoChat: "https://pf.kakao.com/_uyxbnX/chat",
    address: "(08274) 서울시 구로구 개봉동 166-5번지 (유원빌딩) 지하 1층",
    kakaoMap: "https://kko.to/RmPQ1W8t8g",
    description: "구로구 개봉동에 위치한 스트롱복싱 개봉점입니다. 개봉동, 고척동 인근에서 복싱을 처음 시작하는 분들도 편하게 운동할 수 있습니다.",
    highlights: ["관장 직접 지도", "개봉·고척 복싱", "초보자 환영"],
  },
  sinjeong: {
    name: "신정점", fullName: "스트롱복싱 신정점", area: "신정",
    image: "/images/branches/sinjeong.jpg",
    phone: "02-2647-3373", hours: ["월-금 10:00~24:00 (14:00~15:00 휴게)", "토 10:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing.sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH", kakaoChat: "https://pf.kakao.com/_rxoQxiX/chat",
    address: "(08087) 서울시 양천구 신정동 1021-7 (태화상가) 2층",
    kakaoMap: "https://kko.to/NlN6yV0aK3",
    description: "양천구 신정네거리·신정동 복싱장입니다. 초보자, 학생, 여성 회원도 부담 없이 기초부터 체계적으로 운동할 수 있습니다.",
    highlights: ["오전 10시 오픈", "주 6일 운영", "초보자 환영"],
  },
  mokdong: {
    name: "목동점", fullName: "스트롱복싱 목동점", area: "목동",
    image: "/images/branches/mokdong.png",
    phone: "02-2643-5971", hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv", kakaoChat: "https://pf.kakao.com/_xfGZnX/chat",
    address: "(07984) 서울시 양천구 목동 909-6 (우방빌딩) 4층",
    kakaoMap: "https://place.map.kakao.com/1917925446",
    description: "양천구 목동에서 복싱을 처음 시작하는 분들을 위한 스트롱복싱 목동점입니다.",
    highlights: ["밤 12시까지 운영", "관장 직접 지도", "학생·초보자 환영"],
  },
  cheolsan: {
    name: "철산점", fullName: "스트롱복싱 철산점", area: "철산",
    image: "/images/branches/cheolsan.jpg",
    phone: "02-2066-0406", hours: ["월-금 14:00~23:00", "토·일 14:00~18:00", "공휴일 휴무"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "https://booking.naver.com/booking/12/bizes/1673598",
    naverMap: "https://naver.me/F8lwn3Te", kakaoChat: "https://pf.kakao.com/_MAKnX/chat",
    address: "(14209) 경기도 광명시 철산동 56-14 3층",
    kakaoMap: "https://place.map.kakao.com/1182676078",
    description: "철산동·광명 인근 복싱장. 관장 직접 지도, 초보자부터 실전까지 안전하게 배우는 복싱.",
    highlights: ["토·일 운영", "광명시 복싱", "관장 직접 지도"],
  },
  yeongdeungpo: {
    name: "영등포점", fullName: "스트롱복싱 영등포점", area: "영등포",
    image: "/images/branches/yeongdeungpo.jpg",
    phone: "02-831-9312", hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0", kakaoChat: null,
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    description: "영등포구 복싱장. 초보자, 학생, 직장인 모두 기초부터 체계적으로 운동할 수 있습니다.",
    highlights: ["영등포 도심 위치", "관장 직접 지도", "직장인·초보자 환영"],
  },
};

const branchCoaches: Record<string, { name: string; role: string; instagram: string }[]> = {
  gaebong:      [{ name: "안진호", role: "관장", instagram: "dkswkd3" }],
  sinjeong:     [{ name: "유상혁", role: "관장", instagram: "robuste_hyeok" }, { name: "정동주", role: "코치", instagram: "jdj_00_" }],
  mokdong:      [{ name: "송재용", role: "관장", instagram: "nan_yong_" }, { name: "김민찬", role: "코치", instagram: "chan.__2" }],
  cheolsan:     [{ name: "안도연", role: "관장", instagram: "strongboxing_andy" }, { name: "신우수", role: "코치", instagram: "ws_nakmuay" }],
  yeongdeungpo: [],
};

const branchTargetAudience: Record<string, string[]> = {
  gaebong:      ["개봉·고척동 복싱장 찾는 분", "다이어트 복싱 시작하려는 분", "복싱이 처음인 초보자", "여성 혼자 다니기 편한 곳 찾는 분", "직장인 퇴근 후 운동 찾는 분"],
  sinjeong:     ["신정네거리 복싱장 찾는 분", "오전 운동 찾는 분", "양천구 초보자", "직장인 저녁 운동 찾는 분", "여성 회원"],
  mokdong:      ["목동·오목교 복싱장 찾는 분", "다이어트 복싱 하고 싶은 분", "목동 학생·키즈", "직장인", "초보자"],
  cheolsan:     ["철산동·광명 복싱장 찾는 분", "광명 다이어트 운동 찾는 분", "직장인 퇴근 후 운동", "광명 여성 회원", "주말 운동 찾는 분"],
  yeongdeungpo: ["영등포 복싱장 찾는 분", "다이어트 복싱 하고 싶은 분", "영등포 직장인", "초보자", "여성 회원"],
};

const branchFaqs: Record<string, { question: string; answer: string }[]> = {
  gaebong: [
    { question: "개봉 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "여성 회원도 많이 다니나요?", answer: "여성 회원분들도 다이어트와 체력 향상 목적으로 편하게 운동하고 계십니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화만 준비해주시면 됩니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "개봉점은 월~금 13:00~23:00 운영합니다." },
    { question: "상담 예약은 어떻게 하나요?", answer: "홈페이지 방문 상담 예약, 전화, 카카오톡 문의로 신청하실 수 있습니다." },
  ],
  sinjeong: [
    { question: "신정 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세, 스텝, 펀치부터 차근차근 안내해드립니다." },
    { question: "여성 회원도 운동 가능한가요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 많이 운동하고 계십니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "신정점은 월~금 10:00~24:00(14:00~15:00 휴게), 토요일 10:00~16:00 운영합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
  ],
  mokdong: [
    { question: "목동 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 체력 향상과 기초 운동 습관을 만들기 좋습니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "목동점은 월~금 14:00~24:00, 토요일 11:00~16:00 운영합니다." },
    { question: "준비물은 무엇이 필요한가요?", answer: "편한 운동복과 실내용 운동화만 준비해주시면 됩니다." },
  ],
  cheolsan: [
    { question: "복싱 처음인데 괜찮을까요?", answer: "초보자도 기초 자세와 스텝부터 차근차근 배울 수 있습니다." },
    { question: "광명 다이어트 운동으로 복싱이 효과 있나요?", answer: "복싱은 유산소와 근력이 결합된 전신 운동이라 다이어트 효과가 높습니다." },
    { question: "주말에도 운영하나요?", answer: "네, 토·일요일 14:00~18:00 운영합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
  ],
  yeongdeungpo: [
    { question: "영등포 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "직장인도 다니기 괜찮나요?", answer: "평일 저녁 시간대에 퇴근 후 운동하시는 직장인 회원도 많습니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "영등포점은 월~금 13:00~23:00 운영합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
  ],
};

const workout = {
  program: [
    ["복싱 입문", "처음 배우는 분도 스텝과 기본 자세부터 차근차근 익힙니다."],
    ["다이어트 복싱", "지루하지 않게 땀 흘리는 복싱 트레이닝으로 운동량을 높입니다."],
    ["체력 향상", "운동 목적과 체력에 맞춰 무리 없이 꾸준히 운동할 수 있습니다."],
  ],
  flow: [
    ["01", "몸풀기"],
    ["02", "줄넘기"],
    ["03", "자세 & 스텝"],
    ["04", "미트 트레이닝"],
    ["05", "샌드백"],
    ["06", "체력 운동"],
  ],
  firstVisit: [
    ["01", "예약 또는 방문", "네이버·홈페이지로 예약하거나 바로 방문해도 됩니다"],
    ["02", "편한 복장으로", "편한 운동복과 실내용 운동화만 준비해주세요"],
    ["03", "관장과 상담", "운동 목적·체력에 맞춰 맞춤 안내해드립니다"],
    ["04", "바로 운동 시작", "처음 오셔도 기본 자세부터 천천히 알려드립니다"],
  ],
};

const previewSlugs = new Set(["gaebong", "sinjeong", "mokdong", "cheolsan"]);

function getLocalClips(slug: string, branchName: string): PreviewReel[] {
  return [1, 2, 3].map((id) => ({
    id,
    title: `${branchName} 운동 영상 ${id}`,
    aria_label: null,
    poster: `/images/${slug}/clip-${id}.jpg`,
    video_url: `/videos/${slug}/${String(id).padStart(3, "0")}.mp4`,
  }));
}

const galleryImages = [
  "/images/gallery/moments/story1.jpg",
  "/images/gallery/moments/story2.jpg",
  "/images/gallery/moments/story3.jpg",
  "/images/gallery/moments/story4.jpg",
];

export default async function RenewalBranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = branches[slug];
  if (!branch) return notFound();

  const coaches = branchCoaches[slug] ?? [];
  const audience = branchTargetAudience[slug] ?? [];
  const faqItems = branchFaqs[slug] ?? [];

  const [relatedPosts, branchReels, reviews] = await Promise.all([
    db.query<(PreviewPost & RowDataPacket)[]>(`SELECT id, title, slug, description, content, branch_name, thumbnail, created_at
      FROM homepage_posts WHERE branch_name = ? ORDER BY created_at DESC LIMIT 5`, [branch.name])
      .then(([rows]) => rows).catch(() => []),
    db.query<(Parameters<typeof BranchReelCard>[0]["reel"] & RowDataPacket)[]>(`SELECT id, branch_name, title, aria_label, video_url, is_muted
      FROM homepage_reels WHERE is_active = 1 AND branch_name = ? ORDER BY sort_order ASC, id DESC LIMIT 8`, [branch.name])
      .then(([rows]) => rows).catch(() => []),
    previewSlugs.has(slug)
      ? db.query<(PreviewReview & RowDataPacket)[]>(`SELECT id, reviewer_name, content, image_url, review_date
        FROM homepage_naver_reviews WHERE is_active = 1 AND branch_name = ? ORDER BY review_date DESC, id DESC`, [branch.name])
        .then(([rows]) => rows).catch(() => [])
      : Promise.resolve([]),
  ]);

  function getThumb(post: PreviewPost): string | null {
    if (post.thumbnail) return post.thumbnail;
    const s = String(post.content || "");
    const m = s.match(/<img[^>]+src=["']([^"']+)["']/i) || s.match(/!\[.*?\]\((.*?)\)/);
    return m?.[1] ?? null;
  }

  if (previewSlugs.has(slug)) {
    const mediaRoot = `/images/${slug}`;
    const isMokdong = slug === "mokdong";
    return (
      <BranchPreview
        branch={branch}
        photos={[
          { src: `${mediaRoot}/${isMokdong ? "mokdong-training" : "training"}.jpg`, label: `${branch.name} 운동 모습` },
          { src: `${mediaRoot}/${isMokdong ? "mokdong-main" : "gym"}.jpg`, label: `${branch.name} 체육관 내부` },
          { src: branch.image, label: `${branch.name} 대표 사진` },
        ]}
        coaches={coaches}
        posts={relatedPosts}
        reels={branchReels.length ? branchReels : getLocalClips(slug, branch.name)}
        reviews={reviews}
        audience={audience}
        faq={faqItems}
        workout={workout}
        galleryImages={isMokdong ? galleryImages : [`${mediaRoot}/facility.jpg`]}
        getThumb={getThumb}
      />
    );
  }

  /* ── 운동 안내 패널들 ── */
  const programPanel = (
    <div className="grid gap-4 md:grid-cols-3">
      {workout.program.map(([title, desc]) => (
        <div key={title} className="rounded-[14px] border border-[#4A4C50]/30 bg-[#141416] p-7 hover:-translate-y-1 transition-transform duration-200">
          <h3 className="mb-3 font-black text-base" style={{ color: "#F5F4F1" }}>{title}</h3>
          <p className="text-sm leading-7" style={{ color: "#8A8D91" }}>{desc}</p>
        </div>
      ))}
    </div>
  );

  const workoutFlowPanel = (
    <div className="rounded-[14px] border border-[#4A4C50]/30 bg-[#141416] p-8">
      <p className="mb-6 text-xs font-black tracking-[0.25em]" style={{ color: "#5A5C61" }}>1회 수업 흐름</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {workout.flow.map(([n,s]) => (
          <div key={n} className="flex flex-col items-center gap-2 rounded-[10px] border border-[#4A4C50]/20 bg-[#1A1A1C] p-4 text-center">
            <span className="text-[10px] font-black" style={{ color: "#5A5C61" }}>{n}</span>
            <span className="text-xs font-bold leading-tight" style={{ color: "#8A8D91" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const firstVisitPanel = (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {workout.firstVisit.map(([step, title, desc]) => (
        <div key={step} className="rounded-[14px] border border-[#4A4C50]/25 bg-[#141416] p-6">
          <p className="mb-4 text-xl font-black" style={{ color: "#2A2A2E" }}>{step}</p>
          <h3 className="mb-2 font-black text-sm" style={{ color: "#F5F4F1" }}>{title}</h3>
          <p className="text-sm leading-6" style={{ color: "#8A8D91" }}>{desc}</p>
        </div>
      ))}
    </div>
  );

  /* ── 지점 이야기 패널들 ── */
  const newsPanel = (
    <div>
      {relatedPosts.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: "#5A5C61" }}>등록된 소식이 없습니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post) => {
            const thumb = getThumb(post);
            return (
              <a key={post.id} href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[14px] border border-[#4A4C50]/30 bg-[#141416] hover:-translate-y-1 transition-transform duration-200">
                <div className="h-[160px] overflow-hidden bg-[#1A1A1C]">
                  {thumb && <img src={thumb} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-sm line-clamp-2 leading-snug" style={{ color: "#F5F4F1" }}>{post.title}</h3>
                  <p className="mt-1 text-xs line-clamp-2" style={{ color: "#8A8D91" }}>{post.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/blog" className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-black transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8A8D91" }}>전체 소식 보기 →</Link>
      </div>
    </div>
  );

  const galleryPanel = (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {galleryImages.map((src, i) => (
        <div key={i} className="overflow-hidden rounded-[12px]" style={{ aspectRatio: "4/3" }}>
          <img src={src} alt={`${branch.name} 시설 ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0E0E10] text-white">
      <SiteHeader />

      {/* ── HERO (compact) ── */}
      <section className="relative overflow-hidden" style={{ background: "#080808" }}>
        <div className="absolute inset-0">
          <img src={branch.image} alt={branch.fullName} className="h-full w-full object-cover" style={{ filter: "brightness(0.18) grayscale(0.2)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.6) 55%, rgba(8,8,8,0.15) 100%)" }} />
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full" style={{ background: "#D01E2E" }} />

        <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-10 px-6 py-20 md:min-h-[70vh] md:grid-cols-[1fr_420px] lg:px-10">
          <div>
            <Link href="/" className="mb-8 inline-block text-xs text-[#4A4C50] transition hover:text-white">← 메인으로</Link>
            <p className="mb-5 text-[10px] font-black tracking-[0.38em] text-[#D01E2E]">STRONG BOXING BRANCH</p>
            <h1 className="font-black leading-[0.9] tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(36px, 5vw, 68px)" }}>
              {branch.area} 복싱장<br />{branch.fullName}
            </h1>
            <div className="my-6 h-[2px] w-10" style={{ background: "#D01E2E" }} />
            <p className="max-w-lg text-sm leading-8 text-[#8A8D91]">{branch.description}</p>

            {branch.highlights && (
              <div className="mt-5 flex flex-wrap gap-2">
                {branch.highlights.map((tag: string) => (
                  <span key={tag} className="rounded-full border border-[#D01E2E]/30 bg-[#D01E2E]/10 px-3 py-1 text-xs font-bold text-[#D01E2E]">{tag}</span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {branch.booking && (
                <a href={branch.booking} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
                  style={{ background: "#D01E2E" }}>
                  네이버 예약 →
                </a>
              )}
              {branch.kakaoChat && (
                <a href={branch.kakaoChat} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-black transition"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>
                  카카오 상담
                </a>
              )}
              <a href="#contact"
                className="inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-black transition"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#8A8D91" }}>
                방문 상담 신청
              </a>
            </div>

            <div className="mt-10 flex flex-col gap-1.5 text-sm" style={{ color: "#5A5C61" }}>
              <span>{branch.phone}</span>
              <span>{branch.hours.join(" · ")}</span>
              <span className="text-xs">{branch.address}</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="overflow-hidden rounded-[14px]" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
              <img src={branch.image} alt={branch.fullName}
                className="h-[480px] w-full object-cover" style={{ filter: "brightness(0.9)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 지도진 ── */}
      {coaches.length > 0 && (
        <section className="px-6 py-16 md:px-10" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-[1280px] lg:px-4">
            <p className="mb-3 text-xs font-black tracking-[0.32em] text-[#D01E2E]">COACHES</p>
            <h2 className="mb-8 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
              {branch.name} 지도진
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {/* 한솔 대표 */}
              <a href="https://www.instagram.com/strongboxing_kr" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-[14px] border border-[rgba(74,76,80,0.3)] bg-[#1A1A1C] px-6 py-5 transition hover:border-[rgba(208,30,46,0.4)]">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#D01E2E]/30">
                  <img src="/images/coaches/hansol.jpg" alt="한솔 대표" className="h-full w-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.15em]" style={{ color: "#D01E2E" }}>DIRECTOR</p>
                  <p className="font-black" style={{ color: "#F5F4F1" }}>한솔 대표</p>
                  <p className="text-xs" style={{ color: "#5A5C61" }}>@strongboxing_kr</p>
                </div>
              </a>

              {coaches.map((c) => (
                <a key={c.name} href={`https://www.instagram.com/${c.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[14px] border border-[rgba(74,76,80,0.3)] bg-[#1A1A1C] px-6 py-5 transition hover:border-[rgba(74,76,80,0.6)]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[rgba(74,76,80,0.4)] font-black text-sm" style={{ background: "#2A2A2E", color: "#8A8D91" }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.15em]" style={{ color: "#5A5C61" }}>{c.role.toUpperCase()}</p>
                    <p className="font-black" style={{ color: "#F5F4F1" }}>{c.name} {c.role}</p>
                    <p className="text-xs" style={{ color: "#5A5C61" }}>@{c.instagram}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 클립 ── */}
      {branchReels.length > 0 && (
        <section className="px-6 py-16 md:px-10" style={{ background: "#0E0E10" }}>
          <div className="mx-auto max-w-[1280px] lg:px-4">
            <p className="mb-3 text-xs font-black tracking-[0.32em] text-[#D01E2E]">STRONG CLIP</p>
            <h2 className="mb-8 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
              {branch.name} 클립
            </h2>
            <div className="overflow-x-auto pb-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4C50 transparent" }}>
              <div className="flex gap-4">
                {branchReels.map((reel) => (
                  <BranchReelCard key={reel.id} reel={reel} />
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs text-center" style={{ color: "#4A4C50" }}>← 옆으로 넘겨 수업 클립 더 보기 →</p>
          </div>
        </section>
      )}

      {/* ── 이런 분들이 많이 찾아요 ── */}
      {audience.length > 0 && (
        <section className="px-6 py-16 md:px-10" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-[1280px] lg:px-4">
            <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>FOR YOU</p>
            <h2 className="mb-8 font-black tracking-[-0.04em] text-[#F5F4F1]" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              이런 분들이 많이 찾아요
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-[12px] border border-[#4A4C50]/25 bg-[#1A1A1C] px-5 py-4 text-sm text-[#8A8D91]">
                  <span className="mt-[3px] h-2 w-2 shrink-0 rounded-full" style={{ background: "#D01E2E" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 운동 안내 (탭) ── */}
      <section className="px-6 py-16 md:px-10" style={{ background: "#0E0E10" }}>
        <div className="mx-auto max-w-[1280px] lg:px-4">
          <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>PROGRAM</p>
          <h2 className="mb-8 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
            {branch.area} 복싱 운동 안내
          </h2>
          <BranchTabSection
            tabs={["프로그램", "수업 흐름", "첫 방문"]}
            panels={[
              programPanel,
              workoutFlowPanel,
              firstVisitPanel,
            ]}
          />
        </div>
      </section>

      {/* ── 지점 이야기 (탭) ── */}
      <section className="px-6 py-16 md:px-10" style={{ background: "#141416" }}>
        <div className="mx-auto max-w-[1280px] lg:px-4">
          <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>STORY</p>
          <h2 className="mb-8 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
            {branch.name} 이야기
          </h2>
          <BranchTabSection
            tabs={["소식", "시설"]}
            panels={[
              newsPanel,
              galleryPanel,
            ]}
          />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16 md:px-10" style={{ background: "#0E0E10" }}>
        <div className="mx-auto max-w-[1280px] lg:px-4">
          <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>FAQ</p>
          <h2 className="mb-8 font-black tracking-[-0.04em] text-[#F5F4F1]" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
            자주 묻는 질문
          </h2>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ── CTA + 상담 폼 ── */}
      <section id="contact" className="px-6 py-16 md:px-10" style={{ background: "#141416", scrollMarginTop: "80px" }}>
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-black tracking-[0.32em] text-[#D01E2E]">CONSULTATION</p>
          <h2 className="mb-4 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
            지금, 상담을 받아보세요.
          </h2>
          <p className="mb-10 text-sm text-[#8A8D91]">방문 전 상담으로 더 편하게 시작하실 수 있습니다.</p>
          <ConsultationForm />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 md:px-10" style={{ background: "#0E0E10", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-[1280px] flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-black text-sm text-[#F5F4F1]">STRONG BOXING</p>
            <p className="mt-0.5 text-xs" style={{ color: "#5A5C61" }}>{branch.fullName}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#5A5C61" }}>
            <a href={branch.naverMap} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{branch.address}</a>
            <span>{branch.phone}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
