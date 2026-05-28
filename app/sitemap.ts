import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://strongboxing.kr";

  const routes = [
    "",
    "/blog",
    "/reservation",
    "/branches/cheolsan",
    "/branches/gaebong",
    "/branches/mokdong",
    "/branches/sinjeong",
    "/branches/yeongdeungpo",
  ];

  const [posts]: any = await db.query(`
    SELECT slug, created_at
    FROM homepage_posts
    ORDER BY created_at DESC
  `);

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogRoutes = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.created_at
      ? new Date(post.created_at)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}