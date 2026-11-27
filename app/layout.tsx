import { branchSlugs } from "@/lib/branch-landing";
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
  department: branchSlugs.map((slug) => ({ "@id": "https://strongboxing.kr/" + slug + "#localbusiness" })),
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
      "naver-site-verification": "12d1716111cc26657b03f8175e9fa67fc6c6f51b",
      "google-adsense-account": "ca-pub-5266044409030851",
      "msvalidate.01": "9A92E09FC6BE3F0E241F3A1BAC43C028",
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
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/icon-192.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
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

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5266044409030851"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <GATracker />
        {children}
      </body>
    </html>
  );
}