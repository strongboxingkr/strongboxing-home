import type { Metadata } from "next";
import ConsultationForm from "../components/ConsultationForm";

export const metadata: Metadata = {
  title: "방문 예약",
  description: "스트롱복싱 방문 상담 또는 일일 체험을 예약하세요.",
  robots: { index: true, follow: true },
};

export default function ReservationPage() {
  return (
    <main className="min-h-screen bg-[#0E0E10] pt-20 text-white">
      <ConsultationForm />
    </main>
  );
}
