import type { getBranchNaverBlog } from "@/lib/naver-branch-blog";
/* eslint-disable @next/next/no-img-element -- Keep original branch and CMS media URLs. */
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import ConsultationForm from "@/app/components/ConsultationForm";
import VisibleClip from "@/app/components/VisibleClip";
import { branchLanding, branchSlugs } from "@/lib/branch-landing";
import { reservationAttribution } from "@/lib/reservation-attribution";
import type { ReactNode } from "react";

type Branch = {
  name: string; fullName: string; area: string; region: string; intro: string; description: string; highlights: string[];
  phone: string; address: string; landmark?: string; hours: string[]; booking: string;
  naverMap: string; directions: string; reviewUrl?: string; googleMap?: string; kakaoMap?: string; kakaoChat: string | null; instagram: string;
};
type Slug = keyof typeof branchLanding;
export type PreviewPost = { id: number; title: string; slug: string; description: string | null; thumbnail: string | null; content: string | null };
export type PreviewReel = { id: number; title: string; aria_label: string | null; video_url: string; poster?: string };
export type PreviewReview = { id: number; reviewer_name: string | null; content: string; image_url: string | null; review_date: string | Date | null };

type Props = {
  branch: Branch;
  slug: Slug;
  query: Record<string, string | string[] | undefined>;
  photos: { src: string; label: string }[];
  coaches: { name: string; role: string; instagram: string }[];
  posts: PreviewPost[];
  naverBlog: Awaited<ReturnType<typeof getBranchNaverBlog>>;
  reels: PreviewReel[];
  reviews: PreviewReview[];
  faq: { question: string; answer: string }[];
  galleryImages: { src: string; alt: string; focusBottom?: boolean }[];
  getThumb: (post: PreviewPost) => string | null;
};

const button = "inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-center text-sm font-bold";
const primary = button + " bg-[#D01E2E] text-white hover:bg-[#B71C2B]";
const secondary = button + " border border-white/20 bg-[#222224] text-white hover:bg-[#303034]";
const card = "rounded-lg border border-white/10 bg-[#161618] p-4 sm:p-6";
const body = "break-keep text-sm leading-6 text-zinc-300";
const coachDescriptions: Record<string, string> = {
  nan_yong_: "학생과 성인 입문자의 자세를 살피고 각자의 진도에 맞춰 기본기를 지도합니다.",
  "chan.__2": "미트 트레이닝을 통해 체력과 운동 루틴을 기르는 데 도움을 줍니다.",
  robuste_hyeok: "회원의 체력에 맞춰 강도를 조절하며 복싱 스텝부터 지도합니다.",
  jdj_00_: "복싱이 처음인 회원에게 미트 운동과 유산소 루틴을 안내합니다.",
  dkswkd3: "운동이 처음인 회원이 적응할 수 있도록 기본 자세부터 직접 지도합니다.",
  strongboxing_andy: "선수 경험을 바탕으로 자세를 살피며 단계별로 지도합니다.",
  ws_nakmuay: "초보자의 타격 균형과 체력에 맞춰 미트 운동을 지도합니다.",
};
const timeline = [
  ["0~10분", "스트레칭과 준비 운동"],
  ["10~25분", "기본 자세와 스텝"],
  ["25~40분", "미트 트레이닝"],
  ["40~50분", "샌드백과 마무리"],
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className={card}><h2 className="mb-4 text-xl font-black">{title}</h2>{children}</section>;
}

