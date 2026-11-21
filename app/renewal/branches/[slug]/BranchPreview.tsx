/* eslint-disable @next/next/no-img-element -- Branch photos and CMS media retain their original URLs. */
import Link from "next/link";
import type { BranchLocalContent } from "@/lib/branch-introductions";
import { CalendarDays, Camera, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import ConsultationForm from "@/app/components/ConsultationForm";
import BranchPreviewTabs, { ConsultationLink, TabLink } from "./BranchPreviewTabs";

type Branch = {
  name: string; fullName: string; area: string; description: string; highlights: string[];
  phone: string; address: string; hours: string[]; booking: string;
  naverMap: string; kakaoMap?: string; kakaoChat: string | null; instagram: string;
};

export type PreviewPost = { id: number; title: string; slug: string; description: string | null; thumbnail: string | null; content: string | null };
export type PreviewReel = { id: number; title: string; aria_label: string | null; video_url: string; poster?: string };
export type PreviewReview = { id: number; reviewer_name: string | null; content: string; image_url: string | null; review_date: string | Date | null };

type Props = {
  branch: Branch;
  photos: { src: string; label: string }[];
  coaches: { name: string; role: string; instagram: string }[];
  posts: PreviewPost[];
  reels: PreviewReel[];
  reviews: PreviewReview[];
  introduction: string;
  localContent: BranchLocalContent;
  audience: string[];
  faq: { question: string; answer: string }[];
  workout: { program: string[][]; flow: string[][]; firstVisit: string[][] };
  galleryImages: string[];
  getThumb: (post: PreviewPost) => string | null;
};

const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#c8102e] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#a30c25]";
const secondary = "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-[#e1ded9] bg-white px-2 py-2 text-sm font-semibold hover:bg-[#f5f3ef]";
const detailsClass = "rounded-md border border-[#e7e3de] bg-[#faf9f7] p-3.5";
const summaryClass = "cursor-pointer text-sm font-bold";

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-lg border border-[#e3e1dc] bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Photo({ src, label }: { src: string; label: string }) {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`${label} 사진 보기 (새 창)`} className="group relative block h-full overflow-hidden rounded-md bg-[#dedbd4]">
      <img src={src} alt={label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
      <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-black/75 px-1.5 py-1 text-[11px] font-semibold text-white sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-xs">
        <Camera aria-hidden="true" size={13} /> 사진 보기
      </span>
    </a>
  );
}

function BlogPostCard({ post, thumb, compact = false }: { post: PreviewPost; thumb: string | null; compact?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex items-start gap-3 rounded-md border border-[#ebe8e4] p-3 hover:border-[#c8102e]">
      {thumb && <img src={thumb} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded object-cover sm:h-20 sm:w-20" />}
      <div className="min-w-0 break-words">
        <h3 className="text-sm font-bold">{post.title}</h3>
        {post.description && <p className={`mt-1 text-sm leading-relaxed text-[#55535a] ${compact ? "line-clamp-2" : ""}`}>{post.description}</p>}
      </div>
    </Link>
  );
}

function Clips({ reels, compact = false }: { reels: PreviewReel[]; compact?: boolean }) {
  if (!reels.length) return <p className="text-sm text-[#55535a]">등록된 영상이 없습니다.</p>;
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {reels.map((reel) => (
        <figure key={reel.id} className="min-w-0 overflow-hidden rounded-md border border-[#e7e3de] bg-[#faf9f7]">
          <video src={reel.video_url} title={reel.title} poster={reel.poster} controls playsInline preload="metadata" aria-label={reel.aria_label || reel.title} className={`w-full bg-[#242424] object-cover ${compact ? "aspect-[4/3]" : "aspect-[4/5]"}`} />
          <figcaption className="break-words px-2 py-2 text-xs font-semibold sm:text-sm">{reel.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function TrialTerms() {
  return <p className="rounded-md bg-[#fff1f2] p-3 text-sm leading-relaxed text-[#59343a]">체험비(30,000원)는 방문 후 현장에서 결제합니다. 당일 정식 등록 시 전액 차감됩니다.</p>;
}

export default function BranchPreview({ branch, photos, coaches, posts, reels, reviews, introduction, localContent, audience, faq, workout, galleryImages, getThumb }: Props) {
  const firstPost = posts[0];
  const firstReview = reviews[0];
  const sidebar = (
    <>
      <Card title="원데이 체험">
        <p className="mb-3 text-2xl font-extrabold text-[#b81933]">30,000원</p>
        <a className={`${primary} w-full`} href={branch.booking} target="_blank" rel="noopener noreferrer">네이버 예약 ↗</a>
      </Card>
      <Card title={`${branch.name} 이용 정보`}>
        <dl className="space-y-3 text-sm leading-relaxed">
          <div><dt className="font-bold">운영시간</dt>{branch.hours.map((hour) => <dd key={hour}>{hour}</dd>)}</div>
          <div><dt className="font-bold">주소</dt><dd>{branch.address}</dd></div>
          <div><dt className="font-bold">전화</dt><dd>{branch.phone}</dd></div>
        </dl>
        <a className={`${secondary} mt-4 w-full`} href={branch.instagram} target="_blank" rel="noopener noreferrer">인스타그램 ↗</a>
      </Card>
    </>
  );

  return (
    <main className="min-h-screen bg-[#f4f3f0] text-[#222124]">
      <header className="border-b border-[#e6e4df] bg-white">
        <div className="mx-auto flex min-h-14 max-w-[1136px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
          <Link href="/renewal" className="text-sm font-extrabold tracking-wide">STRONG <span className="text-[#b81933]">BOXING</span></Link>
          <nav aria-label="사이트 메뉴" className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#55535a]">
            <Link href="/renewal#branches">지점 안내</Link>
            <Link href="/renewal#workout">운동 안내</Link>
            <Link href="/blog">블로그</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1136px] px-4 pb-8 pt-4 sm:px-6 md:pt-6">
        <div className="grid h-[clamp(128px,29vw,340px)] grid-cols-[1.24fr_1fr_1fr] gap-1.5 sm:gap-2">
          {photos.map((photo) => <Photo key={photo.src} {...photo} />)}
        </div>

        <section className="mt-4 grid gap-4 rounded-t-lg bg-white p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(245px,0.43fr)] md:items-center md:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#b81933]">{branch.area} 복싱장</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{branch.fullName}</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#55535a]">{branch.description}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">{branch.highlights.map((tag) => <li key={tag} className="rounded bg-[#f4f2ef] px-2 py-1 text-xs font-semibold">{tag}</li>)}</ul>
          </div>
          <div className="grid gap-2">
            <ConsultationLink className={primary}><CalendarDays size={17} aria-hidden="true" /> 무료 상담 예약</ConsultationLink>
            <div className="flex gap-1.5 [&>a]:flex-1">
              <a href={`tel:${branch.phone}`} className={secondary}><Phone size={15} aria-hidden="true" /> 전화</a>
              {branch.kakaoChat && <a href={branch.kakaoChat} target="_blank" rel="noopener noreferrer" className={secondary}><MessageCircle size={15} aria-hidden="true" /> 카카오</a>}
              <a href={branch.naverMap} target="_blank" rel="noopener noreferrer" className={secondary}><MapPin size={15} aria-hidden="true" /> 길찾기</a>
            </div>
          </div>
        </section>

        <BranchPreviewTabs sidebar={sidebar} panels={{
          home: <>
            <Card title={`${branch.area} 복싱 운동 안내`}>
              <div className="grid gap-2 sm:grid-cols-3">
                {workout.program.map(([title, description]) => (
                  <div key={title} className="rounded-md bg-[#f6f4f1] p-3">
                    <h3 className="mb-1 text-sm font-bold">{title}</h3>
                    <p className="text-sm leading-relaxed text-[#55535a]">{description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                <details className={detailsClass}>
                  <summary className={summaryClass}>1회 수업 흐름</summary>
                  <ol className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">{workout.flow.map(([step, title]) => <li key={step}><span className="mr-1 font-bold text-[#b81933]">{step}</span>{title}</li>)}</ol>
                </details>
                <details className={detailsClass}>
                  <summary className={summaryClass}>첫 방문</summary>
                  <ol className="mt-3 space-y-2 text-sm">{workout.firstVisit.map(([step, title, description]) => <li key={step}><strong>{step} {title}</strong><p>{description}</p></li>)}</ol>
                </details>
              </div>
            </Card>

            <Card title={`${branch.name} 클립`} action={<TabLink tab="videos">영상 더보기 →</TabLink>}>
              <Clips reels={reels.slice(0, 3)} compact />
            </Card>

            <div className="grid gap-5 sm:grid-cols-2">
              <Card title={`${branch.name} 블로그`} action={<TabLink tab="blog">전체 보기 →</TabLink>}>
                {firstPost ? <BlogPostCard post={firstPost} thumb={getThumb(firstPost)} compact /> : <p className="text-sm text-[#55535a]">등록된 블로그이 없습니다.</p>}
              </Card>
              <Card title="직접 남긴 회원 후기" action={<TabLink tab="reviews">리뷰 보기 →</TabLink>}>
                {firstReview ? <><p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{firstReview.content}</p><p className="mt-2 text-xs text-[#55535a]">{firstReview.reviewer_name || "네이버 리뷰"}</p></> : <p className="text-sm text-[#55535a]">리뷰는 네이버 플레이스에서 확인할 수 있습니다.</p>}
              </Card>
            </div>

            {coaches.length > 0 && <Card title={`${branch.name} 지도진`}>
              <div className="grid gap-2 sm:grid-cols-2">
                <a href="https://www.instagram.com/strongboxing_official" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md bg-[#f6f4f1] p-3">
                  <img src="/images/coaches/hansol.jpg" alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" />
                  <span className="min-w-0 break-words text-sm"><strong>한솔 대표</strong><br /><span className="text-xs text-[#55535a]">@strongboxing_official</span></span>
                </a>
                {coaches.map((coach) => <a key={coach.name} href={`https://www.instagram.com/${coach.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md bg-[#f6f4f1] p-3">
                  <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white font-bold">{coach.name[0]}</span>
                  <span className="min-w-0 break-words text-sm"><strong>{coach.name} {coach.role}</strong><br /><span className="text-xs text-[#55535a]">@{coach.instagram}</span></span>
                </a>)}
              </div>
            </Card>}

            <Card title={localContent.heading}>
              <p className="text-sm leading-7 break-keep text-[#55535a]">{introduction}</p>
              <details className={`${detailsClass} mt-3`}>
                <summary className={summaryClass}>인근 지역과 복싱 수업 안내</summary>
                <div className="mt-2 space-y-3 text-sm leading-7 break-keep text-[#55535a]">
                  {localContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </details>
            </Card>

            <Card title="이런 분들이 많이 찾아요">
              <ul className="flex flex-wrap gap-2">{audience.map((item) => <li key={item} className="rounded bg-[#f6f4f1] px-2 py-1 text-sm">{item}</li>)}</ul>
            </Card>
            <Card title="자주 묻는 질문">
              <div className="space-y-2">{faq.map(({ question, answer }) => (
                <details className={detailsClass} key={question}><summary className={summaryClass}>{question}</summary><p className="mt-2 text-sm leading-relaxed">{answer}</p></details>
              ))}</div>
            </Card>
          </>,
          blog: <Card title={`${branch.name} 블로그`}>
            {posts.length > 0 ? <div className="space-y-2">{posts.map((post) => <BlogPostCard key={post.id} post={post} thumb={getThumb(post)} />)}</div> : <p className="text-sm text-[#55535a]">등록된 블로그이 없습니다.</p>}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-[#b81933]">
              <Link href="/blog">전체 블로그 보기 →</Link>
            </div>
          </Card>,
          videos: <Card title={`${branch.name} 클립`}><Clips reels={reels} /></Card>,
          pricing: <Card title="이용요금"><TrialTerms /></Card>,
          reviews: <Card title={`${branch.name} 회원들이 직접 남긴 네이버 리뷰`}>
            <div className="space-y-2">{reviews.map((review) => (
              <details key={review.id} className={detailsClass}>
                <summary className={summaryClass}>{review.reviewer_name || "네이버 리뷰"} {review.review_date && <span className="ml-2 text-xs font-normal text-[#55535a]">{typeof review.review_date === "string" ? review.review_date : review.review_date.toISOString().slice(0, 10)}</span>}</summary>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{review.content}</p>
                {review.image_url && <img src={review.image_url} alt="네이버 리뷰 캡처" loading="lazy" className="mt-2 max-h-80 max-w-full rounded object-contain" />}
              </details>
            ))}</div>
            <a href={branch.naverMap} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-bold text-[#b81933]">네이버 플레이스 리뷰 보기 ↗</a>
          </Card>,
          location: <Card title="시설·위치">
            <div className={galleryImages.length === 1 ? "h-52 sm:h-72" : "grid auto-rows-[120px] grid-cols-2 gap-2 sm:auto-rows-[155px]"}>
              {galleryImages.map((src, index) => <Photo key={src} src={src} label={galleryImages.length === 1 ? `${branch.name} 시설` : `스트롱복싱 갤러리 사진 ${index + 1}`} />)}
            </div>
            {branch.kakaoMap && <a href={branch.kakaoMap} target="_blank" rel="noopener noreferrer" className={`${secondary} mt-4 px-4`}>카카오맵에서 보기 ↗</a>}
          </Card>,
        }} />

        <details id="contact" className="scroll-mt-4 rounded-lg border border-[#e3e1dc] bg-white p-4 target:ring-2 target:ring-[#c8102e] sm:p-5">
          <summary className="cursor-pointer text-lg font-extrabold tracking-tight">지금, 상담을 받아보세요.</summary>
          <p className="mt-2 text-sm text-[#55535a]">방문 전 상담으로 더 편하게 시작하실 수 있습니다.</p>
          <div className="mt-4 max-sm:[&_.grid-cols-2]:grid-cols-1">
            <ConsultationForm theme="light" previewBranch={{ name: branch.name, address: branch.address, phone: branch.phone, naverUrl: branch.naverMap }} />
          </div>
        </details>
        <footer className="mt-7 border-t border-[#deddd8] pt-5 text-center text-xs font-semibold text-[#55535a]">STRONG BOXING · {branch.fullName}</footer>
      </div>
    </main>
  );
}
