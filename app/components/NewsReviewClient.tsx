"use client";

import { useState, useEffect, useRef } from "react";

type Category = "전체" | "소식" | "후기";

function inferCategory(post: any): "소식" | "후기" {
  const text = ((post.title ?? "") + " " + (post.description ?? "")).toLowerCase();
  if (text.includes("후기") || text.includes("리뷰") || text.includes("경험") || text.includes("다녀") || text.includes("등록")) {
    return "후기";
  }
  return "소식";
}

function isNew(dateStr: string): boolean {
  if (!dateStr) return false;
  const diffDays = (Date.now() - new Date(dateStr).getTime()) / 86400000;
  return diffDays <= 14;
}

function getThumb(content: string): string | null {
  const s = String(content || "");
  const html = s.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (html?.[1]) return html[1];
  const md = s.match(/!\[.*?\]\((.*?)\)/);
  return md?.[1] || null;
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function PostCard({ post, index }: { post: any; index: number }) {
  const thumb = getThumb(post.content);
  const category = inferCategory(post);
  const fresh = isNew(post.created_at);
  const date = post.created_at
    ? new Date(post.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
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
          el.style.boxShadow = "0 12px 40px rgba(208,30,46,0.12)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0)";
          el.style.borderColor = "rgba(255,255,255,0.07)";
          el.style.boxShadow = "none";
        }}
      >
        {/* 썸네일 */}
        <div className="relative shrink-0 overflow-hidden" style={{ height: 200, borderRadius: "20px 20px 0 0" }}>
          {thumb ? (
            <img
              src={thumb}
              alt={post.title}
              className="h-full w-full object-cover object-[center_25%]"
              style={{ transition: "transform 0.5s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center" style={{ background: "#141416" }}>
              <span style={{ fontSize: 48, opacity: 0.18 }}>🥊</span>
            </div>
          )}
          {/* 그라데이션 오버레이 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(28,28,31,0.7) 0%, transparent 50%)" }}
          />
          {/* 배지들 */}
          <div className="absolute left-4 top-4 flex gap-2">
            {fresh && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                style={{ background: "#D01E2E", letterSpacing: "0.04em" }}
              >
                NEW
              </span>
            )}
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
              style={{
                background: "rgba(0,0,0,0.55)",
                color: "#E5E7EB",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {category}
            </span>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex flex-1 flex-col p-6">
          {/* 지점 + 날짜 */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span
              className="rounded-[8px] px-2.5 py-1 text-[11px] font-bold"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8A8D91" }}
            >
              {post.branch_name}
            </span>
            <span className="text-[11px]" style={{ color: "#3A3A3E" }}>{date}</span>
          </div>

          {/* 제목 */}
          <h3
            className="mb-2 line-clamp-2 font-black leading-snug"
            style={{
              fontSize: 17,
              letterSpacing: "-0.03em",
              color: "#F5F4F1",
              transition: "color 0.2s ease",
            }}
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
          </h3>

          {/* 설명 */}
          <p className="line-clamp-2 flex-1 text-[13px] leading-6" style={{ color: "#5A5C61" }}>
            {post.description}
          </p>

          {/* 화살표 CTA */}
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-[12px] font-bold" style={{ color: "#5A5C61" }}>자세히 보기</span>
            <span
              className="text-[12px] font-bold"
              style={{
                color: "#D01E2E",
                display: "inline-block",
                transition: "transform 0.2s ease",
              }}
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

export default function NewsReviewClient({ posts }: { posts: any[] }) {
  const [tab, setTab] = useState<Category>("전체");
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);

  const filtered = tab === "전체" ? posts : posts.filter(p => inferCategory(p) === tab);

  const TABS: Category[] = ["전체", "소식", "후기"];

  return (
    <>
      {/* 헤더 + 탭 */}
      <div
        ref={headerRef}
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
        className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p className="mb-3 text-xs font-black tracking-[0.3em]" style={{ color: "#5A5C61" }}>
            NEWS & REVIEW
          </p>
          <h2 className="font-black leading-[0.88]" style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}>
            지점별 소식과 후기.
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* 카테고리 탭 */}
          <div
            className="flex overflow-hidden rounded-xl"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#141416" }}
          >
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 text-[13px] font-bold transition-all duration-200"
                style={{
                  background: tab === t ? "#D01E2E" : "transparent",
                  color: tab === t ? "#FFF" : "#5A5C61",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <a
            href="/blog"
            className="text-[13px] font-bold transition-opacity hover:opacity-60"
            style={{ color: "#5A5C61" }}
          >
            전체 글 →
          </a>
        </div>
      </div>

      {/* 카드 그리드 */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {filtered.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-20 gap-3"
          style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", background: "#1C1C1F" }}
        >
          <p className="text-3xl" style={{ opacity: 0.3 }}>🥊</p>
          <p className="text-[13px]" style={{ color: "#5A5C61" }}>해당 카테고리 글이 없습니다.</p>
        </div>
      )}

      {/* CTA 버튼 */}
      <div className="mt-12 text-center">
        <a
          href="/blog"
          className="group inline-flex items-center gap-3 rounded-[14px] px-10 py-4 font-black text-white transition-all duration-200"
          style={{ background: "#D01E2E", fontSize: 15 }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#B71C2B"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#D01E2E"; }}
        >
          더 많은 소식&후기 보기
          <span
            className="inline-block transition-transform duration-200 group-hover:translate-x-1.5"
          >
            →
          </span>
        </a>
      </div>
    </>
  );
}
