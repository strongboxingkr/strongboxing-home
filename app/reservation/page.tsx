import type { Metadata } from "next";
import ReservationBackLink from "../components/ReservationBackLink";
import ConsultationForm from "../components/ConsultationForm";

export const metadata: Metadata = {
  title: "방문 예약",
  description: "스트롱복싱 방문 상담 또는 원데이 클래스를 예약하세요.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://strongboxing.kr/reservation" },
};

export default async function ReservationPage({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const { type } = await searchParams;
  return (
    <main className="min-h-screen bg-[#0E0E10] pt-20 text-white lg:pt-0">
      <ConsultationForm suggestNearest compactDesktop backLink={<ReservationBackLink />} initialOneDay={type === "one-day"} />
    </main>
  );
}
