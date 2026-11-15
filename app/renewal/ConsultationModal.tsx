"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ConsultationForm from "@/app/components/ConsultationForm";

export function ConsultationModalButton({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} style={style} onClick={() => setOpen(true)}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="relative w-full max-w-lg overflow-y-auto rounded-t-[24px] sm:rounded-[24px]"
            style={{ background: "#fff", maxHeight: "90vh" }}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid #E8E6DF", background: "#fff" }}
            >
              <h3 className="font-black text-lg" style={{ color: "#0E0E10" }}>
                방문 상담 신청
              </h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 transition-opacity hover:opacity-60">
                <X size={20} style={{ color: "#6B6B72" }} />
              </button>
            </div>
            <div className="p-6">
              <ConsultationForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
