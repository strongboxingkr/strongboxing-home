import HQHeader from "@/app/components/hq/Header";
import HQSidebar from "@/app/components/hq/Sidebar";
import HQMobileSidebar from "@/app/components/hq/MobileSidebar";

export const metadata = {
  title: "STRONG HQ",
  description: "STRONG BOXING 운영 시스템",
};

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0F1115" }}>
      <HQSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header: mobile sidebar + actual header */}
        <div className="flex items-center gap-2 px-4 md:px-0" style={{ background: "#0F1115" }}>
          <div className="md:hidden flex items-center py-3">
            <HQMobileSidebar />
          </div>
          <div className="flex-1">
            <HQHeader />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-7" style={{ background: "#0F1115" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
