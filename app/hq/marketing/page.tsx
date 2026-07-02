import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function MarketingPage() {
  return (
    <div>
      <PageHeader title="마케팅" description="마케팅 현황을 확인하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
