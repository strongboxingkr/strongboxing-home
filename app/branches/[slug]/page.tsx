import { db } from "@/lib/db";
import type { Metadata } from "next";

const branches: any = {
  gaebong: {
    name: "개봉점",
    fullName: "스트롱복싱 개봉점",
    area: "개봉",
    image: "/images/branches/gaebong.jpg",
    phone: "02-2060-1279",
    email: "gaebong@strongboxing.kr",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
    kakaoMap: "https://kko.to/RmPQ1W8t8g",
    kakaoChat: "https://pf.kakao.com/_uyxbnX/chat",
    description:
      "개봉 복싱장 스트롱복싱 개봉점. 복싱 입문, 다이어트 복싱, 초보자 환영. 개봉역 근처. 월-금 13:00~23:00 운영.",
  },

  sinjeong: {
    name: "신정점",
    fullName: "스트롱복싱 신정점",
    area: "신정",
    image: "/images/branches/sinjeong.jpg",
    phone: "02-2647-3373",
    email: "sinjeong@strongboxing.kr",
    address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    hours: ["월-금 10:00~24:00", "14:00~15:00 휴게", "토 10:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
    kakaoMap: "https://kko.to/NlN6yV0aK3",
    description:
      "신정 복싱장 스트롱복싱 신정점. 복싱 입문, 다이어트 복싱, 여성 복싱. 신정네거리역 근처. 월-금 10:00~24:00, 토 10:00~16:00 운영.",
  },

  mokdong: {
    name: "목동점",
    fullName: "스트롱복싱 목동점",
    area: "목동",
    image: "/images/branches/mokdong.png",
    phone: "02-2643-5971",
    email: "mokdong@strongboxing.kr",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
    kakaoMap: "https://naver.me/GII8f9Qv",
    googleMap: "https://maps.google.com/?q=스트롱복싱+목동점",
    kakaoChat: "https://pf.kakao.com/_xfGZnX/chat",
    description:
      "목동 복싱장 스트롱복싱 목동점. 복싱 입문, 다이어트 복싱, 여성 복싱, 직장인 운동. 오목교역 5분 거리. 월-금 14:00~24:00, 토 11:00~16:00 운영.",
  },

  cheolsan: {
    name: "철산점",
    fullName: "스트롱복싱 철산점",
    area: "철산",
    image: "/images/branches/cheolsan.jpg",
    phone: "02-2066-0406",
    email: "cheolsan@strongboxing.kr",
    address: "경기도 광명시 철산동 56-14 3층",
    hours: ["월-금 14:00~23:00", "토·일 14:00~18:00", "공휴일 휴무",],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "https://booking.naver.com/booking/12/bizes/1673598",
    naverMap: "https://naver.me/F8lwn3Te",
    kakaoMap: "https://place.map.kakao.com/1182676078",
    kakaoChat: "https://pf.kakao.com/_MAKnX/chat",
    description:
      "철산 복싱장 스트롱복싱 철산점. 복싱 입문, 다이어트 복싱, 여성 복싱. 철산역 근처 광명 복싱장. 월-금 14:00~23:00, 토·일 14:00~18:00 운영."
    },

  yeongdeungpo: {
    name: "영등포점",
    fullName: "스트롱복싱 영등포점",
    area: "영등포",
    image: "/images/branches/yeongdeungpo.jpg",
    phone: "02-831-9312",
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
    kakaoMap: "https://naver.me/G4yQwkR0",
    description:
      "영등포 복싱장 스트롱복싱 영등포점. 복싱 입문, 다이어트 복싱, 직장인 운동. 도림동 위치. 월-금 13:00~23:00 운영.",
  },
};

const branchFaqs: Record<string, { question: string; answer: string }[]> = {
  gaebong: [
    { question: "개봉 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "개봉동 복싱장 찾는데 초보자도 괜찮나요?", answer: "운동 경험이 없어도 회원별 진도에 맞춰 진행되기 때문에 부담 없이 시작할 수 있습니다." },
    { question: "여성 회원도 많이 다니나요?", answer: "여성 회원분들도 다이어트와 체력 향상 목적으로 편하게 운동하고 계십니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "운영시간 내 방문하면 회원별 목적과 진도에 맞춰 운동이 진행됩니다." },
    { question: "다이어트 복싱도 가능한가요?", answer: "복싱은 전신 운동이라 체중 관리와 체력 향상에 도움이 됩니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 체력 향상과 운동 습관을 만들기 좋습니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "개봉점은 월~금 13:00~23:00 운영합니다." },
    { question: "직장인 회원도 많이 다니나요?", answer: "퇴근 후 운동하시는 직장인 회원분들도 많이 이용하고 있습니다." },
    { question: "상담 예약은 어떻게 하나요?", answer: "홈페이지 방문 상담 예약, 전화, 카카오톡 문의로 신청하실 수 있습니다." },
  ],

  sinjeong: [
    { question: "신정 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세, 스텝, 펀치부터 차근차근 안내해드립니다." },
    { question: "신정동 복싱장 찾는데 초보자도 괜찮나요?", answer: "회원별 수준과 목적에 맞춰 진행되기 때문에 초보자도 부담 없이 시작할 수 있습니다." },
    { question: "여성 회원도 운동 가능한가요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 많이 운동하고 계십니다." },
    { question: "직장인도 다니기 괜찮나요?", answer: "평일 저녁 시간대에 퇴근 후 운동하시는 직장인 회원도 많습니다." },
    { question: "다이어트 복싱도 가능한가요?", answer: "복싱은 유산소와 근력 운동이 함께 들어가 다이어트와 체력 향상에 도움이 됩니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "운영시간 내 방문하면 회원별 진도와 운동 목적에 맞춰 진행됩니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 기초 체력과 운동 습관을 만들기 좋습니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "신정점은 월~금 10:00~24:00, 토요일 10:00~16:00 운영합니다. 14:00~15:00는 휴게시간입니다." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약 또는 전화 문의로 상담 신청이 가능합니다." },
  ],

  mokdong: [
    { question: "목동 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "목동 복싱장 찾는데 초보자도 괜찮나요?", answer: "운동 경험이 없어도 회원별 진도에 맞춰 진행되기 때문에 부담 없이 시작할 수 있습니다." },
    { question: "여성 회원도 많이 다니나요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 많이 운동하고 계십니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 체력 향상과 기초 운동 습관을 만들기 좋습니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "운영시간 내 방문하면 회원별 운동 목적과 진도에 맞춰 운동이 진행됩니다." },
    { question: "다이어트 효과가 있나요?", answer: "복싱은 전신 운동이라 꾸준히 하면 체중 관리와 체력 향상에 도움이 됩니다." },
    { question: "준비물은 무엇이 필요한가요?", answer: "편한 운동복과 실내용 운동화만 준비해주시면 됩니다. 장비는 체육관에서 안내드립니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "목동점은 월~금 14:00~24:00, 토요일 11:00~16:00 운영합니다." },
    { question: "직장인도 운동하기 괜찮나요?", answer: "평일 늦은 시간까지 운영해 퇴근 후 운동하시는 직장인 회원도 많습니다." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약, 전화, 카카오톡 문의로 상담 신청이 가능합니다." },
  ],

  cheolsan: [
    { question: "철산 복싱 처음인데 가능할까요?", answer: "처음 시작하는 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "철산동 복싱장 찾는데 초보자도 괜찮나요?", answer: "회원별 운동 목적과 진도에 맞춰 진행되기 때문에 초보자도 부담 없이 시작할 수 있습니다." },
    { question: "광명 지역 주민들도 많이 다니나요?", answer: "철산동, 하안동, 소하동, 광명사거리 인근에서 방문하시는 분들이 많습니다." },
    { question: "여성 회원도 운동 가능한가요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 편하게 운동하실 수 있습니다." },
    { question: "주말에도 운영하나요?", answer: "철산점은 토요일과 일요일도 운영합니다. 방문 전 운영시간을 확인해주세요." },
    { question: "개인별 운동으로 진행되나요?", answer: "회원별 운동 목적과 진도에 맞춰 개인별로 운동이 진행됩니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 체력 향상과 운동 습관 형성에 좋습니다." },
    { question: "다이어트 목적으로 등록해도 되나요?", answer: "복싱은 전신 운동이라 다이어트와 체력 향상 목적으로 시작하는 분들이 많습니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약, 전화, 카카오톡 문의로 상담 신청이 가능합니다." },
  ],
};

const branchKeywords: Record<string, string[]> = {
  gaebong: [
    "개봉 복싱", "개봉동 복싱", "개봉역 복싱", "개봉 복싱장",
    "고척 복싱", "고척동 복싱", "구로구 복싱", "구로 복싱",
    "오류동 복싱", "천왕동 복싱", "구로 다이어트 복싱",
  ],
  sinjeong: [
    "신정 복싱", "신정동 복싱", "신정네거리 복싱", "신정 복싱장",
    "양천구 복싱", "신월동 복싱", "까치산 복싱", "화곡동 복싱",
    "양천구 다이어트 복싱",
  ],
  mokdong: [
    "목동 복싱", "목동 복싱장", "목동역 복싱", "오목교 복싱",
    "오목교역 복싱", "양천구 복싱", "신정동 복싱",
    "목동 다이어트", "목동 여성 복싱",
  ],
  cheolsan: [
    "철산 복싱", "철산동 복싱", "철산역 복싱", "철산 복싱장",
    "광명 복싱", "광명 복싱장", "광명사거리 복싱",
    "하안동 복싱", "소하동 복싱", "광명 다이어트 복싱",
  ],
  yeongdeungpo: [
    "영등포 복싱", "영등포 복싱장", "도림동 복싱", "신길동 복싱",
    "대림동 복싱", "영등포 다이어트 복싱",
  ],
};

const branchSeoContent: Record<string, any> = {
  cheolsan: {
    title: "철산복싱 · 광명복싱을 찾는 분들을 위한 스트롱복싱 철산점",
    description:
      "스트롱복싱 철산점은 철산동, 철산역, 광명사거리, 하안동, 소하동 인근에서 복싱을 시작하려는 분들이 편하게 방문할 수 있는 복싱 체육관입니다.",
    nearby: ["철산동", "철산역", "광명사거리", "하안동", "소하동", "광명"],
  },
  mokdong: {
    title: "목동복싱 · 오목교복싱을 찾는 분들을 위한 스트롱복싱 목동점",
    description:
      "스트롱복싱 목동점은 목동, 오목교역, 목동역, 양천구, 신정동 인근에서 복싱 입문과 다이어트 복싱을 시작하기 좋은 복싱 체육관입니다.",
    nearby: ["목동", "오목교", "오목교역", "목동역", "양천구", "신정동"],
  },
  gaebong: {
    title: "개봉복싱 · 고척복싱 · 구로구복싱을 찾는 분들을 위한 스트롱복싱 개봉점",
    description:
      "스트롱복싱 개봉점은 개봉동, 개봉역, 고척동, 오류동, 천왕동, 구로구 인근에서 복싱을 시작하려는 분들이 편하게 운동할 수 있는 복싱 체육관입니다.",
    nearby: ["개봉동", "개봉역", "고척동", "오류동", "천왕동", "구로구"],
  },
  sinjeong: {
    title: "신정복싱 · 신정동복싱 · 양천구복싱을 찾는 분들을 위한 스트롱복싱 신정점",
    description:
      "스트롱복싱 신정점은 신정동, 신정네거리, 신월동, 까치산, 화곡동, 양천구 인근에서 복싱을 시작하기 좋은 복싱 체육관입니다.",
    nearby: ["신정동", "신정네거리", "신월동", "까치산", "화곡동", "양천구"],
  },
  yeongdeungpo: {
    title: "영등포복싱 · 신길동복싱을 찾는 분들을 위한 스트롱복싱 영등포점",
    description:
      "스트롱복싱 영등포점은 영등포, 신길동, 도림동, 대림동 인근에서 복싱 입문과 다이어트 복싱을 시작하기 좋은 복싱 체육관입니다.",
    nearby: ["영등포", "신길동", "도림동", "대림동"],
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

  const title = `${branch.area} 복싱장 | ${branch.fullName}`;
  const url = `https://strongboxing.kr/branches/${slug}`;

  return {
    metadataBase: new URL("https://strongboxing.kr"),
    title,
    description: branch.description,
    keywords: [
      ...(branchKeywords[slug] || []),
      `${branch.fullName}`,
      "스트롱복싱",
      "복싱 입문",
      "다이어트 복싱",
      "여성 복싱",
      "직장인 운동",
      "초보자 복싱",
      "체력 증진",
      "키즈 복싱",
      "복싱 PT",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
        title,
        description: branch.description,
        url,
        siteName: "스트롱복싱",
        locale: "ko_KR",
        type: "website",
        images: [
          {
            url: `https://strongboxing.kr${branch.image}`,
            width: 1200,
            height: 630,
            alt: branch.fullName,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description: branch.description,
        images: [`https://strongboxing.kr${branch.image}`],
      },

      robots: {
      index: true,
      follow: true,
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
    SELECT id, title, slug, description, content, branch_name, created_at
    FROM homepage_posts
    WHERE branch_name = ?
    ORDER BY created_at DESC
    LIMIT 3
    `,
    [branch.name]
  );

  const relatedPosts = rows;

  function getFirstImage(content: string) {
    const match = String(content || "").match(/!\[.*?\]\((.*?)\)/);
    return match?.[1] || null;
  }

  const [reelRows]: any = await db.query(
    `
    SELECT id, branch_name, title, video_url, is_muted
    FROM homepage_reels
    WHERE is_active = 1 AND branch_name = ?
    ORDER BY sort_order ASC, id DESC
    LIMIT 8
    `,
    [branch.name]
  );

  const branchReels = reelRows;
  const seoContent = branchSeoContent[slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ExerciseGym", "SportsActivityLocation", "LocalBusiness"],
    "@id": `https://strongboxing.kr/branches/${slug}#localbusiness`,
    name: branch.fullName,
    alternateName: [
      `${branch.area} 복싱장`,
      `${branch.area} 복싱`,
      `스트롱복싱 ${branch.name}`,
    ],
    description: branch.description,
    url: `https://strongboxing.kr/branches/${slug}`,
    telephone: branch.phone,
    image: `https://strongboxing.kr${branch.image}`,
    logo: "https://strongboxing.kr/icon.png",
    priceRange: "₩₩",
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressCountry: "KR",
    },
    openingHoursSpecification: branch.hours.map((h: string) => ({
      "@type": "OpeningHoursSpecification",
      description: h,
    })),
    sameAs: [
      branch.instagram,
      branch.naverMap,
      branch.kakaoMap,
      branch.googleMap,
      branch.booking,
    ].filter(Boolean),
    brand: {
      "@type": "Brand",
      name: "STRONG BOXING",
      alternateName: "스트롱복싱",
      url: "https://strongboxing.kr",
      logo: "https://strongboxing.kr/icon.png",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "STRONG BOXING",
      url: "https://strongboxing.kr",
    },
    areaServed: [
      branch.area,
      slug === "cheolsan" ? "광명" : "",
      slug === "gaebong" ? "구로구" : "",
      slug === "sinjeong" || slug === "mokdong" ? "양천구" : "",
      slug === "yeongdeungpo" ? "영등포구" : "",
    ].filter(Boolean),
    knowsAbout: [
      ...(branchKeywords[slug] || []),
      "복싱 입문",
      "초보자 복싱",
      "다이어트 복싱",
      "여성 복싱",
      "직장인 운동",
      "체력 향상",
      "스트레스 해소",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "복싱 입문 수업",
          description: "처음 시작하는 회원을 위한 기초 자세, 스텝, 펀치 지도",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "다이어트 복싱",
          description: "체력 향상과 체중 관리를 위한 복싱 트레이닝",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "개인별 복싱 지도",
          description: "회원 운동 목적과 실력에 맞춘 코치 직접 지도",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: branch.reviewCount || 1,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "스트롱복싱",
        item: "https://strongboxing.kr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "지점 안내",
        item: "https://strongboxing.kr/branches",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: branch.fullName,
        item: `https://strongboxing.kr/branches/${slug}`,
      },
    ],
  };

  const faqItems = branchFaqs[slug] || [
  {
    question: `${branch.area} 복싱 처음인데 가능할까요?`,
    answer: `${branch.fullName}은 처음 시작하는 분들도 기초부터 개인 수준에 맞춰 안내합니다.`,
  },
  {
    question: `${branch.name}은 여성 회원도 운동 가능한가요?`,
    answer: "여성 회원도 편하게 운동할 수 있으며 다이어트와 체력 향상 목적으로 많이 시작합니다.",
  },
  {
    question: "운영시간 안에 자유롭게 방문 가능한가요?",
    answer: "운영시간 내 방문 가능하며 운동 목적과 진도에 맞춰 지도합니다.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
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
                __html: JSON.stringify(breadcrumbJsonLd),
              }}
            />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqJsonLd),
              }}
            />

      <section className="relative min-h-[90vh] overflow-hidden bg-[#080808]">
        {/* Background image with overlay */}
        <div className="absolute inset-0 hidden md:block">
          <img
            src={branch.image}
            alt={branch.fullName}
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1fr_420px]">
          <div>
            <a href="/" className="mb-10 inline-block text-zinc-500 transition hover:text-white">
              ← 메인으로
            </a>

            <p className="mb-5 text-sm font-black tracking-[0.32em] text-[#FC5230]">
              STRONG BOXING BRANCH
            </p>

            <h1 className="break-keep text-4xl font-black leading-tight tracking-[-0.05em] text-white md:text-6xl">
              {seoContent?.title || `${branch.area} 복싱장 ${branch.fullName}`}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              {seoContent?.description || branch.description}
            </p>

            {seoContent?.nearby && (
              <div className="mt-8 flex flex-wrap gap-2">
                {seoContent.nearby.map((area: string) => (
                  <span
                    key={area}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300"
                  >
                    {area} 인근
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`tel:${branch.phone.replaceAll("-", "")}`}
                className="rounded-full bg-[#FC5230] px-7 py-4 text-sm font-black text-white shadow-lg shadow-[#FC5230]/30 transition hover:bg-[#e04828]"
              >
                📞 전화 문의
              </a>

              {branch.kakaoChat && (
                <a
                  href={branch.kakaoChat}
                  target="_blank"
                  className="rounded-full bg-[#FEE500] px-7 py-4 text-sm font-black text-black transition hover:brightness-95"
                >
                  카카오톡 문의
                </a>
              )}

              {branch.booking && (
                <a
                  href={branch.booking}
                  target="_blank"
                  className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  네이버 예약
                </a>
              )}

              {branch.naverMap && (
                <a
                  href={branch.naverMap}
                  target="_blank"
                  className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  네이버지도
                </a>
              )}

              <a
                href={branch.instagram}
                target="_blank"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                인스타그램
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/10">
              <img
                src={branch.image}
                alt={branch.fullName}
                className="h-[520px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="px-6 pt-20 pb-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-4xl font-black tracking-[-0.05em]">
              {branch.name} 소식 & 후기
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedPosts.map((post: any) => {
                const image = getFirstImage(post.content);
                return (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#171719] transition hover:border-[#FC5230]"
                >
                  {image && (
                    <div className="h-[180px] overflow-hidden">
                      <img
                        src={encodeURI(image)}
                        alt={post.title}
                        className="h-full w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="mb-4 inline-flex rounded-full bg-[#FC5230] px-4 py-2 text-sm font-black">
                      {post.branch_name}
                    </div>
                    <h3 className="mb-3 text-xl font-black leading-tight">{post.title}</h3>
                    <p className="line-clamp-2 text-sm leading-7 text-zinc-400">{post.description}</p>
                  </div>
                </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {branchReels.length > 0 && (
        <section className="bg-[#16171A] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="mb-2 text-sm font-black tracking-[0.32em] text-[#FC5230]">STRONG CLIP</p>
              <h2 className="text-4xl font-black tracking-[-0.05em] text-white">
                {branch.name} 클립
              </h2>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4">
                {branchReels.map((reel: any) => (
                  <div key={reel.id} className="shrink-0 w-[200px] overflow-hidden rounded-2xl border border-[#FC5230]/20 bg-[#202126]">
                    <video
                      src={reel.video_url}
                      controls={Number(reel.is_muted) !== 1}
                      muted
                      autoPlay={Number(reel.is_muted) === 1}
                      loop={Number(reel.is_muted) === 1}
                      playsInline
                      preload="metadata"
                      className="w-full bg-black object-cover aspect-[9/16]"
                    />
                    <div className="px-3 py-2">
                      <p className="text-xs font-bold text-white">{reel.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-[#171719] p-8">
            <h2 className="mb-5 text-3xl font-black">지점 정보</h2>

            <div className="space-y-3 leading-8 text-zinc-300">
              <p>📞 {branch.phone}</p>
              {branch.email && (
                <p>✉️ <a href={`mailto:${branch.email}`} className="hover:text-white">{branch.email}</a></p>
              )}
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

              {branch.kakaoChat && (
                <a
                  href={branch.kakaoChat}
                  target="_blank"
                  className="rounded-full bg-[#FEE500] px-5 py-3 font-black text-black"
                >
                  카카오톡 문의
                </a>
              )}

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

            {branch.kakaoChat && (
              <a
                href={branch.kakaoChat}
                target="_blank"
                className="rounded-full bg-[#FEE500] px-8 py-4 font-black text-black"
              >
                카카오톡 문의
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#111] text-white">
        <div className="mx-auto max-w-6xl">

          <div className="mb-16">
           <h2 className="break-keep text-3xl font-black tracking-[-0.03em] md:text-4xl">
            {seoContent?.title || `${branch.area} 복싱장 ${branch.fullName}`}
          </h2>

          <p className="mt-6 max-w-3xl break-keep text-lg leading-8 text-zinc-300">
            {seoContent?.description || branch.description}
          </p>

          {seoContent?.nearby && (
            <div className="mt-8 flex flex-wrap gap-2">
              {seoContent.nearby.map((area: string) => (
                <span
                  key={area}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-black text-zinc-200"
                >
                  {area} 인근 복싱
                </span>
              ))}
            </div>
          )}
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <img
              src={branch.image}
              alt={`${branch.area} 복싱장 ${branch.fullName} 내부`}
              className="rounded-[32px] border border-white/10 object-cover"
            />

            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-black">
                {branch.area} 복싱 입문 전문 체육관
              </h3>

              <p className="mt-5 leading-8 text-zinc-300">
                복싱 입문부터 다이어트, 체력 향상까지
                운동 목적에 맞춰 지도해드립니다.
              </p>

              <ul className="mt-8 space-y-4 text-zinc-200">
                <li>🥊 초보자 개인지도</li>
                <li>🥊 여성 회원 운동 가능</li>
                <li>🥊 다이어트 복싱</li>
                <li>🥊 직장인 야간 운동</li>
              </ul>

              <a
                href="/reservation"
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
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-white/10 bg-black/40 p-6"
                >
                  <h3 className="text-xl font-black">
                    {item.question}
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-300">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}