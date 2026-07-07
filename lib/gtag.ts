// GA4 typed event helpers — Measurement ID: G-YG7VZ2S2Y0
// window.gtag 미존재 시 에러 없이 무시됩니다.

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    dataLayer: unknown[];
  }
}

function gtagEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/** 방문예약/상담예약 버튼 클릭 */
export function trackReservationClick(params: {
  branch_name?: string;
  location: string;
}): void {
  gtagEvent("reservation_click", params);
}

/** 전화 문의 버튼 클릭 */
export function trackPhoneClick(params: {
  branch_name: string;
  phone: string;
}): void {
  gtagEvent("phone_click", params);
}

/** 카카오톡 문의 버튼 클릭 */
export function trackKakaoClick(params: { branch_name: string }): void {
  gtagEvent("kakao_click", params);
}

/** 네이버 예약 버튼 클릭 */
export function trackNaverReservationClick(params: {
  branch_name: string;
}): void {
  gtagEvent("naver_reservation_click", params);
}

/** 홈페이지 예약 폼 제출 성공 */
export function trackReservationComplete(params: {
  branch_name: string;
}): void {
  gtagEvent("reservation_complete", params);
}