export default function BranchPreview({ branch, slug, query, photos, coaches, posts, naverBlog, reels, reviews, faq, galleryImages, getThumb }: Props) {
  const copy = branchLanding[slug];
  const attribution = reservationAttribution({ ...query, branch: slug });
  const oneDay = query.reserve === "trial";
  const phone = "tel:" + branch.phone;
  const bookingLink = (kind: "trial" | "consultation") =>
    "/" + slug + "?" + new URLSearchParams({ ...attribution, reserve: kind }) + "#contact";
  const representative = photos[0];

  return (
    <main className="min-h-screen bg-[#101012] pb-24 text-white md:pb-8">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#101012]">
        <nav aria-label="지점 메뉴" className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4 md:min-h-[60px] md:px-6">
          <Link href="/" className="inline-flex shrink-0 items-center gap-2 font-black tracking-tight">
            <img src="/icon.png" width={26} height={26} alt="" className="size-[26px] object-contain" />
            <span>스트롱복싱</span>
          </Link>
          <div className="flex shrink-0 items-center gap-3 sm:gap-7">
            <details className="group relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-zinc-300 transition hover:text-white [&::-webkit-details-marker]:hidden">
                지점 안내 <ChevronDown size={14} aria-hidden="true" className="group-open:rotate-180" />
              </summary>
              <ul className="absolute right-0 top-full mt-1 min-w-32 rounded-md border border-white/15 bg-[#19191c] p-1 shadow-xl">
                {branchSlugs.map((item) => <li key={item}><Link href={"/" + item + "?" + new URLSearchParams({ ...attribution, branch: item })} aria-current={item === slug ? "page" : undefined} className="block rounded px-3 py-2 text-sm hover:bg-white/10">{branchLanding[item].title.split(" 복싱장")[0]}점</Link></li>)}
              </ul>
            </details>
            <a href="#contact" className={primary + " whitespace-nowrap sm:px-5"}>예약하기</a>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl space-y-4 px-4 pt-5 md:space-y-6 md:px-6 md:pt-4">
        <section className="grid items-center gap-5 pb-2 md:grid-cols-[1.1fr_0.9fr] md:pb-7 md:pt-5">
          <div>
            <p className="text-sm font-bold text-[#FF868F]">{branch.region}</p>
            <h1 className="mt-2 break-keep text-[clamp(1.7rem,4vw,3rem)] font-black leading-tight tracking-tight">{copy.heading}</h1>
            <p className={"mt-3 " + body}>{copy.intro}</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              {["초보 입문", slug === "mokdong" || slug === "sinjeong" ? "밤 12시까지" : "퇴근 후 복싱", slug === "mokdong" || slug === "sinjeong" ? "키즈·학생" : "학생 복싱"].map((tag) => <li key={tag} className="rounded bg-white/10 px-2 py-1">{tag}</li>)}
            </ul>
            <p className={"mt-3 " + body}>{branch.hours.join(" · ")}<br />{copy.landmark} · <a href={phone} className="underline">주차 문의</a><br />운영시간 내 자유 방문 · 1개월 단위 등록</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={bookingLink("trial")} className={primary} prefetch={false}>{branch.name} 원데이 체험</Link>
              <Link href={bookingLink("consultation")} className={secondary} prefetch={false}>{branch.name} 방문 상담</Link>
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-300">체험비 30,000원 현장결제 · 당일 등록 시 전액 차감<br />체험만 하고 돌아가셔도 괜찮습니다.</p>
          </div>
          {representative && <img src={representative.src} alt={representative.label} fetchPriority="high" className="hidden aspect-[4/3] w-full rounded-lg object-cover md:block" />}
        </section>

        <Section title={branch.name + " 오시는 길과 운영시간"}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={body}>
              <p className="font-bold text-white">{branch.address}</p>
              <p className="mt-1">{branch.directions}</p>
              <p className="mt-1">출구별 도보 경로는 지도에서, 주차 가능 여부는 <a href={phone} className="underline">지점에 문의</a>해 주세요.</p>
              <ul className="mt-3 list-inside list-disc">{branch.hours.map((hours) => <li key={hours}>{hours}</li>)}</ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className={secondary} href={branch.naverMap} target="_blank" rel="noreferrer">네이버 지도</a>
                {branch.kakaoMap && <a className={secondary} href={branch.kakaoMap} target="_blank" rel="noreferrer">카카오맵</a>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {galleryImages.map(({ src, alt, focusBottom }) => (
                <img key={src} src={src} alt={alt} loading="lazy" decoding="async"
                  className={"aspect-[4/3] w-full rounded object-cover only:col-span-2" + (focusBottom ? " object-bottom" : "")} />
              ))}
            </div>
          </div>
        </Section>

        <Section title="추천 방문 시간">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr className="border-b border-white/15"><th scope="col" className="p-2">운동하기 좋은 때</th><th scope="col" className="p-2">추천 시간</th></tr></thead>
            <tbody>
              <tr className="border-b border-white/10"><th scope="row" className="p-2 font-medium">기초 코칭을 받고 싶을 때</th><td className="p-2">{copy.daytime}</td></tr>
              <tr><th scope="row" className="p-2 font-medium">퇴근 후 활기찬 분위기</th><td className="p-2">평일 오후 7~10시</td></tr>
            </tbody>
          </table>
          <p className={"mt-3 " + body}>운영시간을 기준으로 추천하는 시간입니다. 당일 혼잡도나 코칭 가능 시간은 지점에 확인해 주세요.</p>
        </Section>

        <Section title={branch.name + " 지도진"}>
          <p className={body}>{copy.coaching}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {coaches.map(({ name, role, instagram }) => <li key={instagram} className="rounded bg-white/5 p-3"><a className="font-bold underline-offset-4 hover:underline" href={"https://www.instagram.com/" + instagram + "/"} target="_blank" rel="noreferrer">{name} {role}</a>{coachDescriptions[instagram] && <p className={"mt-1 " + body}>{coachDescriptions[instagram]}</p>}</li>)}
            {coaches.length === 0 && <li><a className={secondary} href={branch.instagram} target="_blank" rel="noreferrer">{branch.name} 인스타그램</a></li>}
          </ul>
          <p className="mt-3 text-xs text-zinc-300">스트롱복싱 체육관 가입 단체 · KBF · KBM · KBC · KBA · KABA</p>
          <Link href="/#coaches" className="mt-3 inline-block text-xs text-zinc-300 underline">스트롱복싱 지도진 보기</Link>
        </Section>

        <Section title={branch.name + " 운동 영상과 회원 후기"}>
          <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
            {reels.slice(0, 4).map((reel) => <li key={reel.id} className="w-40 shrink-0 snap-start sm:w-52">
              <VisibleClip src={reel.video_url} poster={reel.poster} fallbackSrc={"/videos/" + slug + "/001.mp4"} className="aspect-[4/5] w-full rounded bg-black object-cover" aria-label={reel.aria_label || reel.title} />
              <p className="mt-2 text-xs text-zinc-300">{reel.title}</p>
            </li>)}
          </ul>
          {reviews.length > 0 && <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {reviews.slice(0, 3).map((review) => <li key={review.id} className="rounded bg-white/5 p-3"><blockquote className={"line-clamp-4 " + body}>{review.content}</blockquote><p className="mt-2 text-xs text-zinc-400">{review.reviewer_name || "네이버 회원"}</p></li>)}
          </ul>}
          <a className={secondary + " mt-3"} href={branch.reviewUrl || branch.naverMap} target="_blank" rel="noreferrer">네이버 플레이스 후기</a>
          {posts.length > 0 && <details className="mt-4"><summary className="cursor-pointer font-semibold">{branch.name} 활동기록과 블로그</summary><ul className="mt-3 space-y-3">
            {posts.map((post) => { const thumbnail = getThumb(post); return <li key={post.id}><Link href={"/blog/" + post.slug} className="flex items-center gap-3 text-sm hover:underline">{thumbnail && <img src={thumbnail} alt="" loading="lazy" className="size-12 rounded object-cover" />}{post.title}</Link></li>; })}
          </ul></details>}
        </Section>

        {naverBlog && <Section title={branch.name + " 네이버 블로그"}>
          {naverBlog.posts.length > 0 && <ul className="divide-y divide-white/10">
            {naverBlog.posts.map(({ title, url, publishedAt }) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-baseline justify-between gap-3 py-3 text-sm hover:underline">
                  <span className="break-keep font-semibold">{title}</span>
                  {publishedAt && <time dateTime={publishedAt} className="shrink-0 text-xs text-zinc-400">
                    {new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium" }).format(new Date(publishedAt))}
                  </time>}
                </a>
              </li>
            ))}
          </ul>}
          <a className={secondary + " mt-3"} href={naverBlog.url} target="_blank" rel="noopener noreferrer">네이버 블로그에서 더 보기 ↗</a>
        </Section>}

        <Section title="원데이 체험 50분">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {timeline.map(([time, step]) => <li key={time} className="rounded bg-white/5 p-3 text-sm"><span className="block text-xs font-bold text-[#FF868F]">{time}</span>{step}</li>)}
          </ol>
          <p className={"mt-3 " + body}>진행 시간은 운동 경험과 체력에 따라 조정될 수 있습니다. 체험은 30,000원 현장결제이며 당일 등록 시 체험비가 전액 차감됩니다.</p>
          <p className={"mt-2 " + body}>체험만 하고 돌아가셔도 괜찮습니다. 등록을 원하시면 장기 약정 없이 1개월 단위로 시작할 수 있습니다.</p>
          <h3 className="mb-2 mt-5 font-bold">자주 묻는 질문</h3>
          {faq.map(({ question, answer }) => <details key={question} className="border-t border-white/10 py-3"><summary className="cursor-pointer text-sm font-bold">{question}</summary><p className={"mt-2 " + body}>{answer}</p></details>)}
        </Section>

        <div id="contact" className="scroll-mt-16 overflow-hidden rounded-lg border border-white/10">
          <ConsultationForm key={oneDay ? "trial" : "consultation"} compactDesktop lockBranch initialOneDay={oneDay} attribution={attribution}
            previewBranch={{ name: branch.name, address: branch.address, phone: branch.phone }} />
          <div className="px-4 pb-4 text-center"><a className="text-sm text-zinc-300 underline" href={branch.booking} target="_blank" rel="noreferrer">네이버로 예약하기</a></div>
        </div>
        <footer className="py-4 text-center text-xs text-zinc-400">스트롱복싱 · {branch.name}</footer>
      </div>

      <nav aria-label="빠른 문의 및 예약" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-white/15 bg-[#101012] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <a href={phone} className={secondary}>전화 문의</a>
        <a href="#contact" className={primary}>{branch.name} 원데이·상담 예약</a>
      </nav>
    </main>
  );
}
