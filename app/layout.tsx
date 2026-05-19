import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    description:
      "복싱 PT · 다이어트 복싱 · 체력증진 프로그램 운영",
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
    description:
      "복싱 PT · 다이어트 복싱 · 체력증진 프로그램 운영",
    images: ["/og.png"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  robots: {
    index: true,
    follow: true,
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
        {children}
      </body>
    </html>
  );
}