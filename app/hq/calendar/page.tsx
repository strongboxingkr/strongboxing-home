import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="캘린더" description="일정을 확인하세요." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
