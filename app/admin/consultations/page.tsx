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
          <div className="grid gap-5 md:grid-cols-2">
            {rows.map((item: any) => {
          
              return (
                <div
                  key={item.id}
                  className="rounded-[30px] border border-white/10 bg-[#171719] p-6"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        item.status === "상담완료"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {item.status || "미처리"}
                    </span>

                    <span className="text-sm text-zinc-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black">{item.name}</h2>

                  <a
                    href={`tel:${item.phone}`}
                    className="mt-2 inline-block text-lg font-black text-[#FC5230]"
                  >
                    {item.phone}
                  </a>

                  <div className="mt-6 grid gap-3 text-sm text-zinc-300">
                    <p>
                      <span className="font-black text-white">지점</span> ·{" "}
                      {item.branch || "-"}
                    </p>

                    <p>
                      <span className="font-black text-white">예약일</span> ·{" "}
                      {item.reservation_date
                        ? new Date(item.reservation_date).toLocaleDateString()
                        : "-"}
                    </p>

                    <p>
                      <span className="font-black text-white">예약시간</span> ·{" "}
                      {item.reservation_time || "-"}
                    </p>

                    <p>
                      <span className="font-black text-white">운동목적</span> ·{" "}
                      {item.goal || "-"}
                    </p>

                    {item.message && (
                      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                        <p className="mb-2 text-sm font-black text-white">문의사항</p>
                        <p className="whitespace-pre-wrap leading-7 text-zinc-300">
                          {item.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <form action={updateStatus} className="mt-6 space-y-3">
                    <input type="hidden" name="id" value={item.id} />

                    <select
                      name="status"
                      defaultValue={item.status || "예약접수"}
                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
                    >
                      <option>예약접수</option>
                      <option>확인완료</option>
                      <option>상담완료</option>
                      <option>등록완료</option>
                      <option>노쇼</option>
                      <option>취소</option>
                    </select>

                    <button className="w-full rounded-full bg-[#FC5230] px-5 py-4 text-sm font-black">
                      상태 저장
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}