import { branchSlugs } from "@/lib/branch-landing";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://strongboxing.kr";

  const routes = [
    "",
    "/blog",
    "/reservation",
    "/tools/boxing-calorie",
    ...branchSlugs.map((slug) => "/" + slug),
  ];

  const posts = await db.query<(RowDataPacket & { slug: string; created_at?: string | Date })[]>(`
    SELECT slug, created_at
    FROM homepage_posts
    WHERE branch_name IS NOT NULL AND branch_name NOT IN ('', '전체')
    ORDER BY created_at DESC
  `).then(([rows]) => rows).catch((error) => {
    console.error("Could not load blog URLs for sitemap", error instanceof Error ? error.message : error);
    return [];
  });

  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : branchSlugs.some((slug) => route === "/" + slug) ? 0.9 : 0.8,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.created_at
      ? new Date(post.created_at)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}