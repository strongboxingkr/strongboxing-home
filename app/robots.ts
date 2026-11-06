import type { MetadataRoute } from "next";

const DISALLOW = ["/admin", "/admin-login", "/hq", "/blog?*", "/feed.xml"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "Yeti",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "NaverBot",
        allow: "/",
        disallow: DISALLOW,
      },
    ],

    sitemap: "https://strongboxing.kr/sitemap.xml",

    host: "https://strongboxing.kr",
  };
}