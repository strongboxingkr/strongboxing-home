import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // middleware가 /api/*를 인터셉트할 때 body 복사 버퍼 한도 (기본 10MB → 영상 업로드 실패 원인)
    proxyClientMaxBodySize: "500mb",
  },
};

export default nextConfig;
