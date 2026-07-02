import HQSidebar from "@/app/components/hq/Sidebar";
import HQHeader from "@/app/components/hq/Header";
import HQMobileSidebar from "@/app/components/hq/MobileSidebar";

export const metadata = {
  title: "STRONGBOXING HQ",
  description: "STRONG BOXING 운영 관리 시스템",
};

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F7F7F8" }}>
      <HQSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="flex md:hidden h-[56px] shrink-0 items-center gap-3 border-b px-4"
          style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
        >
          <HQMobileSidebar />
          <span className="text-[14px] font-black" style={{ color: "#111827" }}>🥊 STRONGBOXING HQ</span>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block shrink-0">
          <HQHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8" style={{ background: "#F7F7F8" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
