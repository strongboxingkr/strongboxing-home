import type { Metadata } from "next";
import Link from "next/link";
import RenewalHeader from "../RenewalHeader";
import ConsultationForm from "@/app/components/ConsultationForm";

export const metadata: Metadata = {
  title: "원데이 클래스 예약 | 스트롱복싱",
  description: "스트롱복싱 원데이 클래스 및 방문 상담을 신청하세요.",
};

export default function RenewalReservationPage() {
  return (
    <div className="min-h-screen bg-[#F9F8F5]">
      <RenewalHeader />

      {/* 뒤로가기 */}
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-2">
        <Link
          href="/renewal"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B6B72] hover:text-[#0E0E10] transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          홈으로 돌아가기
        </Link>
      </div>

      <ConsultationForm theme="light" />
    </div>
  );
}
