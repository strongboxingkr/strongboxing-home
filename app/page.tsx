import BoxingCalculator from "./components/BoxingCalculator";
import { db } from "@/lib/db";

const branches = [
  {
    slug: "gaebong",
    name: "개봉점",
    image: "/images/branches/gaebong.jpg",
    phone: "02-2060-1279",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    vibe: "URBAN BOXING CLUB",
    review: "초보자도 분위기 좋게 시작하기 좋은 지점",
    score: "4.9",
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
    vibe: "STRONG STANDARD",
    review: "운동 루틴 만들기 좋은 밸런스형 복싱짐",
    score: "4.9",
    instagram: "https://www.instagram.com/strongboxing_sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
  },
  {
    slug: "mokdong",
    name: "목동점",
    image: "/images/branches/mokdong.jpg",
    phone: "02-2643-5971",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    vibe: "PREMIUM TRAINING SPACE",
    review: "깔끔한 공간에서 다이어트 복싱 시작하기 좋음",
    score: "4.9",
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
    hours: ["월-금 13:00~23:00", "토 11:00~16:00"],
    vibe: "NEW STRONG SPACE",
    review: "새롭게 준비된 스트롱복싱 지점",
    score: "NEW",
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "",
    naverMap: "",
  },
  {
    slug: "yeongdeungpo",
    name: "영등포점",
    image: "/images/gallery/gallery-1.jpg",
    phone: "02-831-9312",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    vibe: "CITY BOXING GYM",
    review: "퇴근 후 운동하기 좋은 도심형 복싱짐",
    score: "4.8",
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
    <main className="min-h-screen bg-[#16171A] text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#16171A]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="스트롱복싱" className="h-9 w-9 object-contain" />
            <span className="text-lg font-black tracking-tight">
              STRONG<span className="text-[#FC5230]">BOXING</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-bold text-zinc-300 md:flex">
            <a href="#branch" className="transition hover:text-[#FC5230]">지점</a>
            <a href="#program" className="transition hover:text-[#FC5230]">프로그램</a>
            <a href="#news" className="transition hover:text-[#FC5230]">후기/소식</a>
          </nav>

          <a href="#branch" className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black">
            만원 체험 예약
          </a>
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden px-6 pt-24">
        <img
          src="/images/mokdong/mokdong-main.jpg"
          alt="스트롱복싱 내부"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#16171A]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(252,82,48,.28),transparent_34%)]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-5 text-sm font-black tracking-[0.4em] text-[#FC5230]">
              URBAN BOXING CLUB
            </p>

            <h1 className="text-[70px] font-black uppercase leading-[0.83] tracking-[-0.09em] md:text-[140px]">
              START
              <br />
              STRONG.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-300">
              복싱이 처음이어도 괜찮습니다. 스트롱복싱은 초보자, 다이어트,
              체력향상 목적에 맞춰 직접 지도합니다.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#branch" className="rounded-full bg-[#FC5230] px-8 py-4 text-center font-black">
                가까운 지점 찾기
              </a>
              <a href="#calculator" className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-center font-black backdrop-blur">
                칼로리 계산하기
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border border-white/10 bg-[#202126]/80 p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-black tracking-[0.28em] text-zinc-400">BRANCHES</p>
                <p className="text-sm font-black text-[#FC5230]">5 LOCATIONS</p>
              </div>

              <div className="grid gap-3">
                {branches.slice(0, 3).map((branch) => (
                  <a
                    key={branch.slug}
                    href={`/branches/${branch.slug}`}
                    className="group grid grid-cols-[96px_1fr] overflow-hidden border border-white/10 bg-[#16171A]"
                  >
                    <img src={branch.image} alt={branch.name} className="h-24 w-24 object-cover transition duration-500 group-hover:scale-105" />
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black">{branch.name}</h3>
                        <span className="text-sm font-black text-[#FC5230]">★ {branch.score}</span>
                      </div>
                      <p className="mt-1 text-xs font-black tracking-[0.2em] text-zinc-500">{branch.vibe}</p>
                      <p className="mt-2 line-clamp-1 text-sm text-zinc-300">{branch.review}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["1DAY", "10,000원"],
                ["BEGINNER", "초보 가능"],
                ["BOXING", "직접 지도"],
              ].map(([a, b]) => (
                <div key={a} className="border border-white/10 bg-[#202126]/80 p-5 backdrop-blur-xl">
                  <p className="text-2xl font-black text-[#FC5230]">{a}</p>
                  <p className="mt-2 text-sm text-zinc-300">{b}</p>
                </div>
              ))}
            </div>
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
              ["01", "BEGINNER", "기본자세, 스텝, 펀치부터 차근차근"],
              ["02", "DIET BOXING", "재밌게 땀나는 다이어트 복싱"],
              ["03", "PERSONAL COACHING", "목적에 맞춘 코치 직접 지도"],
            ].map(([num, title, desc]) => (
              <div key={num} className="border border-white/10 bg-[#202126] p-8 transition hover:border-[#FC5230]">
                <p className="mb-10 text-sm font-black text-[#FC5230]">{num}</p>
                <h3 className="mb-4 text-3xl font-black tracking-[-0.05em]">{title}</h3>
                <p className="leading-7 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="bg-[#111214]">
        <BoxingCalculator />
      </section>

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
              <img src="/images/gallery/gallery-1.jpg" alt="시설" className="h-full min-h-[520px] w-full object-cover transition duration-700 hover:scale-105" />
            </div>

            <div className="grid gap-4">
              <div className="overflow-hidden border border-white/10">
                <img src="/images/gallery/gallery-2.jpg" alt="시설" className="h-[250px] w-full object-cover transition duration-700 hover:scale-105" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <img src="/images/gallery/gallery-3.jpg" alt="시설" className="h-[250px] w-full border border-white/10 object-cover" />
                <img src="/images/gallery/gallery-4.jpg" alt="시설" className="h-[250px] w-full border border-white/10 object-cover" />
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
            ["1DAY", "만원 체험권"],
            ["BEGINNER", "초보자 가능"],
          ].map(([num, text]) => (
            <div key={num} className="border border-white/10 bg-[#202126] p-8">
              <p className="text-5xl font-black tracking-[-0.06em] text-[#FC5230]">{num}</p>
              <p className="mt-4 font-bold text-zinc-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-32">
        <img src="/images/gallery/gallery-1.jpg" alt="체험" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#16171A]/75" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            1 DAY EXPERIENCE
          </p>
          <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.07em] md:text-8xl">
            YOUR FIRST
            <br />
            ROUND STARTS HERE.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            홈페이지 예약 전용 1일 체험권 10,000원.
            가까운 지점에서 스트롱복싱을 직접 경험해보세요.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#branch" className="bg-[#FC5230] px-9 py-5 text-lg font-black">
              만원 체험 예약하기
            </a>
            <a href="/blog" className="border border-white/20 bg-white/10 px-9 py-5 text-lg font-black backdrop-blur">
              운동 후기 보기
            </a>
          </div>
        </div>
      </section>

      <section id="branch" className="bg-[#18191C] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-sm font-black tracking-[0.35em] text-[#FC5230]">
                LOCATIONS
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                가까운 지점에서
                <br />
                시작하세요.
              </h2>
            </div>
            <p className="max-w-md leading-8 text-zinc-400">
              지점별 운영시간, 위치, 예약 링크를 확인하고 편하게 상담 받아보세요.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {branches.map((branch) => (
              <div key={branch.slug} className="group overflow-hidden border border-white/10 bg-[#202126] transition hover:border-[#FC5230]">
                <div className="relative h-[340px] overflow-hidden">
                  <img src={branch.image} alt={branch.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16171A] via-[#16171A]/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-8">
                    <p className="mb-2 text-xs font-black tracking-[0.28em] text-[#FC5230]">
                      {branch.vibe}
                    </p>
                    <h3 className="text-5xl font-black tracking-[-0.07em]">{branch.name}</h3>
                    <p className="mt-3 text-zinc-300">★ {branch.score} · {branch.review}</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-2 leading-7 text-zinc-300">
                    <p>📞 {branch.phone}</p>
                    <p>📍 {branch.address}</p>
                    <p>🕒 {branch.hours.join(" / ")}</p>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <a href={`/branches/${branch.slug}`} className="bg-[#FC5230] px-5 py-3 font-black">
                      자세히 보기
                    </a>
                    {branch.booking && (
                      <a href={branch.booking} target="_blank" className="bg-white px-5 py-3 font-black text-black">
                        예약
                      </a>
                    )}
                    <a href={branch.instagram} target="_blank" className="border border-white/15 px-5 py-3 font-black">
                      인스타
                    </a>
                    {branch.naverMap && (
                      <a href={branch.naverMap} target="_blank" className="border border-white/15 px-5 py-3 font-black">
                        지도
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
            <a href="/blog" className="text-[#FC5230] font-black">
              전체 글 보기 →
            </a>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {latestPosts.map((post: any) => (
                <a key={post.id} href={`/blog/${post.slug}`} className="border border-white/10 bg-[#202126] p-8 transition hover:border-[#FC5230]">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="bg-[#FC5230] px-4 py-2 text-sm font-black">{post.branch_name}</span>
                    <span className="text-sm text-zinc-500">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mb-4 text-3xl font-black leading-tight tracking-[-0.05em]">{post.title}</h3>
                  <p className="line-clamp-3 leading-7 text-zinc-400">{post.description}</p>
                </a>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 bg-[#202126] p-10 text-center">
              <h3 className="mb-3 text-2xl font-black">소식 준비중</h3>
              <p className="text-zinc-400">곧 지점별 운동 소식과 후기를 업데이트할 예정입니다.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#111214] px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="스트롱복싱" className="h-9 w-9 object-contain" />
              <span className="text-xl font-black">
                STRONG<span className="text-[#FC5230]">BOXING</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm leading-7 text-zinc-400">
              스트롱복싱은 복싱 입문, 다이어트 복싱, 체력증진 프로그램을 운영합니다.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black">지점 안내</h3>
            <div className="space-y-3 text-zinc-400">
              {branches.map((branch) => (
                <a key={branch.slug} href={`/branches/${branch.slug}`} className="block hover:text-white">
                  {branch.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black">공식 링크</h3>
            <div className="space-y-3 text-zinc-400">
              <a href="/blog" className="block hover:text-white">블로그</a>
              <a href="#branch" className="block hover:text-white">지점 문의</a>
              <a href="tel:0226435971" className="block hover:text-white">전화 문의</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
          © 2026 STRONGBOXING. All rights reserved.
        </div>
      </footer>
    </main>
  );
}