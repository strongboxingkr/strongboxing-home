"use client";

import { useState, useEffect, useRef } from "react";
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
  const html = str.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (html?.[1]) return html[1];
  const md = str.match(/!\[.*?\]\((.*?)\)/);
  return md?.[1] || null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

function isNew(dateStr: string) {
  return (Date.now() - new Date(dateStr).getTime()) / 86400000 <= 14;
}

const BC: Record<string, string> = {
  개봉점: "#3B82F6", 신정점: "#10B981", 목동점: "#8B5CF6", 철산점: "#EF3B2D", 영등포점: "#F59E0B",
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function CardItem({ post, index }: { post: Post; index: number }) {
  const image = getFirstImage(post.content);
  const fresh = isNew(post.created_at);
  const branchColor = BC[post.branch_name] ?? "#8A8D91";
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${Math.min(index, 3) * 0.08}s, transform 0.5s ease ${Math.min(index, 3) * 0.08}s`,
      }}
    >
      <a
        href={`/blog/${post.slug}`}
        className="group flex flex-col overflow-hidden"
        style={{
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "#1C1C1F",
          transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-4px)";
          el.style.borderColor = "#D01E2E";
          el.style.boxShadow = "0 16px 48px rgba(208,30,46,0.13)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0)";
          el.style.borderColor = "rgba(255,255,255,0.07)";
          el.style.boxShadow = "none";
        }}
      >
        {/* 썸네일 — 16:9 */}
        <div className="relative w-full overflow-hidden" style={{ borderRadius: "20px 20px 0 0", paddingTop: "56.25%" }}>
          <div className="absolute inset-0">
            {image ? (
              <img
                src={image}
                alt={post.title}
                className="h-full w-full object-cover object-[center_25%]"
                style={{ transition: "transform 0.5s ease" }}
                ref={el => {
                  if (!el) return;
                  const card = el.closest("a");
                  if (!card) return;
                  const enter = () => { el.style.transform = "scale(1.05)"; };
                  const leave = () => { el.style.transform = "scale(1)"; };
                  card.addEventListener("mouseenter", enter);
                  card.addEventListener("mouseleave", leave);
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" style={{ background: "#141416" }}>
                <span style={{ fontSize: 52, opacity: 0.15 }}>🥊</span>
              </div>
            )}
            {/* 하단 그라데이션 */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(28,28,31,0.65) 0%, transparent 55%)" }}
            />
            {/* 배지 */}
            <div className="absolute left-4 top-4 flex gap-2">
              {fresh && (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white" style={{ background: "#D01E2E" }}>
                  NEW
                </span>
              )}
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                style={{ background: "rgba(0,0,0,0.55)", color: "#E5E7EB", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {post.category || "소식"}
              </span>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex flex-1 flex-col p-6">
          {/* 지점 + 날짜 */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className="rounded-[8px] px-2.5 py-0.5 text-[11px] font-bold"
              style={{ background: `${branchColor}18`, color: branchColor }}
            >
              {post.branch_name}
            </span>
            <span className="text-[11px]" style={{ color: "#3A3A3E" }}>{formatDate(post.created_at)}</span>
          </div>

          {/* 제목 */}
          <h2
            className="mb-2 line-clamp-2 font-black leading-snug"
            style={{ fontSize: 17, letterSpacing: "-0.035em", color: "#F5F4F1", transition: "color 0.2s ease" }}
            ref={el => {
              if (!el) return;
              const card = el.closest("a");
              if (!card) return;
              const enter = () => { el.style.color = "#D01E2E"; };
              const leave = () => { el.style.color = "#F5F4F1"; };
              card.addEventListener("mouseenter", enter);
              card.addEventListener("mouseleave", leave);
            }}
          >
            {post.title}
          </h2>

          {/* 설명 */}
          <p className="line-clamp-2 flex-1 text-[13px] leading-[1.7]" style={{ color: "#5A5C61" }}>
            {post.description}
          </p>

          {/* 화살표 */}
          <div className="mt-5 flex items-center gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: "#5A5C61" }}>자세히 보기</span>
            <span
              className="text-[12px] font-bold"
              style={{ color: "#D01E2E", display: "inline-block", transition: "transform 0.2s ease" }}
              ref={el => {
                if (!el) return;
                const card = el.closest("a");
                if (!card) return;
                const enter = () => { el.style.transform = "translateX(5px)"; };
                const leave = () => { el.style.transform = "translateX(0)"; };
                card.addEventListener("mouseenter", enter);
                card.addEventListener("mouseleave", leave);
              }}
            >
              →
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}

function ListItem({ post, index }: { post: Post; index: number }) {
  const thumb = getFirstImage(post.content);
  const fresh = isNew(post.created_at);
  const branchColor = BC[post.branch_name] ?? "#8A8D91";
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s ease ${Math.min(index, 5) * 0.05}s, transform 0.4s ease ${Math.min(index, 5) * 0.05}s`,
      }}
    >
      <a
        href={`/blog/${post.slug}`}
        className="group flex items-center gap-4 px-5 py-4"
        style={{ transition: "background 0.15s ease" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        {/* 썸네일 */}
        <div className="relative h-[72px] w-[100px] shrink-0 overflow-hidden rounded-[12px]" style={{ background: "#141416" }}>
          {thumb ? (
            <img src={thumb} alt="" className="h-full w-full object-cover" style={{ transition: "transform 0.4s ease" }}
              ref={el => {
                if (!el) return;
                const card = el.closest("a");
                if (!card) return;
                card.addEventListener("mouseenter", () => { el.style.transform = "scale(1.08)"; });
                card.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl" style={{ opacity: 0.15 }}>🥊</div>
          )}
          {fresh && (
            <span className="absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-black text-white" style={{ background: "#D01E2E" }}>
              NEW
            </span>
          )}
        </div>

        {/* 텍스트 */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-[6px] px-2 py-0.5 text-[10px] font-bold" style={{ background: `${branchColor}18`, color: branchColor }}>
              {post.branch_name}
            </span>
            <span className="text-[10px]" style={{ color: "#3A3A3E" }}>{formatDate(post.created_at)}</span>
          </div>
          <h2
            className="truncate font-black leading-snug"
            style={{ fontSize: 14, letterSpacing: "-0.02em", color: "#F5F4F1", transition: "color 0.2s ease" }}
            ref={el => {
              if (!el) return;
              const card = el.closest("a");
              if (!card) return;
              card.addEventListener("mouseenter", () => { el.style.color = "#D01E2E"; });
              card.addEventListener("mouseleave", () => { el.style.color = "#F5F4F1"; });
            }}
          >
            {post.title}
          </h2>
          {post.description && (
            <p className="mt-0.5 truncate text-xs leading-5" style={{ color: "#5A5C61" }}>{post.description}</p>
          )}
        </div>

        <span
          className="shrink-0 text-sm font-bold"
          style={{ color: "#D01E2E", transition: "transform 0.2s ease" }}
          ref={el => {
            if (!el) return;
            const card = el.closest("a");
            if (!card) return;
            card.addEventListener("mouseenter", () => { el.style.transform = "translateX(5px)"; });
            card.addEventListener("mouseleave", () => { el.style.transform = "translateX(0)"; });
          }}
        >
          →
        </span>
      </a>
    </div>
  );
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
      {/* 뷰 전환 */}
      <div className="mb-8 flex justify-end">
        <div className="flex gap-1 overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#141416" }}>
          <button
            onClick={() => switchMode("card")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all duration-200"
            style={{ background: viewMode === "card" ? "#D01E2E" : "transparent", color: viewMode === "card" ? "#fff" : "#5A5C61" }}
          >
            <LayoutGrid size={12} /> 카드형
          </button>
          <button
            onClick={() => switchMode("list")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all duration-200"
            style={{ background: viewMode === "list" ? "#D01E2E" : "transparent", color: viewMode === "list" ? "#fff" : "#5A5C61" }}
          >
            <List size={12} /> 리스트형
          </button>
        </div>
      </div>

      {/* 카드형 */}
      {viewMode === "card" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => <CardItem key={post.id} post={post} index={i} />)}
        </div>
      )}

      {/* 리스트형 */}
      {viewMode === "list" && (
        <div className="overflow-hidden rounded-[18px]" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#1C1C1F" }}>
          {posts.map((post, i) => (
            <div key={post.id} style={{ borderBottom: i < posts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <ListItem post={post} index={i} />
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {posts.length > 0 && (
        <div className="mt-14 text-center">
          <a
            href="/blog"
            className="group inline-flex items-center gap-3 rounded-[14px] px-10 py-4 font-black text-white"
            style={{ background: "#D01E2E", fontSize: 15, transition: "background 0.2s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#B71C2B"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#D01E2E"; }}
          >
            더 많은 소식 & 후기 보기
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
          </a>
        </div>
      )}
    </>
  );
}
