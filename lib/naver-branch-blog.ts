import { unstable_cache } from "next/cache";

const blogIds: Partial<Record<string, string>> = {
  mokdong: "strongboxing_mokdong",
  cheolsan: "strongboxing_cheol",
};

type BlogPost = { title: string; url: string; publishedAt: string | null };

const xmlEntities: Record<string, string> = {
  amp: "&", apos: "'", gt: ">", lt: "<", quot: '"',
};

function readText(item: string, tag: string) {
  const value = new RegExp("<" + tag + ">([\\s\\S]*?)</" + tag + ">", "i").exec(item)?.[1]?.trim() ?? "";
  const cdata = /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(value);
  return cdata ? cdata[1].trim() : value.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (whole, entity: string) => {
    if (!entity.startsWith("#")) return xmlEntities[entity] ?? whole;
    const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : whole;
  });
}

const loadPosts = unstable_cache(async (blogId: string) => {
  const response = await fetch("https://rss.blog.naver.com/" + blogId + ".xml", {
    redirect: "error",
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Naver RSS HTTP " + response.status);
  const xml = await response.text();
  if (!/<rss\b/i.test(xml)) throw new Error("Unexpected Naver RSS response");
  const posts: BlogPost[] = [];
  const seen = new Set<string>();
  for (const [, item] of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const title = readText(item, "title");
    const path = /^https?:\/\/(?:m\.)?blog\.naver\.com\/([\w-]+)\/(\d+)(?:[?#]|$)/i.exec(readText(item, "link"));
    if (!title || !path || path[1].toLowerCase() !== blogId || seen.has(path[2])) continue;
    seen.add(path[2]);
    const date = Date.parse(readText(item, "pubDate"));
    posts.push({
      title,
      url: "https://blog.naver.com/" + blogId + "/" + path[2],
      publishedAt: Number.isFinite(date) ? new Date(date).toISOString() : null,
    });
    if (posts.length === 3) break;
  }
  return posts;
}, ["branch-naver-blog-posts"], { revalidate: 900 });

export async function getBranchNaverBlog(slug: string) {
  const blogId = blogIds[slug];
  if (!blogId) return null;
  const url = "https://blog.naver.com/" + blogId;
  const posts = await loadPosts(blogId).catch((error) => {
    console.warn("Branch Naver RSS unavailable", blogId, error instanceof Error ? error.message : error);
    return [];
  });
  return { url, posts };
}
