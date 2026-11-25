/* eslint-disable @next/next/no-img-element -- Branch photos and CMS media retain their original URLs. */
import Link from "next/link";
import { CalendarDays, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import VisibleClip from "@/app/components/VisibleClip";
import ConsultationForm from "@/app/components/ConsultationForm";
import BranchPreviewTabs, { TabLink } from "./BranchPreviewTabs";

type Branch = {
  name: string; fullName: string; area: string; region: string; intro: string; description: string; highlights: string[];
  phone: string; address: string; landmark?: string; hours: string[]; booking: string;
  naverMap: string; directions: string; reviewUrl?: string; googleMap?: string; kakaoMap?: string; kakaoChat: string | null; instagram: string;
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
  audience: string[];
  faq: { question: string; answer: string }[];
  workout: { program: string[][]; flow: string[][]; firstVisit: string[][] };
  galleryImages: string[];
  getThumb: (post: PreviewPost) => string | null;
};

const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] bg-[#D01E2E] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#B71C2B]";
const secondary = "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[4px] border border-[#303035] bg-[#141416] px-2 py-2 text-sm font-semibold hover:bg-[#242428]";
const detailsClass = "rounded-[4px] border border-[#29292D] bg-[#161618] p-3.5";
const summaryClass = "cursor-pointer text-sm font-bold";

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-[4px] border border-[#29292D] bg-[#141416] p-4 sm:p-5">
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
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`${label} 사진 보기 (새 창)`} className="group relative block h-full overflow-hidden rounded-[4px] bg-[#141416] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D01E2E]">
      <img src={src} alt={label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
    </a>
  );
}

