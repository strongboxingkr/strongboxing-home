export type ReservationType = "방문 상담" | "일일 체험";

export function consultationSlots(hourly: string[], type: ReservationType) {
  return type === "방문 상담"
    ? hourly.flatMap((time) => [time, time.replace(/:00$/, ":30")])
    : hourly;
}
