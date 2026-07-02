import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="분석" description="데이터 분석 현황입니다." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
