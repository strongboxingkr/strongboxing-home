"use client";

import { useEffect } from "react";

export default function ViewTracker({ postId }: { postId: number }) {
  useEffect(() => {
    fetch("/api/posts/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: postId }),
    }).catch(() => {});
  }, [postId]);

  return null;
}
