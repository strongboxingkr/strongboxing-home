import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
      {
        userAgent: "NaverBot",
        allow: "/",
      },
    ],

    sitemap: "https://strongboxing.kr/sitemap.xml",

    host: "https://strongboxing.kr",
  };
}