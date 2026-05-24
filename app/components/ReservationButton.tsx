"use client";

export default function ReservationButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = "/reservation";
      }}
      className={className}
    >
      {children}
    </button>
  );
}