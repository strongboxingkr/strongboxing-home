import BoxingCalculator from "./components/BoxingCalculator";
import { db } from "@/lib/db";

const branches = [
  {
    slug: "gaebong",
    name: "개봉점",
    phone: "02-2060-1279",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
    kakaoMap: "https://kko.to/RmPQ1W8t8g",
  },
  {
    slug: "sinjoeng",
    name: "신정점",
    phone: "02-2647-3373",
    address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    hours: ["월-금 10:00~24:00", "14:00~15:00 휴게", "토 10:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
    kakaoMap: "https://kko.to/NlN6yV0aK3",
  },
  {
    slug: "mokdong",
    name: "목동점",
    phone: "02-2643-5971",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
    kakaoMap: "https://naver.me/GII8f9Qv",
  },
  {
    slug: "choelsan",
    name: "철산점",
    phone: "02-2066-0406",
    address: "경기도 광명시 철산동 56-14 3층",
    hours: ["월-금 13:00~23:00", "토 11:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "",
    naverMap: "",
    kakaoMap: "",
  },
  {
    slug: "yeongdeungpo",
    name: "영등포점",
    phone: "02-831-9312",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
    kakaoMap: "https://naver.me/G4yQwkR0",
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
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="text-lg font-black tracking-tight">
            STRONG<span className="text-[#FC5230]">BOXING</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-bold text-zinc-300 md:flex">
            <a href="#program" className="hover:text-white">
              프로그램
            </a>
            <a href="#branch" className="hover:text-white">
              지점안내
            </a>
            <a href="#news" className="hover:text-white">
              소식/후기
            </a>
          </nav>

          <a
            href="#branch"
            className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black"
          >
            가까운 지점 찾기
          </a>
        </div>
      </header>

      <section className="flex min-h-[92vh] items-center bg-[radial-gradient(circle_at_85%_30%,rgba(252,82,48,.38),transparent_35%),linear-gradient(135deg,#070707_0%,#111_58%,#2a1009_100%)] px-6 pt-24">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#FC5230]">
            STRONG BOXING GYM
          </p>

          <h1 className="mb-7 text-[48px] font-black leading-[0.98] tracking-[-0.07em] md:text-[92px]">
            당신의 첫 복싱,
            <br />
            여기서 시작하세요
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
            처음이어도 괜찮습니다. 체력 향상, 다이어트, 복싱 입문까지
            목적에 맞춰 코치가 직접 지도합니다.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#branch"
              className="rounded-full bg-[#FC5230] px-8 py-4 text-center font-black text-white"
            >
              가까운 지점 찾기
            </a>
            <a
              href="#program"
              className="rounded-full bg-white px-8 py-4 text-center font-black text-black"
            >
              처음이라면?
            </a>
          </div>
        </div>
      </section>

      <section id="program" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
            복싱을 처음 시작하는 분들도
            <br />
            부담 없이 배울 수 있습니다
          </h2>

          <p className="mb-10 text-lg leading-8 text-zinc-400">
            스트롱복싱은 운동 경험이 없는 분들도 쉽게 적응할 수 있도록
            단계별 수업과 개인별 맞춤 지도를 제공합니다.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "기초부터 탄탄하게",
                "스텝, 자세, 펀치 기본기부터 차근차근 알려드립니다.",
              ],
              [
                "02",
                "다이어트 & 체력 향상",
                "지루한 운동이 아닌 땀나고 재밌는 복싱 트레이닝을 경험하세요.",
              ],
              [
                "03",
                "초보자 맞춤 지도",
                "운동을 처음 시작하는 회원님도 부담 없이 따라올 수 있습니다.",
              ],
            ].map(([num, title, desc]) => (
              <div
                key={num}
                className="rounded-[28px] border border-white/10 bg-[#171719] p-8 shadow-2xl"
              >
                <div className="mb-4 text-4xl font-black text-[#FC5230]">
                  {num}
                </div>
                <h3 className="mb-3 text-2xl font-black">{title}</h3>
                <p className="leading-7 text-zinc-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BoxingCalculator />

      <section id="branch" className="bg-[#111113] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
            가까운 지점에서
            <br />
            스트롱복싱을 만나보세요
          </h2>

          <p className="mb-10 text-lg leading-8 text-zinc-400">
            지점별 운영시간, 위치, 예약 링크를 확인하세요.
          </p>

          <div className="grid gap-5 lg:grid-cols-2">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="rounded-[30px] border border-[#FC5230]/30 bg-gradient-to-br from-[#181818] to-[#101010] p-7 md:p-9"
              >
                <h3 className="mb-4 text-3xl font-black">{branch.name}</h3>

                <div className="space-y-2 leading-7 text-zinc-300">
                  <p>📞 {branch.phone}</p>
                  <p>📍 {branch.address}</p>
                  <div>
                    🕒 운영시간
                    {branch.hours.map((h) => (
                      <p key={h} className="ml-7">
                        {h}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">

                  <a
                    href={`/branches/${branch.slug}`}
                    className="rounded-full bg-[#FC5230] px-5 py-3 font-black"
                  >
                    자세히 보기
                  </a>

                  <a
                    href={`tel:${branch.phone.replaceAll("-", "")}`}
                    className="rounded-full bg-[#FC5230] px-5 py-3 font-black"
                  >
                    전화
                  </a>

                  <a
                    href={branch.instagram}
                    target="_blank"
                    className="rounded-full bg-white px-5 py-3 font-black text-black"
                  >
                    인스타
                  </a>

                  {branch.booking && (
                    <a
                      href={branch.booking}
                      target="_blank"
                      className="rounded-full bg-white px-5 py-3 font-black text-black"
                    >
                      예약
                    </a>
                  )}

                  {branch.naverMap && (
                    <a
                      href={branch.naverMap}
                      target="_blank"
                      className="rounded-full bg-white px-5 py-3 font-black text-black"
                    >
                      네이버지도
                    </a>
                  )}

                  {branch.kakaoMap && (
                    <a
                      href={branch.kakaoMap}
                      target="_blank"
                      className="rounded-full bg-white px-5 py-3 font-black text-black"
                    >
                      카카오맵
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
            지점별 소식과 후기
          </h2>

          <p className="mb-10 text-lg leading-8 text-zinc-400">
            스트롱복싱의 지점별 소식, 운동 후기, 이벤트 안내를 확인해보세요.
          </p>

          {latestPosts.length > 0 ? (
            <div className="mb-12 grid gap-5 md:grid-cols-3">
              {latestPosts.map((post: any) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="rounded-[30px] border border-white/10 bg-[#171719] p-7 transition hover:border-[#FC5230]"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black">
                    {post.branch_name}
                  </div>

                  <h3 className="mb-4 text-2xl font-black leading-tight tracking-[-0.04em]">
                    {post.title}
                  </h3>

                  <p className="line-clamp-3 leading-7 text-zinc-400">
                    {post.description}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="mb-12 rounded-[30px] border border-white/10 bg-[#171719] p-8 text-center">
              <h3 className="mb-3 text-2xl font-black">소식 준비중</h3>
              <p className="text-zinc-400">
                곧 지점별 운동 소식과 후기를 업데이트할 예정입니다.
              </p>
            </div>
          )}

          <div className="rounded-[34px] bg-[#FC5230] p-9 text-center md:p-14">
            <h3 className="mb-4 text-4xl font-black tracking-[-0.05em] md:text-6xl">
              복싱이 처음이신가요?
            </h3>
            <p className="mb-8 text-lg leading-8">
              가까운 지점으로 문의하시면 운동 목적과 경험에 맞춰 안내해드립니다.
            </p>
            <a
              href="#branch"
              className="inline-flex rounded-full bg-black px-8 py-4 font-black text-white"
            >
              지점별 문의하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}