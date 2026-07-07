"use client";

import {
  trackPhoneClick,
  trackNaverReservationClick,
  trackKakaoClick,
} from "@/lib/gtag";

interface BranchCTAButtonsProps {
  branchName: string;
  phone: string;
  booking?: string;
  kakaoChat?: string;
  naverMap?: string;
}

export default function BranchCTAButtons({
  branchName,
  phone,
  booking,
  kakaoChat,
  naverMap,
}: BranchCTAButtonsProps) {
  const telHref = `tel:${phone.replaceAll("-", "")}`;

  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <a
        href={telHref}
        onClick={() => trackPhoneClick({ branch_name: branchName, phone })}
        className="inline-flex items-center gap-2 rounded-[10px] bg-[#D01E2E] px-7 py-3.5 text-sm font-black text-white transition hover:bg-[#B71C2B]"
      >
        전화 문의
      </a>

      {booking && (
        <a
          href={booking}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackNaverReservationClick({ branch_name: branchName })}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-white/6 px-7 py-3.5 text-sm font-black text-[#F5F4F1] transition hover:border-white/30 hover:bg-white/10"
        >
          네이버 예약
        </a>
      )}

      {kakaoChat && (
        <a
          href={kakaoChat}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackKakaoClick({ branch_name: branchName })}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-white/6 px-7 py-3.5 text-sm font-black transition hover:border-white/30 hover:bg-white/10"
          style={{ color: "#F5F4F1" }}
        >
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "#FEE500" }}
          />
          카카오 문의
        </a>
      )}

      {naverMap && (
        <a
          href={naverMap}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#4A4C50]/40 bg-white/6 px-7 py-3.5 text-sm font-black text-[#8A8D91] transition hover:border-white/30 hover:text-white"
        >
          지도 보기
        </a>
      )}
    </div>
  );
}
