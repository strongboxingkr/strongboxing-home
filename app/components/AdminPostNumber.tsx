"use client";

import { useEffect, useState } from "react";

export default function AdminPostNumber({ id }: { id: number }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("strong_admin_auth") === "Y");
  }, []);

  if (!isAdmin) return null;

  return (
    <span className="ml-auto shrink-0 rounded border border-white/20 bg-white/5 px-2 py-1 text-[11px] font-black tracking-widest text-white/40">
      #{String(id).padStart(3, "0")}
    </span>
  );
}
