"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

export default function ViewTracker({ postId, slug, category }: { postId: number; slug?: string; category?: string }) {
  useEffect(() => {
    fetch("/api/posts/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: postId }),
    }).catch(() => {});
    // GA4: 글 조회 (예약 링크 클릭 blog_link_click 과 구분)
    if (slug) trackEvent("blog_post_view", { post_slug: slug, post_category: category });
  }, [postId, slug, category]);

  return null;
}
