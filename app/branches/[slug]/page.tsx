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
      "광명헬스·철산헬스·광명운동·철산운동을 찾는다면 스트롱복싱 철산점. 광명시 철산동 위치. 복싱 입문·다이어트·여성 운동 전문. 철산역 도보 5분. 월-금 14:00~23:00, 토·일 14:00~18:00.",
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
    { question: "광명 헬스장 찾는데 스트롱복싱이 뭔가요?", answer: "스트롱복싱 철산점은 광명시 철산동에 위치한 복싱 체육관입니다. 일반 헬스장과 달리 복싱 트레이닝으로 운동하며, 다이어트·체력 향상·스트레스 해소에 효과적입니다. 광명에서 새로운 운동을 찾는 분들께 추천합니다." },
    { question: "광명 운동 처음 시작하려는데 복싱이 괜찮을까요?", answer: "복싱은 초보자도 기초 자세와 스텝부터 차근차근 배울 수 있는 운동입니다. 광명에서 운동 시작을 고민하신다면 부담 없이 방문 상담해주세요." },
    { question: "철산역 근처 헬스장 찾는데 여기 위치가 어떻게 되나요?", answer: "철산역 도보 5분 거리인 경기도 광명시 철산동 56-14 3층에 위치합니다. 철산동, 하안동, 소하동, 광명사거리에서 쉽게 오실 수 있습니다." },
    { question: "광명 다이어트 운동으로 복싱이 효과 있나요?", answer: "복싱은 유산소와 근력이 결합된 전신 운동이라 다이어트 효과가 높습니다. 광명에서 다이어트 운동을 찾고 계신 분들이 많이 등록하고 계십니다." },
    { question: "철산 헬스 대신 복싱으로 운동하면 어떤가요?", answer: "러닝머신·기구 운동이 지루하신 분들께 복싱이 좋은 대안입니다. 매번 다른 동작과 미트 트레이닝으로 지루하지 않게 운동할 수 있습니다." },
    { question: "광명 여성 운동으로 가능한가요?", answer: "여성 회원도 편하게 운동하실 수 있습니다. 다이어트, 체력 향상, 스트레스 해소 목적으로 광명·철산 지역 여성 회원분들이 많이 등록하고 계십니다." },
    { question: "주말에도 운영하나요?", answer: "네, 토·일요일 14:00~18:00 운영합니다. 평일 월~금은 14:00~23:00입니다. 공휴일은 휴무입니다." },
    { question: "광명시 어느 동네에서도 오기 편한가요?", answer: "철산동, 하안동, 소하동, 광명동, 일직동, 광명사거리 인근에서 모두 가까운 거리입니다. 광명시 내 어디서든 접근이 편리합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다. 복싱 장갑 등 장비는 체육관에서 안내해드립니다." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약, 전화(02-2066-0406), 카카오톡 문의로 신청하실 수 있습니다." },
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
    "광명운동", "광명 운동", "광명헬스", "광명 헬스", "광명헬스장", "광명 헬스장",
    "철산운동", "철산 운동", "철산헬스", "철산 헬스", "철산헬스장", "철산 헬스장",
    "광명다이어트", "광명 다이어트", "철산다이어트", "철산 다이어트",
    "광명 체육관", "철산 체육관", "광명 피트니스", "철산 피트니스",
    "광명시 헬스", "광명시 운동", "광명시 복싱", "광명시 다이어트",
    "철산동 헬스", "철산동 운동", "광명동 운동", "하안동 헬스", "소하동 헬스",
  ],
  yeongdeungpo: [
    "영등포 복싱", "영등포 복싱장", "도림동 복싱", "신길동 복싱",
    "대림동 복싱", "영등포 다이어트 복싱",
  ],
};

