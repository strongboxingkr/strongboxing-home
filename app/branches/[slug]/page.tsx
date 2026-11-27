import { getBranchNaverBlog } from "@/lib/naver-branch-blog";
import { branchLanding, branchSlugs } from "@/lib/branch-landing";
import { branchTrainingPhotos } from "@/lib/branch-training-photos";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BranchPreview, { type PreviewPost, type PreviewReel, type PreviewReview } from "@/app/renewal/branches/[slug]/BranchPreview";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

type Branch = Parameters<typeof BranchPreview>[0]["branch"] & { image: string; searchImage: string; searchTitle: string; streetAddr: string; addressLocality: string; addressRegion: string; openingHoursSpec: { "@type": string; dayOfWeek: string[]; opens: string; closes: string }[] };

const branches: Record<string, Branch> = {
  gaebong: {
    directions: "개봉역에서 걸어오실 수 있어요. 유원빌딩 지하 1층으로 오세요. 구로구 개봉동에 있으며 고척동·오류동·천왕동에서도 찾아오기 편합니다.",
    streetAddr: "개봉동 166-5 유원빌딩 지하 1층",
    addressLocality: "구로구",
    addressRegion: "서울특별시",
    openingHoursSpec: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "13:00", closes: "23:00" },
    ],
    name: "개봉점", fullName: "스트롱복싱 개봉점", area: "개봉",
    image: "/images/branches/gaebong.jpg",
    searchImage: "/images/branches/search/gaebong.jpg",
    phone: "02-2060-1279", hours: ["평일 13:00–23:00", "주말 운영 여부는 지점 문의"],
    instagram: "https://www.instagram.com/strongboxing_gaebong",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz", kakaoChat: "https://pf.kakao.com/_uyxbnX/chat",
    address: "(08274) 서울시 구로구 개봉동 166-5번지 (유원빌딩) 지하 1층",
    landmark: "유원빌딩 지하 1층",
    kakaoMap: "https://kko.to/RmPQ1W8t8g",
    region: "구로 개봉·고척",
    searchTitle: "개봉·고척 복싱장 | 여성 복싱·퇴근 후 운동 · 스트롱복싱",
    intro: "개봉·고척에서 퇴근 후 배우는 복싱. 처음 오셔도 관장이 자세와 스텝부터 봐드려요.",
    description: "구로구 개봉·고척에서 여성 복싱이나 퇴근 후 할 운동을 찾는다면 기본 자세와 스텝부터 시작해 보세요. 평일 밤 11시까지 운영하며, 관장이 운동 중 자세를 살피고 개인 진도에 맞춰 다음 동작을 안내합니다.",
    highlights: ["여성 복싱", "퇴근 후 운동", "관장 직접 지도"],
  },
  sinjeong: {
    directions: "신정네거리역 인근 양천구 신정동에 있어요. 신월동·까치산·화곡동에서 오시는 분은 길찾기에서 방문 경로를 확인할 수 있어요.",
    streetAddr: "신정동 1021-7 태화상가 2층",
    addressLocality: "양천구",
    addressRegion: "서울특별시",
    openingHoursSpec: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "10:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "15:00", closes: "00:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "10:00", closes: "16:00" },
    ],
    name: "신정점", fullName: "스트롱복싱 신정점", area: "신정",
    image: "/images/branches/sinjeong.jpg",
    searchImage: "/images/branches/search/sinjeong.jpg",
    phone: "02-2647-3373", hours: ["평일 10:00–24:00 (14:00–15:00 휴게)", "토 10:00–16:00"],
    instagram: "https://www.instagram.com/strongboxing.sinjeong",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH", kakaoChat: "https://pf.kakao.com/_rxoQxiX/chat",
    address: "(08087) 서울시 양천구 신정동 1021-7 (태화상가) 2층",
    landmark: "태화상가 2층",
    kakaoMap: "https://kko.to/NlN6yV0aK3",
    region: "양천구 신정네거리",
    searchTitle: "신정네거리 복싱장 | 키즈 복싱·오전 운동 · 스트롱복싱",
    intro: "신정네거리에서 시작하는 키즈·여성 복싱. 평일 오전 10시부터 운동할 수 있어요.",
    description: "양천구 신정네거리에서 초등학생 키즈 복싱을 찾는 분은 아이가 줄넘기, 기본 자세, 스텝부터 배울 수 있어요. 성인도 평일 오전 10시부터 여성 복싱과 체력 운동을 각자의 진도에 맞춰 시작할 수 있습니다.",
    highlights: ["키즈 복싱", "여성 복싱", "평일 오전 10시부터", "토요일 운영"],
  },
  mokdong: {
    directions: "목동역과 오목교역 사이에 있어요. 목동동로의 우방빌딩 4층으로 오시면 됩니다.",
    streetAddr: "목동 909-6 우방빌딩 4층",
    addressLocality: "양천구",
    addressRegion: "서울특별시",
    openingHoursSpec: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "14:00", closes: "00:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "11:00", closes: "16:00" },
    ],
    googleMap: "https://maps.google.com/?q=스트롱복싱+목동점",
    reviewUrl: "https://m.place.naver.com/place/2036376446/review/visitor",
    name: "목동점", fullName: "스트롱복싱 목동점", area: "목동",
    image: "/images/branches/mokdong.png",
    searchImage: "/images/branches/search/mokdong.jpg",
    phone: "02-2643-5971", hours: ["평일 14:00–24:00", "토 11:00–16:00", "일 휴무"],
    instagram: "https://www.instagram.com/strongboxing_mokdong",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv", kakaoChat: "https://pf.kakao.com/_xfGZnX/chat",
    address: "(07984) 서울시 양천구 목동 909-6 (우방빌딩) 4층",
    landmark: "우방빌딩 4층",
    kakaoMap: "https://place.map.kakao.com/1917925446",
    region: "양천구 목동",
    searchTitle: "목동 복싱장 | 학생·키즈 복싱, 평일 밤 12시까지 · 스트롱복싱",
    intro: "목동 학생·키즈 복싱부터 직장인 운동까지. 평일 밤 12시까지 운영해요.",
    description: "양천구 목동에서 학생 운동이나 키즈 복싱을 찾는 분들을 위한 체육관입니다. 관장이 자세와 스텝부터 지도하고, 평일 밤 12시까지 운영해 퇴근 후에도 들르기 좋아요.",
    highlights: ["학생·키즈 복싱","평일 밤 12시까지","관장 직접 지도"],
  },
  cheolsan: {
    directions: "메가커피 광명위브점 건물 3층에 있어요. 철산역·광명사거리·하안동·소하동 방면에서 오시는 분은 길찾기에서 방문 경로를 확인해 주세요.",
    streetAddr: "철산동 56-14 3층",
    addressLocality: "광명시",
    addressRegion: "경기도",
    openingHoursSpec: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "14:00", closes: "23:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "14:00", closes: "18:00" },
    ],
    reviewUrl: "https://m.place.naver.com/place/2037244259/review/visitor",
    name: "철산점", fullName: "스트롱복싱 철산점", area: "철산",
    image: "/images/branches/cheolsan.jpg",
    searchImage: "/images/branches/search/cheolsan.jpg",
    phone: "02-2066-0406", hours: ["평일 14:00–23:00", "토·일 14:00–18:00", "공휴일 휴무"],
    instagram: "https://www.instagram.com/strongboxing_cheolsan",
    booking: "https://booking.naver.com/booking/12/bizes/1673598",
    naverMap: "https://naver.me/F8lwn3Te", kakaoChat: "https://pf.kakao.com/_MAKnX/chat",
    address: "(14209) 경기도 광명시 철산동 56-14 3층",
    landmark: "메가커피 광명위브점 건물 3층",
    kakaoMap: "https://place.map.kakao.com/1182676078",
    region: "광명 철산동",
    searchTitle: "철산·광명 복싱장 | 여성 복싱·주말 운동 · 스트롱복싱",
    intro: "광명 철산동에서 퇴근 후나 주말에 배우는 복싱. 처음 오셔도 기본 자세부터 시작해요.",
    description: "광명시 철산동에서 여성 복싱, 주말 운동, 직장인 퇴근 후 운동을 시작할 수 있어요. 평일 저녁과 토·일에 운영하며, 복싱이 처음이라면 관장·코치가 운동 중 가드와 스텝을 살펴보고 미트 훈련을 진도에 맞춰 안내합니다.",
    highlights: ["여성 복싱", "토·일 14:00–18:00", "직장인 운동", "운동 중 자세 코칭"],
  },
  yeongdeungpo: {
    directions: "영등포구 도림동 도림로 313, 건영상가 2층에 있어요. 신길동·대림동에서 오시는 분은 길찾기에서 방문 경로를 확인할 수 있어요.",
    streetAddr: "도림로 313 건영상가 2층",
    addressLocality: "영등포구",
    addressRegion: "서울특별시",
    openingHoursSpec: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "13:00", closes: "23:00" },
    ],
    name: "영등포점", fullName: "스트롱복싱 영등포점", area: "영등포",
    image: "/images/branches/yeongdeungpo.jpg",
    searchImage: "/images/branches/search/yeongdeungpo.jpg",
    phone: "02-831-9312", hours: ["월-금 13:00~23:00"],
    instagram: "https://www.instagram.com/stron_gboxinggym",
    booking: "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0", kakaoChat: null,
    address: "서울시 영등포구 도림로 313 건영상가 2층",
    landmark: "건영상가 2층",
    region: "영등포구 도림동",
    searchTitle: "영등포 도림동 복싱장 | 학생·직장인 운동 · 스트롱복싱",
    intro: "영등포 도림동에서 방과 후나 퇴근 후에 배우는 복싱. 자세와 미트 훈련부터 시작해요.",
    description: "영등포구 도림동에서 방과 후 학생 운동이나 퇴근 후 체력 관리를 시작해 보세요. 헬스와 다른 전신 운동을 찾는 분도 기본 자세와 미트 훈련부터 배울 수 있어요.",
    highlights: ["방과 후 학생 운동","직장인 복싱","기초부터 지도"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const branch = branches[slug];
  const copy = branchLanding[slug as keyof typeof branchLanding];
  return {
    title: { absolute: copy?.title ?? "스트롱복싱 지점 안내" },
    description: copy?.description,
    robots: { index: true, follow: true },
    alternates: branch ? { canonical: `https://strongboxing.kr/${slug}` } : undefined,
    openGraph: branch ? { title: copy?.title, description: copy?.description, url: `https://strongboxing.kr/${slug}`, images: [branch.searchImage] } : undefined,
    twitter: branch ? { card: "summary_large_image", title: copy?.title, description: copy?.description, images: [branch.searchImage] } : undefined,
  };
}

