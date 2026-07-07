"use client";

import { trackReservationClick } from "@/lib/gtag";

export default function ReservationButton({
  className,
  children,
  location = "header",
  branchName,
}: {
  className?: string;
  children: React.ReactNode;
  location?: string;
  branchName?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackReservationClick({ branch_name: branchName, location });
        window.location.href = "/reservation";
      }}
      className={className}
    >
      {children}
    </button>
  );
}