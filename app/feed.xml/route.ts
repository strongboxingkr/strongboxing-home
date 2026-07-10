import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE_URL = "https://strongboxing.kr";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT title, slug, description, branch_name, created_at
    FROM homepage_posts
    ORDER BY created_at DESC
    LIMIT 50
  `);

  const items = (rows as any[])
    .map((post: any) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.created_at).toUTCString();
      const desc = post.description
        ? escapeXml(post.description)
        : `${escapeXml(post.branch_name)} 스트롱복싱 소식`;
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <category><![CDATA[${post.branch_name}]]></category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>스트롱복싱 블로그</title>
    <link>${SITE_URL}/blog</link>
    <description>스트롱복싱 지점별 소식, 복싱 수업 안내, 운동 정보</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
