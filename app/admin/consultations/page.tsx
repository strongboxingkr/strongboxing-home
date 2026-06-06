export const dynamic = "force-dynamic";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/lib/db";

async function updateStatus(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const status = formData.get("status");

  await db.query(
    `
    UPDATE consultations
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  revalidatePath("/admin/consultations");
}

export default async function ConsultationsPage() {
  noStore();
  
  let rows: any[] = [];

  try {
    const [result]: any = await db.query(`
      SELECT *
      FROM consultations
      ORDER BY created_at DESC
    `);

    rows = result;
  } catch (error) {
    rows = [];
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인으로
        </a>

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
          <div className="overflow-x-auto rounded-[30px] border border-white/10">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead className="bg-[#171719]">
                <tr className="text-left">
                  <th className="px-6 py-5">상태</th>
                  <th className="px-6 py-5">이름</th>
                  <th className="px-6 py-5">전화번호</th>
                  <th className="px-6 py-5">지점</th>
                  <th className="px-6 py-5">예약날짜</th>
                  <th className="px-6 py-5">예약시간</th>
                  <th className="px-6 py-5">운동목적</th>
                  <th className="px-6 py-5">문의사항</th>
                  <th className="px-6 py-5">신청일</th>
                  <th className="px-6 py-5">관리</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item: any) => {
                  const nextStatus =
                    item.status === "상담완료" ? "미처리" : "상담완료";

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-white/10 bg-[#101010]"
                    >
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-black ${
                            item.status === "상담완료"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {item.status || "미처리"}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-bold">{item.name}</td>

                      <td className="px-6 py-5">
                        <a
                          href={`tel:${item.phone}`}
                          className="text-[#FC5230]"
                        >
                          {item.phone}
                        </a>
                      </td>

                      <td className="px-6 py-5">{item.branch}</td>

                      <td className="px-6 py-5">
                        {item.reservation_date
                          ? new Date(item.reservation_date).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-5">
                        {item.reservation_time || "-"}
                      </td>

                      <td className="px-6 py-5">{item.goal || "-"}</td>

                      <td className="max-w-[280px] px-6 py-5 text-zinc-300">
                        {item.message || "-"}
                      </td>

                      <td className="px-6 py-5 text-zinc-400">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-5">
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={item.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={nextStatus}
                          />

                          <button className="rounded-full bg-[#FC5230] px-5 py-2 text-sm font-black">
                            {nextStatus}로 변경
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}