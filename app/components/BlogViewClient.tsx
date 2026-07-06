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
  is_best?: number | boolean;
}

function getFirstMedia(content: string): { url: string; type: "image" | "video" } | null {
  const str = String(content || "");
  const htmlImg = str.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (htmlImg?.[1]) return { url: htmlImg[1], type: "image" };
  const mdImg = str.match(/!\[.*?\]\((.*?)\)/);
  if (mdImg?.[1]) return { url: mdImg[1], type: "image" };
  // video: try <video src=...> first, then any /uploads/ video file URL
  const htmlVideo = str.match(/<video[^>]*src=["']([^"']+)["']/i)
    || str.match(/src=["'](\/uploads\/[^"']+\.(?:mp4|webm|ogg|mov))/i);
  if (htmlVideo?.[1]) return { url: htmlVideo[1], type: "video" };
  return null;
}

function VideoThumb({ src, className }: { src: string; className: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    const onMeta = () => { video.currentTime = 0.001; };
    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 480;
        canvas.height = video.videoHeight || 270;
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setDataUrl(canvas.toDataURL("image/jpeg", 0.85));
      } catch { setFailed(true); }
    };
    const onError = () => setFailed(true);

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.src = src;

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.src = "";
    };
  }, [src]);

  if (dataUrl) {
    return <img src={dataUrl} alt="" className={className} style={{ transition: "transform 0.5s ease" }} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5" style={{ background: "#141416" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: failed ? 0.12 : 0.3 }}>
        <circle cx="12" cy="12" r="10" stroke="#F5F4F1" strokeWidth="1.5" />
        <path d="M10 8l6 4-6 4V8z" fill="#F5F4F1" />
      </svg>
      {!failed && <span className="text-[10px]" style={{ color: "#3A3A3E" }}>동영상</span>}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

function isNew(dateStr: string) {
  return (Date.now() - new Date(dateStr).getTime()) / 86400000 <= 7;
}

function readingTime(content: string) {
  const text = String(content || "").replace(/<[^>]*>/g, "").replace(/!\[.*?\]\(.*?\)/g, "");
  const minutes = Math.max(1, Math.ceil(text.length / 300));
  return `${minutes}분 읽기`;
}

const BC: Record<string, string> = {
  개봉점: "#3B82F6", 신정점: "#10B981", 목동점: "#8B5CF6", 철산점: "#F59E0B", 영등포점: "#D01E2E",
};

const CAT: Record<string, { bg: string; color: string }> = {
  소식:     { bg: "rgba(138,141,145,0.14)", color: "#8A8D91" },
  이벤트:   { bg: "rgba(208,30,46,0.14)",   color: "#D01E2E" },
  공지:     { bg: "rgba(245,244,241,0.08)", color: "#C9C9C9" },
  후기:     { bg: "rgba(16,185,129,0.13)",  color: "#10B981" },
  운동팁:   { bg: "rgba(139,92,246,0.13)",  color: "#8B5CF6" },
  키즈:     { bg: "rgba(251,191,36,0.13)",  color: "#FBB824" },
  여성복싱: { bg: "rgba(236,72,153,0.13)",  color: "#EC4899" },
};

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: "inline", verticalAlign: "middle", marginTop: -1 }}>
      <rect x="1" y="2" width="10" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.15" />
      <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M1 5h10" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: "inline", verticalAlign: "middle", marginTop: -1 }}>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.15" />
      <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const media = getFirstMedia(post.content);
  const fresh = isNew(post.created_at);
  const best = !!post.is_best;
  const branchColor = BC[post.branch_name] ?? "#8A8D91";
  const catStyle = CAT[post.category] ?? { bg: "rgba(138,141,145,0.14)", color: "#8A8D91" };
  const mins = readingTime(post.content);
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
            {media ? (
              media.type === "video" ? (
                <VideoThumb src={media.url} className="h-full w-full object-cover object-[center_25%]" />
              ) : (
                <img
                  src={media.url}
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
              )
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
            {/* 배지 그룹 */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
              {fresh && (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white" style={{ background: "#D01E2E" }}>
                  NEW
                </span>
              )}
              {best && (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white" style={{ background: "linear-gradient(135deg, #FF6B35 0%, #D01E2E 100%)" }}>
                  🔥 BEST
                </span>
              )}
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                style={{ background: catStyle.bg, color: catStyle.color, backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}
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
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#3A3A3E" }}>
              <CalendarIcon />
              {formatDate(post.created_at)}
            </span>
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

          {/* 하단 — 읽는 시간 + 화살표 */}
          <div className="mt-5 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#3A3A3E" }}>
              <ClockIcon />
              {mins}
            </span>
            <div className="flex items-center gap-1.5">
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
        </div>
      </a>
    </div>
  );
}

function ListItem({ post, index }: { post: Post; index: number }) {
  const media = getFirstMedia(post.content);
  const thumb = media?.url ?? null;
  const isVideo = media?.type === "video";
  const fresh = isNew(post.created_at);
  const best = !!post.is_best;
  const branchColor = BC[post.branch_name] ?? "#8A8D91";
  const catStyle = CAT[post.category] ?? { bg: "rgba(138,141,145,0.14)", color: "#8A8D91" };
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
            isVideo ? (
              <VideoThumb src={thumb} className="h-full w-full object-cover object-[center_25%]" />
            ) : (
              <img src={thumb} alt="" className="h-full w-full object-cover object-[center_25%]" style={{ transition: "transform 0.4s ease" }}
                ref={el => {
                  if (!el) return;
                  const card = el.closest("a");
                  if (!card) return;
                  card.addEventListener("mouseenter", () => { el.style.transform = "scale(1.08)"; });
                  card.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
                }}
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl" style={{ opacity: 0.15 }}>🥊</div>
          )}
          {/* NEW + BEST 배지 */}
          <div className="absolute left-1.5 top-1.5 flex flex-col gap-1">
            {fresh && (
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-black text-white" style={{ background: "#D01E2E" }}>
                NEW
              </span>
            )}
            {best && (
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-black text-white" style={{ background: "linear-gradient(135deg, #FF6B35, #D01E2E)" }}>
                BEST
              </span>
            )}
          </div>
        </div>

        {/* 텍스트 */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-[6px] px-2 py-0.5 text-[10px] font-bold" style={{ background: `${branchColor}18`, color: branchColor }}>
              {post.branch_name}
            </span>
            <span className="rounded-[6px] px-2 py-0.5 text-[10px] font-bold" style={{ background: catStyle.bg, color: catStyle.color }}>
              {post.category || "소식"}
            </span>
            <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "#3A3A3E" }}>
              <CalendarIcon />
              {formatDate(post.created_at)}
            </span>
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
