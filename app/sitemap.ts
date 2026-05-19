import { db } from "@/lib/db";
import type { MetadataRoute } from "next";

const siteUrl = "https://strongboxing.kr";

const branches = ["gaebong", "sinjeong", "mokdong", "cheolsan", "yeongdeungpo"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts]: any = await db.query(`
    SELECT slug, created_at
    FROM homepage_posts
    ORDER BY created_at DESC
  `);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tools/boxing-calorie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...branches.map((slug) => ({
      url: `${siteUrl}/branches/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...posts.map((post: any) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.created_at ? new Date(post.created_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}