import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function FinancePage() {
  return (
    <div>
      <PageHeader title="재무" description="재무 현황을 확인하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
