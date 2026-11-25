"use client";

import { ArrowLeft } from "lucide-react";

export default function ReservationBackLink() {
  return (
    <a
      href="/"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !document.referrer || window.history.length < 2) return;
        const previous = new URL(document.referrer);
        if (previous.origin !== window.location.origin || previous.pathname === window.location.pathname) return;
        event.preventDefault();
        window.history.back();
      }}
      className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#B5B5BC] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <ArrowLeft size={17} aria-hidden="true" />
      뒤로가기
    </a>
  );
}
