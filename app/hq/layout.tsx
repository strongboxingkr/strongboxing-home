import HQHeader from "@/app/components/hq/Header";
import HQSidebar from "@/app/components/hq/Sidebar";
import HQMobileSidebar from "@/app/components/hq/MobileSidebar";

export const metadata = {
  title: "STRONG HQ",
  description: "STRONG BOXING 운영 관리 시스템",
};

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0F1115" }}>
      <HQSidebar />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 h-[64px] border-b"
          style={{ background: "#0F1115", borderColor: "#2A313C" }}
        >
          <HQMobileSidebar />
          <span className="text-[14px] font-black" style={{ color: "#F8FAFC" }}>🥊 STRONG HQ</span>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block">
          <HQHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-8" style={{ background: "#0F1115" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