const branchCoaches: Record<string, { name: string; role: string; instagram: string }[]> = {
  gaebong:      [{ name: "안진호", role: "관장", instagram: "dkswkd3" }],
  sinjeong:     [{ name: "유상혁", role: "관장", instagram: "robuste_hyeok" }, { name: "정동주", role: "코치", instagram: "jdj_00_" }],
  mokdong:      [{ name: "송재용", role: "관장", instagram: "nan_yong_" }, { name: "김민찬", role: "코치", instagram: "chan.__2" }],
  cheolsan:     [{ name: "안도연", role: "관장", instagram: "strongboxing_andy" }, { name: "신우수", role: "코치", instagram: "ws_nakmuay" }],
  yeongdeungpo: [],
};

const branchFaqs: Record<string, { question: string; answer: string }[]> = {
  gaebong: [
    { question: "개봉 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "여성 회원도 많이 다니나요?", answer: "네. 혼자 방문하는 여성 회원도 기본 자세와 스텝부터 시작할 수 있어요. 체력 관리가 목표라면 미트와 샌드백 훈련을 중심으로 운동 강도를 맞춰드립니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화만 준비해주시면 됩니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "개봉점은 월~금 13:00~23:00 운영합니다." },
    { question: "상담 예약은 어떻게 하나요?", answer: "홈페이지 방문 상담 예약, 전화, 카카오톡 문의로 신청하실 수 있습니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "네. 운영시간 내 편한 시간에 오시면 관장·코치가 개인별 진도에 맞춰 다음 동작을 알려드려요. 새 동작을 배울 때마다 자세를 봐드리고, 필요한 부분은 바로 잡아드려요." },
    { question: "네이버로 예약할 수 있나요?", answer: "네. 아래 네이버 예약 버튼에서 이 지점의 예약 가능한 날짜와 시간을 확인하고 신청할 수 있어요." },
    { question: "다이어트 복싱도 가능한가요?", answer: "복싱은 전신 운동이라 체중 관리와 체력 향상에 도움이 됩니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 체력 향상과 운동 습관을 만들기 좋습니다." },
    { question: "직장인 회원도 많이 다니나요?", answer: "퇴근 후 운동하시는 직장인 회원분들도 많이 이용하고 있습니다." },
  ],
  sinjeong: [
    { question: "초등학생도 키즈 복싱을 배울 수 있나요?", answer: "네. 줄넘기와 균형 잡기, 기본 자세와 스텝부터 시작합니다. 방문 전에 아이의 학년과 운동 경험을 알려주시면 참여 가능한 시간대를 안내해 드려요." },
    { question: "신정 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세, 스텝, 펀치부터 차근차근 안내해드립니다." },
    { question: "여성 회원도 운동 가능한가요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 많이 운동하고 계십니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "신정점은 월~금 10:00~24:00(14:00~15:00 휴게), 토요일 10:00~16:00 운영합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
    { question: "직장인도 다니기 괜찮나요?", answer: "평일 저녁 시간대에 퇴근 후 운동하시는 직장인 회원도 많습니다." },
    { question: "다이어트 복싱도 가능한가요?", answer: "복싱은 유산소와 근력 운동이 함께 들어가 다이어트와 체력 향상에 도움이 됩니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "네. 운영시간 내 편한 시간에 오시면 관장·코치가 개인별 진도에 맞춰 다음 동작을 알려드려요. 새 동작을 배울 때마다 자세를 봐드리고, 필요한 부분은 바로 잡아드려요." },
    { question: "네이버로 예약할 수 있나요?", answer: "네. 아래 네이버 예약 버튼에서 이 지점의 예약 가능한 날짜와 시간을 확인하고 신청할 수 있어요." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약 또는 전화 문의로 상담 신청이 가능합니다." },
  ],
  mokdong: [
    { question: "목동 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 체력 향상과 기초 운동 습관을 만들기 좋습니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "평일 14:00–24:00, 토요일 11:00–16:00에 운영하며 일요일은 휴무입니다." },
    { question: "준비물은 무엇이 필요한가요?", answer: "편한 운동복과 실내용 운동화만 준비해주시면 됩니다." },
    { question: "원데이 클래스는 얼마인가요?", answer: "원데이 체험 30,000원 · 당일 등록 시 체험비 전액 차감. 회원권 가격은 지점에 문의해 주세요." },
    { question: "여성 회원도 많이 다니나요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 많이 운동하고 계십니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "네. 운영시간 내 편한 시간에 오시면 관장·코치가 개인별 진도에 맞춰 다음 동작을 알려드려요. 새 동작을 배울 때마다 자세를 봐드리고, 필요한 부분은 바로 잡아드려요." },
    { question: "네이버로 예약할 수 있나요?", answer: "네. 아래 네이버 예약 버튼에서 이 지점의 예약 가능한 날짜와 시간을 확인하고 신청할 수 있어요." },
    { question: "다이어트 효과가 있나요?", answer: "복싱은 전신 운동이라 꾸준히 하면 체중 관리와 체력 향상에 도움이 됩니다." },
    { question: "직장인도 운동하기 괜찮나요?", answer: "평일 늦은 시간까지 운영해 퇴근 후 운동하시는 직장인 회원도 많습니다." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약, 전화, 카카오톡 문의로 상담 신청이 가능합니다." },
  ],
  cheolsan: [
    { question: "복싱 처음인데 괜찮을까요?", answer: "초보자도 기초 자세와 스텝부터 차근차근 배울 수 있습니다." },
    { question: "광명 다이어트 운동으로 복싱이 효과 있나요?", answer: "복싱은 유산소와 근력이 결합된 전신 운동이라 다이어트 효과가 높습니다." },
    { question: "주말에도 운영하나요?", answer: "네, 토·일요일 14:00~18:00 운영합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
    { question: "광명 여성 운동으로 가능한가요?", answer: "여성 회원도 편하게 운동하실 수 있습니다. 다이어트, 체력 향상, 스트레스 해소 목적으로 여성 회원분들이 많이 등록하고 계십니다." },
    { question: "직장인도 다니기 괜찮나요?", answer: "평일 저녁 늦게까지 운영하며 토·일요일도 운영합니다. 퇴근 후 또는 주말에 운동하시는 직장인 회원도 많습니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "네. 운영시간 내 편한 시간에 오시면 관장·코치가 개인별 진도에 맞춰 다음 동작을 알려드려요. 새 동작을 배울 때마다 자세를 봐드리고, 필요한 부분은 바로 잡아드려요." },
    { question: "네이버로 예약할 수 있나요?", answer: "네. 아래 네이버 예약 버튼에서 이 지점의 예약 가능한 날짜와 시간을 확인하고 신청할 수 있어요." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약, 전화(02-2066-0406), 카카오톡 문의로 신청하실 수 있습니다." },
  ],
  yeongdeungpo: [
    { question: "영등포 복싱 처음인데 가능할까요?", answer: "처음이신 분들도 기초부터 개인 수준에 맞춰 안내해드립니다." },
    { question: "직장인도 다니기 괜찮나요?", answer: "평일 저녁 시간대에 퇴근 후 운동하시는 직장인 회원도 많습니다." },
    { question: "운영시간은 어떻게 되나요?", answer: "영등포점은 월~금 13:00~23:00 운영합니다." },
    { question: "준비물은 무엇인가요?", answer: "편한 운동복과 실내용 운동화를 준비해주시면 됩니다." },
    { question: "여성 회원도 운동 가능한가요?", answer: "여성 회원분들도 다이어트, 체력 향상, 스트레스 해소 목적으로 많이 운동하고 계십니다." },
    { question: "다이어트 복싱도 가능한가요?", answer: "복싱은 유산소와 근력 운동이 함께 들어가 다이어트와 체력 향상에 도움이 됩니다." },
    { question: "개인별 운동으로 진행되나요?", answer: "네. 운영시간 내 편한 시간에 오시면 관장·코치가 개인별 진도에 맞춰 다음 동작을 알려드려요. 새 동작을 배울 때마다 자세를 봐드리고, 필요한 부분은 바로 잡아드려요." },
    { question: "네이버로 예약할 수 있나요?", answer: "네. 아래 네이버 예약 버튼에서 이 지점의 예약 가능한 날짜와 시간을 확인하고 신청할 수 있어요." },
    { question: "학생 회원도 등록 가능한가요?", answer: "학생 회원도 등록 가능하며 기초 체력과 운동 습관을 만들기 좋습니다." },
    { question: "상담은 어떻게 신청하나요?", answer: "홈페이지 방문 상담 예약 또는 전화(02-831-9312), 네이버 예약으로 상담 신청이 가능합니다." },
  ],
};

const mokdongFacilityPhotos = [
  { src: "/images/mokdong/facility-gallery/training-floor.webp", alt: "스트롱복싱 목동점 훈련 공간 전경과 샌드백" },
  { src: "/images/mokdong/facility-gallery/boxing-ring.webp", alt: "스트롱복싱 목동점 복싱 링과 샌드백" },
  { src: "/images/mokdong/facility-gallery/treadmills.webp", alt: "스트롱복싱 목동점 러닝머신", focusBottom: true },
  { src: "/images/mokdong/facility-gallery/strength-area.webp", alt: "스트롱복싱 목동점 덤벨과 바벨을 갖춘 웨이트 구역", focusBottom: true },
];

const cheolsanFacilityPhotos = [
  { src: "/images/cheolsan/facility-gallery/heavy-bags.webp", alt: "스트롱복싱 철산점 샌드백 훈련 공간" },
  { src: "/images/cheolsan/facility-gallery/reception.webp", alt: "스트롱복싱 철산점 로고와 안내 데스크" },
];

function getLocalClips(slug: string, branchName: string): PreviewReel[] {
  return (slug === "yeongdeungpo" ? [1, 2] : [1, 2, 3]).map((id) => ({
    id,
    title: `${branchName} 운동 영상 ${id}`,
    aria_label: null,
    poster: slug === "yeongdeungpo" ? "/images/branches/yeongdeungpo.jpg" : `/images/${slug}/clip-${id}.jpg`,
    video_url: `/videos/${slug}/${String(id).padStart(3, "0")}.mp4`,
  }));
}

function branchStructuredData(slug: string, branch: Branch, faq: { question: string; answer: string }[]) {
  const origin = "https://strongboxing.kr";
  const url = origin + "/" + slug;
  const coordinates = { gaebong: [37.4950, 126.8580], sinjeong: [37.5185, 126.8560], mokdong: [37.5290, 126.8720], cheolsan: [37.4895495, 126.8652713], yeongdeungpo: [37.5075, 126.8990] };
  const [latitude, longitude] = coordinates[slug as keyof typeof coordinates];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ExerciseGym", "SportsActivityLocation"],
        "@id": url + "#localbusiness",
        name: branch.fullName,
        url,
        description: branchLanding[slug as keyof typeof branchLanding].description,
        image: origin + branch.searchImage,
        telephone: branch.phone.replace(/^0/, "+82-"),
        geo: { "@type": "GeoCoordinates", latitude, longitude },
        parentOrganization: { "@type": "Organization", name: "스트롱복싱", url: origin + "/" },
        priceRange: "원데이 30,000원",
        makesOffer: { "@type": "Offer", price: 30000, priceCurrency: "KRW", itemOffered: { "@type": "Service", name: "원데이 복싱 체험" } },
        hasMap: branch.naverMap,
        address: {
          "@type": "PostalAddress",
          streetAddress: branch.streetAddr,
          addressLocality: branch.addressLocality,
          addressRegion: branch.addressRegion,
          addressCountry: "KR",
        },
        openingHoursSpecification: branch.openingHoursSpec.map((hours) => ({ ...hours, closes: hours.closes === "24:00" ? "00:00" : hours.closes })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  }).replace(/</g, "\\u003c");
}

export default async function BranchPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const branch = branches[slug];
  if (!branch || !branchSlugs.some((item) => item === slug)) return notFound();
  const query = await searchParams;

  const coaches = branchCoaches[slug] ?? [];
  const faqItems = branchFaqs[slug] ?? [];

  const [relatedPosts, branchReels, reviews, naverBlog] = await Promise.all([
    db.query<(PreviewPost & RowDataPacket)[]>(`SELECT id, title, slug, description, content, branch_name, thumbnail, created_at
      FROM homepage_posts WHERE branch_name = ? ORDER BY created_at DESC LIMIT 5`, [branch.name])
      .then(([rows]) => rows).catch(() => []),
    db.query<(PreviewReel & RowDataPacket)[]>(`SELECT id, branch_name, title, aria_label, video_url, is_muted
      FROM homepage_reels WHERE is_active = 1 AND branch_name = ? ORDER BY sort_order ASC, id DESC LIMIT 8`, [branch.name])
      .then(([rows]) => rows).catch(() => []),
    db.query<(PreviewReview & RowDataPacket)[]>(`SELECT id, reviewer_name, content, image_url, review_date
        FROM homepage_naver_reviews WHERE is_active = 1 AND branch_name = ? ORDER BY review_date DESC, id DESC`, [branch.name])
        .then(([rows]) => rows).catch(() => []),
    getBranchNaverBlog(slug),
  ]);

  function getThumb(post: PreviewPost): string | null {
    if (post.thumbnail) return post.thumbnail;
    const s = String(post.content || "");
    const m = s.match(/<img[^>]+src=["']([^"']+)["']/i) || s.match(/!\[.*?\]\((.*?)\)/);
    return m?.[1] ?? null;
  }

    const mediaRoot = `/images/${slug}`;
    const isMokdong = slug === "mokdong";
    const trainingPhotos = branchTrainingPhotos[slug] ?? [];
    const featuredTrainingIndices: Partial<Record<string, number[]>> = {
      cheolsan: [2, 17],
      gaebong: [0],
      mokdong: [7, 0],
      sinjeong: [1, 3],
    };
    const featuredTraining = (featuredTrainingIndices[slug] ?? []).map((index) => ({
      src: trainingPhotos[index],
      label: branch.name + " 복싱 훈련 모습",
    }));
    const heroPhotos = slug === "yeongdeungpo"
      ? [{ src: branch.image, label: "영등포점 체육관 내부" }]
      : [
          ...featuredTraining,
          { src: mediaRoot + (isMokdong ? "/mokdong-main.jpg" : "/gym.jpg"), label: branch.name + " 체육관 내부" },
          { src: branch.image, label: branch.name + " 대표 사진" },
        ].slice(0, 3);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: branchStructuredData(slug, branch, faqItems) }} />
      <BranchPreview
        branch={branch}
        slug={slug as keyof typeof branchLanding}
        query={query}
        photos={heroPhotos}
        coaches={coaches}
        posts={relatedPosts}
        naverBlog={naverBlog}
        reels={branchReels.length ? [...new Map(branchReels.map((reel) => [reel.video_url, { ...reel, poster: branch.image }])).values()] : getLocalClips(slug, branch.name).map((reel) => ({ ...reel, poster: branch.image }))}
        reviews={reviews}
        faq={faqItems}
        galleryImages={isMokdong ? mokdongFacilityPhotos : slug === "cheolsan" ? cheolsanFacilityPhotos : [{ src: slug === "yeongdeungpo" ? branch.image : mediaRoot + "/facility.jpg", alt: branch.name + " 복싱장 시설" }]}
        getThumb={getThumb}
      />
      </>
    );
}
