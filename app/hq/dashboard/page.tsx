import PageHeader from "@/app/components/hq/PageHeader";
import QuickMenu from "@/app/components/hq/QuickMenu";
import DashboardCard from "@/app/components/hq/DashboardCard";
import TodoCard from "@/app/components/hq/TodoCard";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="대시보드" description="스트롱복싱 본사 현황판" />
      <div className="mb-6">
        <QuickMenu />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <DashboardCard title="할 일">
          <TodoCard />
        </DashboardCard>
        <DashboardCard title="공지사항">
          <p className="text-sm text-zinc-400">공지사항이 없습니다.</p>
        </DashboardCard>
      </div>
    </div>
  );
}
