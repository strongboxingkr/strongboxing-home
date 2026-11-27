const attributionKeys = ["branch", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type ReservationAttribution = Partial<Record<(typeof attributionKeys)[number], string>>;

export function reservationAttribution(input: unknown): ReservationAttribution {
  if (!input || typeof input !== "object") return {};
  const record = input as Record<string, unknown>;
  const values: ReservationAttribution = {};
  for (const key of attributionKeys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) values[key] = value.trim().slice(0, 160);
  }
  return values;
}
