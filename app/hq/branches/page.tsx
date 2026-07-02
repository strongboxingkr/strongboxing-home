import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function BranchesPage() {
  return (
    <div>
      <PageHeader title="지점 관리" description="지점별 현황을 확인하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
