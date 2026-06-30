import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스트롱복싱 | 지점 인스타그램",
  description: "스트롱복싱 각 지점 인스타그램 바로가기. 목동·신정·개봉·철산·영등포점.",
  openGraph: {
    title: "스트롱복싱 | 지점 인스타그램",
    description: "스트롱복싱 각 지점 인스타그램 바로가기.",
    images: [{ url: "/og.png" }],
  },
};

const links = [
  {
    type: "branch",
    label: "개봉점",
    sub: "@strongboxing_gaebong",
    href: "https://www.instagram.com/strongboxing_gaebong",
    image: "/images/branches/gaebong.jpg",
  },
  {
    type: "branch",
    label: "신정점",
    sub: "@strongboxing_sinjeong",
    href: "https://www.instagram.com/strongboxing_sinjeong",
    image: "/images/branches/sinjeong.jpg",
  },
  {
    type: "branch",
    label: "목동점",
    sub: "@strongboxing_mokdong",
    href: "https://www.instagram.com/strongboxing_mokdong",
    image: "/images/branches/mokdong.png",
  },
  {
    type: "branch",
    label: "철산점",
    sub: "@strongboxing_cheolsan",
    href: "https://www.instagram.com/strongboxing_cheolsan",
    image: "/images/branches/cheolsan.jpg",
  },
  {
    type: "branch",
    label: "영등포점",
    sub: "@stron_gboxinggym",
    href: "https://www.instagram.com/stron_gboxinggym",
    image: "/images/branches/yeongdeungpo.jpg",
  },
  {
    type: "site",
    label: "홈페이지 바로가기",
    sub: "strongboxing.kr",
    href: "https://strongboxing.kr",
    image: null,
  },
  {
    type: "site",
    label: "방문 상담 예약",
    sub: "네이버 예약",
    href: "https://strongboxing.kr/reservation",
    image: null,
  },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-[#16171A] px-4 py-12 text-white">
      <div className="mx-auto max-w-md">

        {/* 프로필 영역 */}
        <div className="mb-10 flex flex-col items-center text-center">
          <img
            src="/icon.png"
            alt="스트롱복싱"
            className="mb-4 h-20 w-20 rounded-full object-contain border border-white/10 bg-[#202126] p-3"
          />
          <h1 className="text-xl font-black tracking-tight">
            STRONG<span className="text-[#FC5230]">BOXING</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">처음이어도 괜찮습니다</p>
          <p className="mt-1 text-sm text-zinc-400">코치가 직접 가르치는 복싱 · 서울 5개 지점</p>
          <p className="mt-2 text-xs text-zinc-600">목동 · 신정 · 개봉 · 철산 · 영등포</p>
        </div>

        {/* 링크 목록 */}
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 overflow-hidden border border-white/10 bg-[#202126] px-5 py-4 transition hover:border-[#FC5230] hover:bg-[#2a2a2e]"
            >
              {/* 썸네일 or 아이콘 */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                {link.image ? (
                  <img
                    src={link.image}
                    alt={link.label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#FC5230]/10">
                    <span className="text-lg text-[#FC5230]">
                      {link.type === "site" && link.label.includes("예약") ? "📅" : "🔗"}
                    </span>
                  </div>
                )}
              </div>

              {/* 텍스트 */}
              <div className="min-w-0 flex-1">
                <p className="font-black tracking-tight">{link.label}</p>
                <p className="text-xs text-zinc-500">{link.sub}</p>
              </div>

              {/* 화살표 */}
              <span className="shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-white">
                →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-zinc-700">
          © 2025 STRONG BOXING
        </p>
      </div>
    </main>
  );
}