const branchSeoContent: Record<string, any> = {
  cheolsan: {
    title: "광명헬스 · 철산헬스 · 광명운동 · 철산운동 스트롱복싱 철산점",
    description:
      "광명에서 운동, 헬스, 다이어트 찾고 계신가요? 스트롱복싱 철산점은 광명시 철산동에 위치한 복싱 체육관으로, 철산역 도보 5분 거리입니다. 초보자·여성·직장인 모두 환영하며, 광명헬스 · 철산헬스 · 광명다이어트를 찾는 분들이 많이 방문합니다.",
    nearby: ["광명시", "철산동", "철산역", "광명사거리", "하안동", "소하동", "광명동", "일직동"],
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

  const title = slug === "cheolsan"
    ? `광명헬스 · 철산헬스 · 광명운동 | 스트롱복싱 철산점`
    : `${branch.area} 복싱장 | ${branch.fullName}`;
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
      <main className="min-h-screen bg-[#0E0E10] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-black">지점을 찾을 수 없습니다.</h1>

          <a href="/" className="mt-6 inline-block text-[#D01E2E]">
            메인으로 돌아가기
          </a>
        </div>
      </main>
    );
  }

  const [rows]: any = await db.query(
    `
    SELECT id, title, slug, description, content, branch_name, thumbnail, created_at
    FROM homepage_posts
    WHERE branch_name = ?
    ORDER BY created_at DESC
    LIMIT 3
    `,
    [branch.name]
  );

  const relatedPosts = rows;

  function getFirstImage(post: any): string | null {
    if (post.thumbnail) return post.thumbnail;
    const s = String(post.content || "");
    const htmlImg = s.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (htmlImg?.[1]) return htmlImg[1];
    const mdImg = s.match(/!\[.*?\]\((.*?)\)/);
    if (mdImg?.[1]) return mdImg[1];
    const videoTag = s.match(/<video[^>]+src=["']([^"']+)["']/i);
    if (videoTag?.[1]) return videoTag[1];
    return null;
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
    areaServed: slug === "cheolsan"
      ? ["철산동", "철산역", "광명시", "광명", "하안동", "소하동", "광명동", "일직동", "광명사거리", "경기도 광명"]
      : [
          branch.area,
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
    <main className="min-h-screen bg-[#0E0E10] text-white">
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
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <img src={branch.image} alt="" aria-hidden="true" className="h-full w-full object-cover" style={{ filter: "brightness(0.18) grayscale(0.2)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.65) 55%, rgba(8,8,8,0.15) 100%)" }} />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-14 px-6 py-28 md:min-h-[90vh] md:grid-cols-[1fr_500px] lg:px-10">
          <div>
            <a href="/" className="mb-10 inline-block text-[#4A4C50] transition hover:text-white text-sm">
              ← 메인으로
            </a>

            <p className="mb-6 text-xs font-black tracking-[0.38em] text-[#D01E2E]">
              STRONG BOXING BRANCH
            </p>

            <h1 className="break-keep font-black leading-[0.88] tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}>
              {seoContent?.title || `${branch.area} 복싱장 ${branch.fullName}`}
            </h1>

            <div className="my-7 h-[2px] w-12" style={{ background: "#D01E2E" }} />

            <p className="max-w-lg text-base leading-8 text-[#8A8D91]">
              {branch.description}
            </p>

            {seoContent?.nearby && (
              <div className="mt-7 flex flex-wrap gap-2">
                {seoContent.nearby.map((area: string) => (
                  <span key={area} className="rounded-full border border-[#4A4C50]/40 px-3 py-1 text-xs font-bold text-[#8A8D91]">
                    {area}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`tel:${branch.phone.replaceAll("-", "")}`}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#D01E2E] px-7 py-3.5 text-sm font-black text-white transition hover:bg-[#B71C2B]"
              >
                전화 문의
              </a>

              {branch.booking && (
                <a
                  href={branch.booking}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-white/6 px-7 py-3.5 text-sm font-black text-[#F5F4F1] transition hover:border-white/30 hover:bg-white/10"
                >
                  네이버 예약
                </a>
              )}

              {branch.kakaoChat && (
                <a
                  href={branch.kakaoChat}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-white/6 px-7 py-3.5 text-sm font-black transition hover:border-white/30 hover:bg-white/10"
                  style={{ color: "#F5F4F1" }}
                >
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#FEE500" }} />
                  카카오 문의
                </a>
              )}

              {branch.naverMap && (
                <a
                  href={branch.naverMap}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-white/6 px-7 py-3.5 text-sm font-black text-[#8A8D91] transition hover:border-white/30 hover:text-white"
                >
                  지도 보기
                </a>
              )}
            </div>

            {/* 지점 기본 정보 */}
            <div className="mt-12 flex flex-col gap-2 text-sm" style={{ color: "#5A5C61" }}>
              <span>{branch.phone}</span>
              <span>{branch.hours.join(" · ")}</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="overflow-hidden rounded-[16px]" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
              <img src={branch.image} alt={branch.fullName} className="h-[600px] w-full object-cover" style={{ filter: "brightness(0.92)" }} />
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="px-6 py-24">
          <div className="mx-auto max-w-[1280px] lg:px-4">
            <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>NEWS & REVIEW</p>
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="font-black tracking-[-0.05em]" style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
                {branch.name} 소식 & 후기
              </h2>
              <a href="/blog" className="shrink-0 text-sm font-black text-[#8A8D91] transition hover:text-white">전체 글 →</a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedPosts.map((post: any) => {
                const image = getFirstImage(post);
                return (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[16px] border border-[#4A4C50]/30 bg-[#141416] transition duration-300 hover:-translate-y-1 hover:border-white/25"
                >
                  <div className="h-[210px] overflow-hidden bg-[#1A1A1C]">
                    {image && (
                      <img
                        src={encodeURI(image)}
                        alt={post.title}
                        className="h-full w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="p-7">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="rounded-full bg-[#D01E2E] px-3 py-1 text-xs font-black">{post.branch_name}</span>
                      <span className="text-xs text-[#8A8D91]">
                        {new Date(post.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-black leading-tight tracking-[-0.03em] text-[#F5F4F1]">{post.title}</h3>
                    <p className="line-clamp-2 text-sm leading-7 text-[#8A8D91]">{post.description}</p>
                    <p className="mt-4 text-xs font-black text-[#D01E2E] opacity-0 transition-opacity duration-300 group-hover:opacity-100">자세히 보기 →</p>
                  </div>
                </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {branchReels.length > 0 && (
        <section className="px-6 py-24" style={{ background: "#141416" }}>
          <div className="mx-auto max-w-[1280px] lg:px-4">
            <p className="mb-3 text-xs font-black tracking-[0.32em] text-[#D01E2E]">STRONG CLIP</p>
            <h2 className="mb-10 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
              {branch.name} 클립
            </h2>
            <div className="overflow-x-auto pb-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4C50 transparent" }}>
              <div className="flex gap-4">
                {branchReels.map((reel: any) => (
                  <div key={reel.id} className="group shrink-0 w-[260px] overflow-hidden rounded-[12px] border border-[#4A4C50]/30 bg-[#1A1A1C] transition duration-300 hover:-translate-y-1 hover:border-[#4A4C50]/60">
                    <div className="overflow-hidden">
                      <video
                        src={reel.video_url}
                        controls={Number(reel.is_muted) !== 1}
                        muted
                        autoPlay={Number(reel.is_muted) === 1}
                        loop={Number(reel.is_muted) === 1}
                        playsInline
                        preload="metadata"
                        className="w-full bg-[#0E0E10] object-cover aspect-[9/16] transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    {reel.title && (
                      <div className="px-4 py-3">
                        <p className="text-sm font-bold text-[#F5F4F1] line-clamp-1">{reel.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-24">
        <div className="mx-auto max-w-[1280px] lg:px-4">
          <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>BRANCH INFO</p>
          <div className="grid gap-5 md:grid-cols-2">
            {/* 지점 정보 */}
            <div className="rounded-[16px] border border-[#4A4C50]/30 bg-[#141416] p-9">
              <h2 className="mb-7 text-2xl font-black tracking-[-0.03em] text-[#F5F4F1]">지점 정보</h2>
              <div className="space-y-4 text-sm leading-7">
                <div className="flex gap-4">
                  <span style={{ color: "#4A4C50", flexShrink: 0, width: 48 }}>전화</span>
                  <span style={{ color: "#F5F4F1" }}>{branch.phone}</span>
                </div>
                <div className="flex gap-4">
                  <span style={{ color: "#4A4C50", flexShrink: 0, width: 48 }}>주소</span>
                  <span style={{ color: "#8A8D91" }}>{branch.address}</span>
                </div>
                <div className="flex gap-4">
                  <span style={{ color: "#4A4C50", flexShrink: 0, width: 48 }}>운영</span>
                  <div className="flex flex-col gap-0.5">
                    {branch.hours.map((h: string) => (
                      <span key={h} style={{ color: "#8A8D91" }}>{h}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 바로가기 */}
            <div className="rounded-[16px] border border-[#4A4C50]/30 bg-[#141416] p-9">
              <h2 className="mb-7 text-2xl font-black tracking-[-0.03em] text-[#F5F4F1]">바로가기</h2>

              {/* Primary CTA */}
              <div className="mb-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${branch.phone.replaceAll("-", "")}`}
                  className="rounded-[10px] bg-[#D01E2E] px-6 py-3 text-sm font-black text-white transition hover:bg-[#B71C2B]"
                >
                  전화 문의
                </a>

                {branch.booking && (
                  <a
                    href={branch.booking}
                    target="_blank"
                    className="rounded-[10px] border border-[#4A4C50]/40 bg-[#0E0E10] px-6 py-3 text-sm font-black text-[#F5F4F1] transition hover:border-white/30"
                  >
                    네이버 예약
                  </a>
                )}

                {branch.kakaoChat && (
                  <a
                    href={branch.kakaoChat}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-[#0E0E10] px-6 py-3 text-sm font-black text-[#F5F4F1] transition hover:border-white/30"
                  >
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#FEE500" }} />
                    카카오 문의
                  </a>
                )}
              </div>

              {/* Secondary links */}
              <div className="flex flex-wrap gap-2">
                {branch.naverMap && (
                  <a href={branch.naverMap} target="_blank"
                    className="rounded-[8px] border border-[#4A4C50]/25 px-4 py-2 text-xs font-bold text-[#8A8D91] transition hover:text-white">
                    네이버지도
                  </a>
                )}
                {branch.kakaoMap && (
                  <a href={branch.kakaoMap} target="_blank"
                    className="rounded-[8px] border border-[#4A4C50]/25 px-4 py-2 text-xs font-bold text-[#8A8D91] transition hover:text-white">
                    카카오맵
                  </a>
                )}
                {branch.googleMap && (
                  <a href={branch.googleMap} target="_blank"
                    className="rounded-[8px] border border-[#4A4C50]/25 px-4 py-2 text-xs font-bold text-[#8A8D91] transition hover:text-white">
                    구글지도
                  </a>
                )}
                <a href={branch.instagram} target="_blank"
                  className="rounded-[8px] border border-[#4A4C50]/25 px-4 py-2 text-xs font-bold text-[#8A8D91] transition hover:text-white">
                  인스타그램
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24" style={{ background: "#141416" }}>
        <div className="mx-auto max-w-[1280px] lg:px-4">
          <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>PROGRAM</p>
          <h2 className="mb-12 font-black tracking-[-0.05em]" style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
            {branch.area} 복싱 프로그램
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "복싱 입문", "처음 배우는 분들도 스텝과 기본 자세부터 차근차근 배웁니다."],
              ["02", "다이어트 복싱", "지루하지 않게 땀나는 복싱 트레이닝으로 운동량을 높입니다."],
              ["03", "체력 향상", "운동 목적과 체력에 맞춰 무리 없이 꾸준히 운동할 수 있습니다."],
            ].map(([num, title, desc]) => (
              <div
                key={title}
                className="group rounded-[16px] border border-[#4A4C50]/30 bg-[#0E0E10] p-9 transition duration-300 hover:-translate-y-1 hover:border-[#4A4C50]/60 hover:bg-[#141416]"
              >
                <p className="mb-8 text-xs font-black" style={{ color: "#2A2A2E" }}>{num}</p>
                <h3 className="mb-3 text-2xl font-black tracking-[-0.04em] text-[#F5F4F1]">{title}</h3>
                <p className="leading-7 text-[#8A8D91]">{desc}</p>
              </div>
            ))}
          </div>

          {/* 수업 흐름 */}
          <div className="mt-8 rounded-[16px] border border-[#4A4C50]/30 bg-[#0E0E10] p-9">
            <p className="mb-6 text-xs font-black tracking-[0.28em]" style={{ color: "#5A5C61" }}>1회 수업 흐름</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {[
                ["01", "몸풀기"],
                ["02", "줄넘기"],
                ["03", "자세 & 스텝"],
                ["04", "미트 트레이닝"],
                ["05", "샌드백"],
                ["06", "체력 운동"],
              ].map(([n, s]) => (
                <div key={n} className="flex flex-col items-center gap-2 rounded-[10px] border border-[#4A4C50]/20 p-4 text-center">
                  <span className="text-[10px] font-black" style={{ color: "#5A5C61" }}>{n}</span>
                  <span className="text-xs font-bold leading-tight text-[#8A8D91]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="px-6 py-24">
        <div className="mx-auto max-w-[1280px] lg:px-4">
          <div className="relative overflow-hidden rounded-[20px] border border-[#4A4C50]/30 bg-[#111214] p-12 text-center md:p-16">
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(208,30,46,0.07) 0%, transparent 70%)" }} />
            <p className="relative mb-4 text-xs font-black tracking-[0.38em]" style={{ color: "#5A5C61" }}>STRONG BOXING</p>
            <h2 className="relative mb-4 font-black tracking-[-0.05em] text-[#F5F4F1]" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              {branch.name}에서 시작해볼까요?
            </h2>
            <p className="relative mb-10 text-base leading-8 text-[#8A8D91]">
              처음이어도 괜찮습니다. 운동 목적에 맞춰 상담 후 안내해드립니다.
            </p>
            <div className="relative flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:${branch.phone.replaceAll("-", "")}`}
                className="group inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#D01E2E] px-9 py-4 font-black text-white transition hover:bg-[#B71C2B]"
              >
                전화 문의
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              {branch.booking && (
                <a
                  href={branch.booking}
                  target="_blank"
                  className="rounded-[10px] border border-[#4A4C50]/40 px-9 py-4 font-black text-[#F5F4F1] transition hover:border-white/30 hover:bg-white/6"
                >
                  네이버 예약
                </a>
              )}
              {branch.kakaoChat && (
                <a
                  href={branch.kakaoChat}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#4A4C50]/40 px-9 py-4 font-black text-[#F5F4F1] transition hover:border-white/30 hover:bg-white/6"
                >
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#FEE500" }} />
                  카카오 문의
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24" style={{ background: "#0E0E10", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-[1280px] lg:px-4">

          {/* 지역 소개 */}
          <div className="mb-20 grid gap-12 md:grid-cols-2">
            <div className="overflow-hidden rounded-[14px] border border-[#4A4C50]/30">
              <img
                src={branch.image}
                alt={`${branch.area} 복싱장 ${branch.fullName} 내부`}
                className="h-[380px] w-full object-cover"
                style={{ filter: "brightness(0.9)" }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>ABOUT</p>
              <h2 className="mb-2 break-keep font-black tracking-[-0.04em] text-[#F5F4F1]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
                {seoContent?.title || `${branch.area} 복싱 입문 전문 체육관`}
              </h2>
              <div className="my-5 h-[2px] w-10" style={{ background: "#D01E2E" }} />
              <p className="max-w-lg break-keep text-base leading-8 text-[#8A8D91]">
                {seoContent?.description || branch.description}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {["초보자 개인지도", "여성 회원 환영", "다이어트 복싱", "직장인 야간 운동"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm" style={{ color: "#8A8D91" }}>
                    <span className="h-1 w-1 rounded-full shrink-0" style={{ background: "#D01E2E" }} />
                    {t}
                  </div>
                ))}
              </div>
              {seoContent?.nearby && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {seoContent.nearby.map((area: string) => (
                    <span key={area} className="rounded-full border border-[#4A4C50]/30 px-3 py-1 text-xs font-bold text-[#8A8D91]">
                      {area} 인근
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.32em]" style={{ color: "#5A5C61" }}>FAQ</p>
            <h2 className="mb-10 text-3xl font-black tracking-[-0.04em] text-[#F5F4F1] md:text-4xl">
              자주 묻는 질문
            </h2>

            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[14px] border border-[#4A4C50]/25 bg-[#141416] p-7 transition duration-250 hover:border-[#4A4C50]/55"
                >
                  <h3 className="text-base font-black tracking-[-0.02em] text-[#F5F4F1]">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#8A8D91]">
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