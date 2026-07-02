import HQHeader from "@/app/components/hq/Header";
import HQSidebar from "@/app/components/hq/Sidebar";

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <HQHeader />
      <div className="flex flex-1 overflow-hidden">
        <HQSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
