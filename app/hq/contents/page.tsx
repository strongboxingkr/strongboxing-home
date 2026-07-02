import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function ContentsPage() {
  return (
    <div>
      <PageHeader title="콘텐츠" description="블로그 및 SNS 콘텐츠를 관리하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
