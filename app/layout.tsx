import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import GATracker from "@/app/components/GATracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "스트롱복싱",
  url: "https://strongboxing.kr",
  image: "https://strongboxing.kr/og.png",
  description:
    "스트롱복싱은 복싱 PT, 다이어트 복싱, 체력증진 프로그램을 운영하는 프리미엄 복싱짐입니다.",
  sameAs: [
    "https://www.instagram.com/strongboxing_gaebong",
    "https://www.instagram.com/strongboxing_sinjeong",
    "https://www.instagram.com/strongboxing_mokdong",
    "https://www.instagram.com/strongboxing_cheolsan",
    "https://www.instagram.com/stron_gboxinggym",
  ],
  department: [
    {
      "@type": "SportsActivityLocation",
      name: "스트롱복싱 개봉점",
      telephone: "02-2060-1279",
      url: "https://strongboxing.kr/branches/gaebong",
      sameAs: [
        "https://www.instagram.com/strongboxing_gaebong",
        "https://naver.me/5aFquqcz",
        "https://kko.to/RmPQ1W8t8g",
      ],
      address: {
        "@type": "PostalAddress",
        postalCode: "08274",
        addressRegion: "서울특별시",
        addressLocality: "구로구",
        streetAddress: "개봉동 166-5 유원빌딩 지하 1층",
        addressCountry: "KR",
      },
      openingHours: "Mo-Fr 13:00-23:00",
    },
    {
      "@type": "SportsActivityLocation",
      name: "스트롱복싱 신정점",
      telephone: "02-2647-3373",
      url: "https://strongboxing.kr/branches/sinjeong",
      sameAs: [
        "https://www.instagram.com/strongboxing_sinjeong",
        "https://naver.me/5nhXvzXH",
        "https://kko.to/NlN6yV0aK3",
      ],
      address: {
        "@type": "PostalAddress",
        postalCode: "08087",
        addressRegion: "서울특별시",
        addressLocality: "양천구",
        streetAddress: "신정동 1021-7 태화상가 2층",
        addressCountry: "KR",
      },
      openingHours: ["Mo-Fr 10:00-14:00", "Mo-Fr 15:00-24:00", "Sa 10:00-16:00"],
    },
    {
      "@type": "SportsActivityLocation",
      name: "스트롱복싱 목동점",
      telephone: "02-2643-5971",
      url: "https://strongboxing.kr/branches/mokdong",
      sameAs: [
        "https://www.instagram.com/strongboxing_mokdong",
        "https://naver.me/GII8f9Qv",
      ],
      address: {
        "@type": "PostalAddress",
        postalCode: "07984",
        addressRegion: "서울특별시",
        addressLocality: "양천구",
        streetAddress: "목동 909-6 우방빌딩 4층",
        addressCountry: "KR",
      },
      openingHours: ["Mo-Fr 14:00-24:00", "Sa 11:00-16:00"],
    },
    {
      "@type": "SportsActivityLocation",
      name: "스트롱복싱 철산점",
      telephone: "02-2066-0406",
      url: "https://strongboxing.kr/branches/cheolsan",
      sameAs: ["https://www.instagram.com/strongboxing_cheolsan"],
      address: {
        "@type": "PostalAddress",
        postalCode: "14209",
        addressRegion: "경기도",
        addressLocality: "광명시",
        streetAddress: "철산동 56-14 3층",
        addressCountry: "KR",
      },
      openingHours: ["Mo-Fr 13:00-23:00", "Sa 11:00-16:00"],
    },
    {
      "@type": "SportsActivityLocation",
      name: "스트롱복싱 영등포점",
      telephone: "02-831-9312",
      url: "https://strongboxing.kr/branches/yeongdeungpo",
      sameAs: [
        "https://www.instagram.com/stron_gboxinggym",
        "https://naver.me/G4yQwkR0",
      ],
      address: {
        "@type": "PostalAddress",
        postalCode: "07380",
        addressRegion: "서울특별시",
        addressLocality: "영등포구",
        streetAddress: "도림로 313 건영상가 2층",
        addressCountry: "KR",
      },
      openingHours: "Mo-Fr 13:00-23:00",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://strongboxing.kr"),

  title: {
    default: "스트롱복싱 | 복싱 PT · 다이어트 복싱 · 체력증진",
    template: "%s | 스트롱복싱",
  },

  description:
    "스트롱복싱은 복싱 PT, 다이어트 복싱, 체력증진 프로그램을 운영하는 프리미엄 복싱짐입니다. 철산, 개봉, 목동, 신정, 영등포 지점을 운영중입니다.",

  keywords: [
    "스트롱복싱",
    "복싱장",
    "복싱 PT",
    "다이어트 복싱",
    "철산 복싱",
    "목동 복싱",
    "개봉 복싱",
    "신정 복싱",
    "영등포 복싱",
    "복싱 다이어트",
    "복싱 체육관",
  ],

  verification: {
    other: {
      "naver-site-verification":
        "12d1716111cc26657b03f8175e9fa67fc6c6f51b",
    },
  },

  openGraph: {
    title: "스트롱복싱",
    description: "복싱 PT · 다이어트 복싱 · 체력증진 프로그램 운영",
    url: "https://strongboxing.kr",
    siteName: "스트롱복싱",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "스트롱복싱",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "스트롱복싱",
    description: "복싱 PT · 다이어트 복싱 · 체력증진 프로그램 운영",
    images: ["/og.png"],
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://strongboxing.kr",
    types: {
      "application/rss+xml": "https://strongboxing.kr/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YG7VZ2S2Y0"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YG7VZ2S2Y0', { send_page_view: false });
          `}
        </Script>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />

        <GATracker />
        {children}
      </body>
    </html>
  );
}