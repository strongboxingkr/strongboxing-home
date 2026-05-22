import { db } from "@/lib/db";

export default async function ConsultationsPage() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM consultation_requests
    ORDER BY created_at DESC
  `);

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            ADMIN
          </p>

          <h1 className="text-5xl font-black tracking-[-0.05em]">
            상담 예약 관리
          </h1>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-[30px] border border-white/10 bg-[#171719] p-10 text-center">
            예약 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[30px] border border-white/10">
            <table className="w-full border-collapse">
              <thead className="bg-[#171719]">
                <tr className="text-left">
                  <th className="px-6 py-5">이름</th>
                  <th className="px-6 py-5">전화번호</th>
                  <th className="px-6 py-5">지점</th>
                  <th className="px-6 py-5">운동목적</th>
                  <th className="px-6 py-5">문의사항</th>
                  <th className="px-6 py-5">신청일</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t border-white/10 bg-[#101010]"
                  >
                    <td className="px-6 py-5 font-bold">
                      {item.name}
                    </td>

                    <td className="px-6 py-5">
                      <a
                        href={`tel:${item.phone}`}
                        className="text-[#FC5230]"
                      >
                        {item.phone}
                      </a>
                    </td>

                    <td className="px-6 py-5">
                      {item.branch}
                    </td>

                    <td className="px-6 py-5">
                      {item.goal || "-"}
                    </td>

                    <td className="max-w-[280px] px-6 py-5 text-zinc-300">
                      {item.message || "-"}
                    </td>

                    <td className="px-6 py-5 text-zinc-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}