import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="설정" description="시스템 설정을 관리하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
