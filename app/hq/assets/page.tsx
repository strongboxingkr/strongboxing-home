import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function AssetsPage() {
  return (
    <div>
      <PageHeader title="자산" description="자산 목록을 관리하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
