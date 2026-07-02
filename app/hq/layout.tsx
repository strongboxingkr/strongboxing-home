import HQSidebar from "@/app/components/hq/Sidebar";
import HQHeader from "@/app/components/hq/Header";
import HQMobileSidebar from "@/app/components/hq/MobileSidebar";

export const metadata = {
  title: "STRONG OS",
  description: "STRONG BOXING 운영 관리 시스템",
};

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="strong-hq flex h-screen overflow-hidden" style={{ background: "#0F1115" }}>
      <HQSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="flex md:hidden h-[60px] shrink-0 items-center gap-3 border-b px-4"
          style={{ background: "#0F1115", borderColor: "#2A313C" }}
        >
          <HQMobileSidebar />
          <span className="text-[14px] font-black" style={{ color: "#F8FAFC" }}>🥊 STRONG OS</span>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block shrink-0">
          <HQHeader />
        </div>

        <main
          className="flex-1 overflow-y-auto p-5 md:p-8"
          style={{ background: "#0F1115" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
