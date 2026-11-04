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
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;
