import type { Metadata } from "next";
import CalorieCalculator from "./CalorieCalculator";

const siteUrl = "https://strongboxing.kr";
const PAGE_TITLE = "복싱 칼로리 계산기 | 스트롱복싱";
const PAGE_DESC =
  "복싱 1시간 칼로리 소모량을 체중·운동 시간별로 계산해보세요. 스트롱복싱 수업 기준 다이어트 복싱 효과를 직접 확인할 수 있습니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  keywords: ["복싱 칼로리", "복싱 다이어트 칼로리", "복싱 1시간 칼로리", "다이어트 복싱 효과", "복싱 칼로리 소모"],
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl}/tools/boxing-calorie` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${siteUrl}/tools/boxing-calorie`,
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [`${siteUrl}/og.png`],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "복싱 칼로리 계산기", item: `${siteUrl}/tools/boxing-calorie` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "복싱 1시간 칼로리 소모량은 얼마나 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "체중 70kg 기준 복싱 1시간 운동 시 약 686kcal를 소모합니다. 체중과 운동 강도에 따라 달라질 수 있습니다.",
        },
      },
      {
        "@type": "Question",
        name: "복싱이 다이어트에 효과적인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "복싱은 유산소와 근력 운동이 결합된 고강도 운동으로, 1시간에 600~800kcal를 소모합니다. 전신 근육을 사용해 체지방 감소와 기초대사량 향상에 효과적입니다.",
        },
      },
      {
        "@type": "Question",
        name: "처음 복싱을 시작할 때 칼로리 소모량은 어떻게 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "초보자도 복싱 수업 1회(1시간)에 400~600kcal를 소모할 수 있습니다. 스트롱복싱에서는 초보자 맞춤 수업을 제공합니다.",
        },
      },
    ],
  },
];

export default function BoxingCaloriePage() {
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <CalorieCalculator />
    </>
  );
}