function BlogPostCard({ post, thumb, compact = false }: { post: PreviewPost; thumb: string | null; compact?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex items-start gap-3 rounded-[4px] border border-[#29292D] p-3 hover:border-[#D01E2E]">
      {thumb && <img src={thumb} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded object-cover sm:h-20 sm:w-20" />}
      <div className="min-w-0 break-words">
        <h3 className="text-sm font-bold">{post.title}</h3>
        {post.description && <p className={`mt-1 text-sm leading-relaxed text-[#B5B5BC] ${compact ? "line-clamp-2" : ""}`}>{post.description}</p>}
      </div>
    </Link>
  );
}

function Clips({ reels, compact = false }: { reels: PreviewReel[]; compact?: boolean }) {
  if (!reels.length) return <p className="text-sm text-[#B5B5BC]">등록된 영상이 없습니다.</p>;
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {reels.map((reel) => (
        <figure key={reel.id} className="min-w-0 overflow-hidden rounded-[4px] border border-[#29292D] bg-[#161618]">
          <VisibleClip src={reel.video_url} title={reel.title} poster={reel.poster} aria-label={reel.aria_label || reel.title} className={`w-full bg-[#242424] object-cover ${compact ? "aspect-[4/3]" : "aspect-[4/5]"}`} />
          <figcaption className="border-t border-white/10 px-3 py-2.5 text-xs font-semibold leading-5 [overflow-wrap:anywhere] sm:text-sm">{reel.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function TrialTerms() {
  return <p className="break-keep text-xs leading-relaxed text-[#C9C9C9]"><strong className="text-[#F5F4F1]">원데이 체험 30,000원</strong> · 당일 등록 시 체험비 전액 차감<br />회원권 가격은 지점에 문의해 주세요.</p>;
}

export default function BranchPreview({ branch, photos, coaches, posts, reels, reviews, audience, faq, workout, galleryImages, getThumb }: Props) {
  const firstPost = posts[0];
  const firstReview = branch.name === "신정점"
    ? reviews.find(({ content }) => /오전|키즈|아이|초등/.test(content || "") && !/휴게|브레이크/.test(content || ""))
    : reviews[0];
  const sidebar = (
    <>
      <Card title="원데이 클래스">
        <div className="mb-3"><TrialTerms /></div>
        <a className={`${primary} w-full`} href={branch.booking} target="_blank" rel="noopener noreferrer">예약 종류 보기 ↗</a>
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
    <main className="min-h-screen bg-[#0E0E10] text-[#F5F4F1]">
      <header className="border-b border-[#29292D] bg-[#141416]">
        <div className="mx-auto flex min-h-14 max-w-[1136px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
          <Link href="/" aria-label="스트롱복싱 홈" className="flex shrink-0 items-center gap-2.5">
            <img src="/icon.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-black tracking-[0.08em] text-[#F5F4F1]">STRONG</span>
              <span className="text-[9px] font-black tracking-[0.22em] text-[#D01E2E]">— BOXING —</span>
            </span>
          </Link>
          <nav aria-label="사이트 메뉴" className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#B5B5BC]">
            <Link href="/#branches">지점 안내</Link>
            <Link href="/#programs">운동 안내</Link>
            <Link href="/blog">블로그</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1136px] px-4 pb-8 pt-4 sm:px-6 md:pt-6">
        <div className="grid h-[clamp(150px,27vw,328px)] gap-1.5 sm:gap-2" style={{ gridTemplateColumns: photos.length === 1 ? "1fr" : "1.45fr 1fr 1fr" }}>
          {photos.map((photo) => <Photo key={photo.src} {...photo} />)}
        </div>

        <section className="mt-6 grid gap-4 border-b border-white/10 px-0 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(245px,0.43fr)] md:items-center md:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#D01E2E]">{branch.region} 복싱장</p>
            <h1 className="mt-1 break-keep text-3xl font-black leading-tight tracking-tight sm:text-[38px]">{branch.fullName}</h1>
            <div className="mt-3 space-y-1 break-keep text-sm leading-relaxed text-[#E8E8EA]">
              <p>{branch.hours.join(" · ")}</p>
              <p>{branch.landmark || branch.address}</p>
            </div>
            <p className="mt-2 max-w-[62ch] break-keep text-sm leading-7 text-[#B5B5BC]">{branch.intro}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">{branch.highlights.map((tag) => <li key={tag} className="rounded border border-white/10 px-2 py-1 text-xs font-semibold">{tag}</li>)}</ul>
          </div>
          <div className="grid gap-2">
            <TrialTerms />
            <a href={branch.booking} target="_blank" rel="noopener noreferrer" className={primary}><CalendarDays size={17} aria-hidden="true" /> 예약 종류 보기</a>
            <div className="flex gap-1.5 [&>a]:flex-1">
              <a href={`tel:${branch.phone}`} className={secondary}><Phone size={15} aria-hidden="true" /> 전화</a>
              {branch.kakaoChat && <a href={branch.kakaoChat} target="_blank" rel="noopener noreferrer" className={secondary}><MessageCircle size={15} aria-hidden="true" /> 카카오</a>}
              <a href={branch.naverMap} target="_blank" rel="noopener noreferrer" className={secondary}><MapPin size={15} aria-hidden="true" /> 길찾기</a>
            </div>
          </div>
        </section>

        <BranchPreviewTabs sidebar={sidebar} panels={{
          home: <>
            <Card title="처음 방문하실 때" action={<TabLink tab="workout">운동 안내 →</TabLink>}>
              <p className="break-keep text-sm leading-7 text-[#C9C9C9]">첫날에는 기본 자세와 스텝부터 배워요. 운영시간에 편하게 방문하면 관장·코치가 개인별 진도를 살펴드립니다.</p>
            </Card>
            <Card title={`${branch.name} 클립`} action={<TabLink tab="videos">영상 더보기 →</TabLink>}>
              <Clips reels={reels.slice(0, 6)} compact />
            </Card>

            <div className="grid gap-5 sm:grid-cols-2">
              <Card title={`${branch.name} 블로그`} action={<TabLink tab="blog">전체 보기 →</TabLink>}>
                {firstPost ? <BlogPostCard post={firstPost} thumb={getThumb(firstPost)} compact /> : <p className="text-sm text-[#B5B5BC]">지점 소식은 스트롱복싱 블로그에서 확인할 수 있습니다.</p>}
              </Card>
              <Card title="직접 남긴 회원 후기" action={<TabLink tab="reviews">리뷰 보기 →</TabLink>}>
                {firstReview ? <><p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed">{firstReview.content}</p><p className="mt-2 text-xs text-[#B5B5BC]">{firstReview.reviewer_name || "네이버 리뷰"}</p></> : <p className="text-sm text-[#B5B5BC]">리뷰는 네이버 플레이스에서 확인할 수 있습니다.</p>}
              </Card>
            </div>

            {coaches.length > 0 && <Card title={`${branch.name} 지도진`}>
              <div className="grid gap-2 sm:grid-cols-2">
                {coaches.map((coach) => <a key={coach.name} href={`https://www.instagram.com/${coach.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-[4px] bg-[#1A1A1C] p-3">
                  <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#141416] font-bold">{coach.name[0]}</span>
                  <span className="min-w-0 break-words text-sm"><strong>{coach.name} {coach.role}</strong><br /><span className="text-xs text-[#B5B5BC]">@{coach.instagram}</span></span>
                </a>)}
              </div>
            </Card>}

            <Card title="이런 분들이 많이 찾아요">
              <ul className="flex flex-wrap gap-2">{audience.map((item) => <li key={item} className="rounded bg-[#1A1A1C] px-2 py-1 text-sm">{item}</li>)}</ul>
            </Card>
            <Card title="자주 묻는 질문">
              <div className="divide-y divide-white/10">{faq.map(({ question, answer }) => (
                <details className="py-3 first:pt-0 last:pb-0" key={question}>
                  <summary className={summaryClass}>{question}</summary>
                  <p className="mt-2 max-w-[62ch] break-keep text-sm leading-7 text-[#C9C9C9]">{answer}</p>
                  {question === "네이버로 예약할 수 있나요?" && (
                    <a href={branch.booking} target="_blank" rel="noopener noreferrer" className={`${primary} mt-3`}>
                      {branch.name} 예약 종류 보기 ↗
                    </a>
                  )}
                </details>
              ))}</div>
            </Card>
          </>,
          blog: <Card title={`${branch.name} 블로그`}>
            {posts.length > 0 ? <div className="space-y-2">{posts.map((post) => <BlogPostCard key={post.id} post={post} thumb={getThumb(post)} />)}</div> : <p className="text-sm text-[#B5B5BC]">지점 소식은 스트롱복싱 블로그에서 확인할 수 있습니다.</p>}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-[#D01E2E]">
              <Link href={`${process.env.DB_HOST ? "" : "https://strongboxing.kr"}/blog?branch=${encodeURIComponent(branch.name)}`}>{branch.name} 블로그 더 보기 →</Link>
            </div>
          </Card>,
          videos: <Card title={`${branch.name} 클립`}><Clips reels={reels} /></Card>,
          workout: <Card title={`${branch.area} 복싱 운동 안내`}>
            <p className="mb-4 break-keep text-sm leading-6 text-[#B5B5BC]">운영시간에 방문해 각자 운동하는 동안 관장·코치가 필요한 동작을 짚어주고 다음에 연습할 내용을 안내해요.</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {workout.program.map(([title, description]) => (
                <div key={title} className="rounded-[4px] bg-[#1A1A1C] p-3">
                  <h3 className="mb-1 text-sm font-bold">{title}</h3>
                  <p className="break-keep text-sm leading-relaxed text-[#B5B5BC]">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <details className={detailsClass}>
                <summary className={summaryClass}>1회 수업 흐름</summary>
                <ol className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">{workout.flow.map(([step, title]) => <li key={step}><span className="mr-1 font-bold text-[#D01E2E]">{step}</span>{title}</li>)}</ol>
              </details>
              <details className={detailsClass}>
                <summary className={summaryClass}>첫 방문</summary>
                <ol className="mt-3 space-y-2 text-sm">{workout.firstVisit.map(([step, title, description]) => <li key={step}><strong>{step} {title}</strong><p>{description}</p></li>)}</ol>
              </details>
            </div>
          </Card>,
          reviews: <Card title={`${branch.name} 회원들이 직접 남긴 네이버 리뷰`}>
            {reviews.length === 0 && <p className="text-sm text-[#B5B5BC]">네이버 플레이스에서 {branch.name} 방문자 후기를 볼 수 있습니다.</p>}
            <div className="space-y-2">{reviews.map((review) => (
              <details key={review.id} className={detailsClass}>
                <summary className={summaryClass}>{review.reviewer_name || "네이버 리뷰"} {review.review_date && <span className="ml-2 text-xs font-normal text-[#B5B5BC]">{typeof review.review_date === "string" ? review.review_date : review.review_date.toISOString().slice(0, 10)}</span>}</summary>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{review.content}</p>
                {review.image_url && <img src={review.image_url} alt="네이버 리뷰 캡처" loading="lazy" className="mt-2 max-h-80 max-w-full rounded object-contain" />}
              </details>
            ))}</div>
            <a href={branch.reviewUrl || branch.naverMap} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-bold text-[#D01E2E]">네이버 플레이스 리뷰 보기 ↗</a>
          </Card>,
          location: <Card title="시설·위치">
            <p className="mb-2 break-keep text-sm leading-7 text-[#C9C9C9]">{branch.directions}</p>
            <p className="mb-4 break-keep text-sm text-[#B5B5BC]">{branch.address}{branch.landmark && !branch.address.includes(branch.landmark) ? ` · ${branch.landmark}` : ""}</p>
            <div className={galleryImages.length === 1 ? "h-52 sm:h-72" : "grid auto-rows-[120px] grid-cols-2 gap-2 sm:auto-rows-[155px]"}>
              {galleryImages.map((src, index) => <Photo key={src} src={src} label={galleryImages.length === 1 ? `${branch.name} 시설` : `스트롱복싱 갤러리 사진 ${index + 1}`} />)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={branch.naverMap} target="_blank" rel="noopener noreferrer" className={`${secondary} px-4`}>네이버 지도 ↗</a>
              {branch.kakaoMap && <a href={branch.kakaoMap} target="_blank" rel="noopener noreferrer" className={`${secondary} px-4`}>카카오맵 ↗</a>}
              {branch.googleMap && <a href={branch.googleMap} target="_blank" rel="noopener noreferrer" className={`${secondary} px-4`}>구글 지도 ↗</a>}
            </div>
          </Card>,
        }} />

        <details id="contact" className="scroll-mt-4 rounded-[4px] border border-[#29292D] bg-[#141416] p-4 target:ring-2 target:ring-[#D01E2E] sm:p-5">
          <summary className="cursor-pointer text-lg font-extrabold tracking-tight">지금, 상담을 받아보세요.</summary>
          <p className="mt-2 text-sm text-[#B5B5BC]">방문 전 상담으로 더 편하게 시작하실 수 있습니다.</p>
          <div className="mt-4 max-sm:[&_.grid-cols-2]:grid-cols-1">
            <ConsultationForm theme="dark" previewBranch={{ name: branch.name, address: branch.address, phone: branch.phone, naverUrl: branch.naverMap }} />
          </div>
        </details>
        <footer className="mt-7 border-t border-[#29292D] pt-5 text-center text-xs font-semibold text-[#B5B5BC]">STRONG BOXING · {branch.fullName}</footer>
      </div>
    </main>
  );
}
