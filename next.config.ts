import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // middleware가 /api/*를 인터셉트할 때 body 복사 버퍼 한도 (기본 10MB → 영상 업로드 실패 원인)
    proxyClientMaxBodySize: "500mb",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.strongboxing.kr" }],
        destination: "https://strongboxing.kr/:path*",
        permanent: true,
      },
      {
        source: "/blog/quick-change-with-strongboxing-shinjeong-kids-boxing",
        destination: "/blog/quick-change-with-strongboxing-sinjeong-kids-boxing",
        permanent: true,
      },
      // 워드프레스 잔재 URL → 현재 페이지로 301
      {
        source: "/2026/:year/:month/:slug/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/위치-문의-contact/",
        destination: "/reservation",
        permanent: true,
      },
      {
        source: "/author/:slug/",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
