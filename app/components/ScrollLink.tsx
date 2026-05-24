"use client";

export default function ScrollLink({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {children}
    </button>
  );
}