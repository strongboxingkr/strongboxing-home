"use client";

import { useEffect } from "react";
import { trackEvent, trackReservationClick } from "@/lib/gtag";

/**
 * 블로그 글 안의 링크 클릭을 GA4로 구분해서 전송.
 * - blog_link_click: link_type(reservation/branch/related_post/other), placement(본문 CTA/관련 글/하단 CTA 등)
 * - 예약 링크는 기존 reservation_click 이벤트도 함께 전송 (location: blog_post)
 * 글 조회는 ViewTracker 의 blog_post_view 로 따로 집계.
 */
export default function ArticleLinkTracker({ slug, category }: { slug: string; category: string }) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || !a.closest("[data-article-root]")) return;
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      const path = href.replace(/^https?:\/\/(www\.)?strongboxing\.kr/, "");
      const linkType = path.startsWith("/reservation")
        ? "reservation"
        : path.startsWith("/branches/")
          ? "branch"
          : path.startsWith("/blog/")
            ? "related_post"
            : "other";
      const placement = a.closest("[data-placement]")?.getAttribute("data-placement") || "in_content";

      trackEvent("blog_link_click", { post_slug: slug, post_category: category, link_type: linkType, link_url: path, placement });
      if (linkType === "reservation") trackReservationClick({ location: "blog_post" });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [slug, category]);

  return null;
}
