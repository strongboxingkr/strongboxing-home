"use client";

import { trackReservationClick } from "@/lib/gtag";

export default function ReservationButton({
  className,
  children,
  location = "header",
  branchName,
  oneDay = false,
}: {
  className?: string;
  children: React.ReactNode;
  location?: string;
  branchName?: string;
  oneDay?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackReservationClick({ branch_name: branchName, location });
        window.location.href = oneDay ? "/reservation?type=one-day" : "/reservation";
      }}
      className={className}
    >
      {children}
    </button>
  );
}