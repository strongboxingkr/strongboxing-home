"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  branch_name: string;
  category: string;
  created_at: string;
  content: string;
}

function getFirstImage(content: string) {
  const str = String(content || "");
  // HTML img 태그 우선 (RichTextEditor 출력)
  const html = str.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (html?.[1]) return html[1];
  // 마크다운 이미지 폴백
  const md = str.match(/!\[.*?\]\((.*?)\)/);
  return md?.[1] || null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function BlogViewClient({ posts }: { posts: Post[] }) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  useEffect(() => {
    const saved = localStorage.getItem("blogViewMode");
    if (saved === "card" || saved === "list") setViewMode(saved);
  }, []);

  const switchMode = (mode: "card" | "list") => {
    setViewMode(mode);
    localStorage.setItem("blogViewMode", mode);
  };

  return (
    <>
      {/* 뷰 전환 버튼 */}
      <div className="mb-6 flex justify-end">
        <div className="flex gap-1 rounded-[10px] border border-[#4A4C50]/30 bg-[#141416] p-1">
          <button
            onClick={() => switchMode("card")}
            className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-black transition-all duration-200"
            style={{
              background: viewMode === "card" ? "#D01E2E" : "transparent",
              color: viewMode === "card" ? "#fff" : "#8A8D91",
            }}
          >
            <LayoutGrid size={13} />
            카드형
          </button>
          <button
            onClick={() => switchMode("list")}
            className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-black transition-all duration-200"
            style={{
              background: viewMode === "list" ? "#D01E2E" : "transparent",
              color: viewMode === "list" ? "#fff" : "#8A8D91",
            }}
          >
            <List size={13} />
            리스트형
          </button>
        </div>
      </div>

      {/* 카드형 */}
      {viewMode === "card" && (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => {
            const image = getFirstImage(post.content);
            return (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[16px] border border-[#4A4C50]/30 bg-[#141416] transition duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                {image && (
                  <div className="h-[252px] overflow-hidden md:h-[252px]">
                    <img
                      src={image}
                      alt={post.title}
                      className="h-full w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#D01E2E] px-3 py-1 text-xs font-black">
                      {post.branch_name}
                    </span>
                    <span className="rounded-full border border-[#4A4C50]/30 px-3 py-1 text-xs text-[#8A8D91]">
                      {post.category}
                    </span>
                    <span className="text-xs text-[#8A8D91]">
                      {formatDate(post.created_at)}
                    </span>
                  </div>

                  <h2 className="mb-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[#F5F4F1] transition-colors group-hover:text-white">
                    {post.title}
                  </h2>

                  <p className="line-clamp-2 text-sm leading-7 text-[#8A8D91]">
                    {post.description}
                  </p>

                  <p className="mt-5 text-xs font-black text-[#D01E2E] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    자세히 보기 →
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* 리스트형 */}
      {viewMode === "list" && (
        <div className="overflow-hidden rounded-[12px] border border-[#4A4C50]/30">
          {posts.map((post, i) => {
            const thumb = getFirstImage(post.content);
            return (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-4 px-5 py-4 transition-all duration-200"
                style={{
                  borderBottom:
                    i < posts.length - 1 ? "1px solid rgba(74,76,80,0.2)" : "none",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(74,76,80,0.12)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                {/* 썸네일 */}
                <div
                  className="h-14 w-14 shrink-0 overflow-hidden rounded-[8px]"
                  style={{ background: "#1A1A1C" }}
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[18px] font-black" style={{ color: "#2A2A2E" }}>
                      S
                    </div>
                  )}
                </div>

                {/* 텍스트 */}
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-[11px] font-bold text-[#4A4C50]">
                    {post.branch_name} · {post.category} · {formatDate(post.created_at)}
                  </p>
                  <h2 className="truncate text-sm font-black tracking-[-0.02em] text-[#F5F4F1] transition-colors group-hover:text-white">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-0.5 truncate text-xs leading-5 text-[#8A8D91]">
                      {post.description}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-sm text-[#4A4C50] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
