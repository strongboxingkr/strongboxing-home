"use client";

import { useEffect, useRef } from "react";
import { FIRST_BOXING_DESCRIPTION, FIRST_BOXING_TITLE_LINES } from "@/lib/first-boxing-popup";

export default function FirstBoxingPopup({ onClose, onHideToday }: {
  onClose: () => void;
  onHideToday: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="first-boxing-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[380px] overflow-y-auto rounded-[8px] border border-white/30 bg-[#191919] p-0 text-[#f4f0e8] backdrop:bg-black/70 md:max-w-[820px]"
    >
      <div className="relative grid md:grid-cols-[34%_1fr]">
        <div className="px-5 py-4 md:hidden">
          <div className="inline-flex flex-col items-center text-[15px] font-semibold leading-none tracking-[.16em]">
            <span>STRONG</span>
            <span className="mt-1 text-[11px]">— BOXING —</span>
          </div>
        </div>
        <img src="/images/first-boxing-ring.webp" alt="" className="h-24 w-full object-cover grayscale md:absolute md:inset-y-0 md:h-full md:w-[34%]" />
        <button type="button" aria-label="팝업 닫기" onClick={onClose} className="absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-sm bg-[#191919] text-2xl leading-none hover:bg-[#343434]">×</button>
        <div className="px-5 pb-3 pt-5 min-[360px]:px-6 md:col-start-2 md:px-9 md:pb-5 md:pt-8">
          <div className="mb-7 hidden md:inline-flex flex-col items-center text-[15px] font-semibold leading-none tracking-[.16em]">
            <span>STRONG</span>
            <span className="mt-1 text-[11px]">— BOXING —</span>
          </div>
          <h2 id="first-boxing-title" className="break-keep text-[clamp(19px,6.2vw,24px)] font-extrabold leading-tight tracking-[-.055em] md:text-[clamp(29px,4vw,38px)]">
            {FIRST_BOXING_TITLE_LINES[0]}<br />
            {FIRST_BOXING_TITLE_LINES[1]}
          </h2>
          <p className="mt-3 break-keep text-[15px] leading-relaxed md:text-lg">{FIRST_BOXING_DESCRIPTION}</p>
          <div className="mt-4 space-y-1.5 border-t border-white/25 pt-3 text-[13px] leading-relaxed text-[#dedad2] md:mt-6 md:pt-4 md:text-[15px]">
            <p>선수 경력 또는 복싱 지도 자격을 갖춘 코치</p>
            <p className="hidden md:block">프로·아마추어 선수 배출 · 운동기구 · 인바디</p>
          </div>
          <a href="/reservation" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-[#f4f0e8] px-2 py-2 text-center text-[13px] font-extrabold tracking-tight text-[#191919] hover:bg-white md:mt-7 md:text-base">
            가까운 지점에서 복싱 시작해보기 <span aria-hidden="true">→</span>
          </a>
          <button type="button" onClick={onHideToday} className="mx-auto mt-1 block min-h-11 px-3 text-xs text-[#dedad2] underline underline-offset-4 hover:text-white">오늘 하루 보지 않기</button>
        </div>
      </div>
    </dialog>
  );
}
