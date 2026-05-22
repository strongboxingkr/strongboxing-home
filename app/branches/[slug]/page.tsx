import { db } from "@/lib/db";
import type { Metadata } from "next";

const branches: any = {
  gaebong: {
    name: "개봉점",
    fullName: "스트롱복싱 개봉점",
    area: "개봉",
    phone: "02-2060-1279",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
    kakaoMap: "https://kko.to/RmPQ1W8t8g",
    description:
      "개봉동에서 복싱 입문, 다이어트, 체력 향상을 부담 없이 시작할 수 있는 스트롱복싱 개봉점입니다.",
  },

  sinjeong: {
    name: "신정점",
    fullName: "스트롱복싱 신정점",
    area: "신정",
    phone: "02-2647-3373",
    address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    hours: ["월-금 10:00~24:00", "14:00~15:00 휴게", "토 10:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
    kakaoMap: "https://kko.to/NlN6yV0aK3",
    description:
      "신정동에서 복싱 입문, 다이어트, 체력 향상을 시작하기 좋은 스트롱복싱 신정점입니다.",
  },

  mokdong: {
    name: "목동점",
    fullName: "스트롱복싱 목동점",
    area: "목동",
    phone: "02-2643-5971",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
    kakaoMap: "https://naver.me/GII8f9Qv",
    googleMap: "https://maps.google.com/?q=스트롱복싱+목동점",
    description:
      "목동에서 복싱 입문, 여성복싱, 다이어트, 직장인 운동을 편하게 시작할 수 있는 스트롱복싱 목동점입니다.",
  },

  cheolsan: {
    name: "철산점",
    fullName: "스트롱복싱 철산점",
    area: "철산",
    phone: "02-2066-0406",
    address: "경기도 광명시 철산동 56-14 3층",
    hours: ["월-금 13:00~23:00", "토 11:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "",
    naverMap: "",
    kakaoMap: "",
    description:
      "광명 철산동에서 오픈 예정인 스트롱복싱 철산점입니다. 복싱 입문, 다이어트, 체력 향상을 부담 없이 시작할 수 있습니다.",
  },

  yeongdeungpo: {
    name: "영등포점",
    fullName: "스트롱복싱 영등포점",
    area: "영등포",
    phone: "02-831-9312",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
    kakaoMap: "https://naver.me/G4yQwkR0",
    description:
      "영등포에서 복싱 입문, 다이어트, 직장인 운동을 시작할 수 있는 스트롱복싱 영등포점입니다.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branch = branches[slug];

  if (!branch) {
    return {
      title: "스트롱복싱",
      description: "스트롱복싱 지점 안내",
    };
  }

  return {
    title: `${branch.area} 복싱장 | ${branch.fullName}`,
    description: branch.description,
    openGraph: {
      title: `${branch.area} 복싱장 | ${branch.fullName}`,
      description: branch.description,
      url: `https://strongboxing.kr/branches/${slug}`,
      siteName: "스트롱복싱",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = branches[slug];

  if (!branch) {
    return (
      <main className="min-h-screen bg-[#0d0d0f] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-black">지점을 찾을 수 없습니다.</h1>

          <a href="/" className="mt-6 inline-block text-[#FC5230]">
            메인으로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  const [rows]: any = await db.query(
    `
    SELECT id, title, slug, description, branch_name, created_at
    FROM homepage_posts
    WHERE branch_name = ?
    ORDER BY created_at DESC
    LIMIT 3
    `,
    [branch.name]
  );

  const relatedPosts = rows;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: branch.fullName,
    description: branch.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressCountry: "KR",
    },
    telephone: branch.phone,
    url: `https://strongboxing.kr/branches/${slug}`,
    sameAs: branch.instagram ? [branch.instagram] : [],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "복싱 처음인데 가능할까요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "처음 운동하시는 분들도 많으며 개인 수준에 맞춰 기초부터 안내해드립니다.",
        },
      },
      {
        "@type": "Question",
        name: "여성 회원도 운동 가능한가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "여성 회원 비율도 높으며 다이어트와 체력증진 목적으로 많이 등록하고 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "학생 회원도 운동 가능한가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "학생 회원들도 많이 운동하고 있으며 체력관리와 스트레스 해소 목적으로 등록하고 있습니다.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />

      <section className="bg-[radial-gradient(circle_at_80%_20%,rgba(252,82,48,.35),transparent_35%),linear-gradient(135deg,#070707,#151515)] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <a href="/" className="mb-10 inline-block text-zinc-400">
            ← 메인으로
          </a>

          <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#FC5230]">
            STRONG BOXING BRANCH
          </p>

          <h1 className="mb-6 text-5xl font-black tracking-[-0.06em] md:text-8xl">
            {branch.area} 복싱장
            <br />
            {branch.fullName}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            {branch.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${branch.phone.replaceAll("-", "")}`}
              className="rounded-full bg-[#FC5230] px-7 py-4 font-black"
            >
              전화 문의
            </a>

            {branch.booking && (
              <a
                href={branch.booking}
                target="_blank"
                className="rounded-full bg-white px-7 py-4 font-black text-black"
              >
                네이버 예약
              </a>
            )}

            <a
              href={branch.instagram}
              target="_blank"
              className="rounded-full bg-white px-7 py-4 font-black text-black"
            >
              인스타그램
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-[#171719] p-8">
            <h2 className="mb-5 text-3xl font-black">지점 정보</h2>

            <div className="space-y-3 leading-8 text-zinc-300">
              <p>📞 {branch.phone}</p>
              <p>📍 {branch.address}</p>

              <div>
                🕒 운영시간
                {branch.hours.map((h: string) => (
                  <p key={h} className="ml-7">
                    {h}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#FC5230]/30 bg-gradient-to-br from-[#181818] to-[#101010] p-8">
            <h2 className="mb-5 text-3xl font-black">바로가기</h2>

            <div className="flex flex-wrap gap-3">
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

              {branch.googleMap && (
                <a
                  href={branch.googleMap}
                  target="_blank"
                  className="rounded-full bg-white px-5 py-3 font-black text-black"
                >
                  구글지도
                </a>
              )}

              <a
                href={branch.instagram}
                target="_blank"
                className="rounded-full bg-white px-5 py-3 font-black text-black"
              >
                인스타
              </a>

              <a
                href={`tel:${branch.phone.replaceAll("-", "")}`}
                className="rounded-full bg-[#FC5230] px-5 py-3 font-black"
              >
                전화
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-4xl font-black tracking-[-0.05em]">
            {branch.area} 복싱 프로그램
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "복싱 입문",
                "처음 배우는 분들도 스텝과 기본 자세부터 차근차근 배웁니다.",
              ],
              [
                "다이어트 복싱",
                "지루하지 않게 땀나는 복싱 트레이닝으로 운동량을 높입니다.",
              ],
              [
                "체력 향상",
                "운동 목적과 체력에 맞춰 무리 없이 꾸준히 운동할 수 있습니다.",
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/10 bg-[#171719] p-7"
              >
                <h3 className="mb-3 text-2xl font-black">{title}</h3>
                <p className="leading-7 text-zinc-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-4xl font-black tracking-[-0.05em]">
            {branch.name} 소식 & 후기
          </h2>

          {relatedPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {relatedPosts.map((post: any) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="rounded-[28px] border border-white/10 bg-[#171719] p-7 transition hover:border-[#FC5230]"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black">
                    {post.branch_name}
                  </div>

                  <h3 className="mb-4 text-2xl font-black leading-tight">
                    {post.title}
                  </h3>

                  <p className="line-clamp-3 leading-7 text-zinc-400">
                    {post.description}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-white/10 bg-[#171719] p-8 text-center">
              <h3 className="mb-3 text-2xl font-black">아직 소식 준비중</h3>

              <p className="text-zinc-400">
                곧 {branch.name}의 운동 소식과 후기를 업데이트할 예정입니다.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[34px] bg-[#FC5230] p-10 text-center md:p-14">
          <h2 className="mb-4 text-4xl font-black tracking-[-0.05em] md:text-6xl">
            {branch.name}에서 시작해볼까요?
          </h2>

          <p className="mb-8 text-lg leading-8">
            처음이어도 괜찮습니다. 운동 목적에 맞춰 상담 후 안내해드립니다.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${branch.phone.replaceAll("-", "")}`}
              className="rounded-full bg-black px-8 py-4 font-black text-white"
            >
              전화 문의
            </a>

            {branch.booking && (
              <a
                href={branch.booking}
                target="_blank"
                className="rounded-full bg-white px-8 py-4 font-black text-black"
              >
                네이버 예약
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#111] text-white">
        <div className="mx-auto max-w-6xl">

          <div className="mb-16">
            <h2 className="text-5xl font-black tracking-[-0.05em]">
              {branch.area} 복싱장 {branch.fullName}
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              스트롱복싱 목동점은 복싱을 처음 시작하는 분들도 부담 없이
              운동할 수 있도록 개인 지도 중심으로 운영되는 목동 복싱장입니다.
              다이어트, 체력증진, 스트레스 해소, 복싱 입문까지 목적에 맞게
              운동 방향을 안내해드립니다.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <img
              src="/images/mokdong/mokdong-main.jpg"
              alt="목동 복싱장 스트롱복싱 목동점 내부"
              className="rounded-[32px] border border-white/10 object-cover"
            />

            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-black">
                목동역 근처 프리미엄 복싱장
              </h3>

              <p className="mt-5 leading-8 text-zinc-300">
                샌드백, 유산소 장비, 웨이트 공간까지 갖춰져 있어
                복싱과 체력운동을 함께 진행할 수 있습니다.
              </p>

              <ul className="mt-8 space-y-4 text-zinc-200">
                <li>🥊 초보자 개인지도</li>
                <li>🥊 여성 회원 운동 가능</li>
                <li>🥊 다이어트 복싱</li>
                <li>🥊 직장인 야간 운동</li>
              </ul>

              <a
                href="/#branch"
                className="mt-10 inline-flex w-fit rounded-full bg-[#FC5230] px-8 py-4 font-black text-white"
              >
                상담 문의하기
              </a>
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-4xl font-black">
              자주 묻는 질문
            </h2>

            <div className="mt-10 space-y-6">
              <div className="rounded-[24px] border border-white/10 bg-black/40 p-6">
                <h3 className="text-xl font-black">
                  복싱 처음인데 가능할까요?
                </h3>

                <p className="mt-3 leading-7 text-zinc-300">
                  처음 운동하시는 분들도 많으며,
                  개인 수준에 맞춰 기초부터 안내해드립니다.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/40 p-6">
                <h3 className="text-xl font-black">
                  여성 회원도 운동 가능한가요?
                </h3>

                <p className="mt-3 leading-7 text-zinc-300">
                  여성 회원 비율도 높으며,
                  다이어트와 체력증진 목적으로 많이 등록하고 있습니다.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/40 p-6">
                <h3 className="text-xl font-black">
                  운영시간 안에는 자유롭게 방문 가능한가요?
                </h3>

                <p className="mt-3 leading-7 text-zinc-300">
                  운영시간 내 자유롭게 방문 가능하며,
                  운동 목적에 맞춰 지도해드립니다.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}