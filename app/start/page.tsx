import type { Metadata } from "next";
import StartLandingClient from "./StartLandingClient";

export const metadata: Metadata = {
  title: { absolute: "스트롱복싱 | 복싱 무료 체험 신청" },
  description:
    "복싱 처음이어도 괜찮습니다. 스트롱복싱 초보자 맞춤 수업 · 선수 출신 지도진 · 서울 5개 지점. 방문 상담 문의하기.",
  robots: { index: false, follow: false },
};

export default function StartPage() {
  return <StartLandingClient />;
}
