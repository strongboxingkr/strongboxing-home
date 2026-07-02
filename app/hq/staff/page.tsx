import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function StaffPage() {
  return (
    <div>
      <PageHeader title="스태프" description="지점별 스태프를 관리하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
