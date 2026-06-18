import AdminGuard from "./AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F5F7FA] text-zinc-900">
        {children}
      </div>
    </AdminGuard>
  );
}