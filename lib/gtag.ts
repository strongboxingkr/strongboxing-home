// GA4 event helpers — G-YG7VZ2S2Y0
// 관리자 세션(localStorage 또는 /admin* 경로)에서는 모든 이벤트가 무시됩니다.

const MEASUREMENT_ID = "G-YG7VZ2S2Y0";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    dataLayer: unknown[];
  }
}

const ADMIN_PATHS = ["/admin", "/admin-login", "/erp", "/hq"];

function isAdminSession(): boolean {
  if (typeof window === "undefined") return true;
  const path = window.location.pathname;
  if (ADMIN_PATHS.some((p) => path === p || path.startsWith(p + "/"))) return true;
  try {
    return localStorage.getItem("strong_admin_auth") === "Y";
  } catch {
    return false;
  }
}

/** 페이지뷰 전송 — GATracker 컴포넌트에서 라우트 변경마다 호출 */
export function trackPageView(url?: string): void {
  if (typeof window === "undefined") return;
  if (isAdminSession()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("config", MEASUREMENT_ID, {
    page_path: url ?? window.location.pathname,
    send_page_view: true,
  });
}

/** 범용 커스텀 이벤트 전송 */
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;
  if (isAdminSession()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

// ── 이벤트별 타입 안전 래퍼 ──────────────────────────────────────

/** 방문예약/상담예약 버튼 클릭 */
export function trackReservationClick(params: {
  branch_name?: string;
  location: string;
}): void {
  trackEvent("reservation_click", params);
}

/** 전화 문의 버튼 클릭 */
export function trackPhoneClick(params: {
  branch_name: string;
  phone: string;
}): void {
  trackEvent("phone_click", params);
}

/** 카카오톡 문의 버튼 클릭 */
export function trackKakaoClick(params: { branch_name: string }): void {
  trackEvent("kakao_click", params);
}

/** 네이버 예약 버튼 클릭 */
export function trackNaverReservationClick(params: {
  branch_name: string;
}): void {
  trackEvent("naver_reservation_click", params);
}

/** 홈페이지 예약 폼 제출 성공 */
export function trackReservationComplete(params: {
  branch_name: string;
}): void {
  trackEvent("reservation_complete", params);
}

/** STRONG CLIP 영상 재생 */
export function trackClipPlay(params: {
  branch_name: string;
  title: string;
}): void {
  trackEvent("clip_play", params);
}
