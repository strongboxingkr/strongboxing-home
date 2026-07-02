import PageHeader from "@/app/components/hq/PageHeader";
import EmptyState from "@/app/components/hq/EmptyState";

export default function ConsultationPage() {
  return (
    <div>
      <PageHeader title="상담 예약" description="방문 상담 예약 목록입니다." />
      <EmptyState message="준비 중입니다." />
    </div>
  );
}
