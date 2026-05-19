import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://strongboxing.kr";

  const routes = [
    "",
    "/blog",
    "/branches/cheolsan",
    "/branches/gaebong",
    "/branches/mokdong",
    "/branches/sinjeong",
    "/branches/yeongdeungpo",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}