"use client";

import { useState } from "react";

const statuses = ["예약접수", "확인완료", "상담완료", "등록완료", "노쇼", "취소"];

export default function ConsultationsClient({ rows }: { rows: any[] }) {
  const [items, setItems] = useState(rows);
  const [selected, setSelected] = useState<any | null>(null);
  const [status, setStatus] = useState("");

  async function saveStatus() {
    if (!selected) return;

    const res = await fetch("/api/consultations-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selected.id,
        status,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("상태 변경 실패");
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === selected.id ? { ...item, status } : item
      )
    );

    setSelected({ ...selected, status });
    alert("상태 변경 완료!");
  }

  function openDetail(item: any) {
    setSelected(item);
    setStatus(item.status || "예약접수");
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text || "");
    alert("복사 완료!");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-24 text-zinc-900">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-500">
          ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.35em] text-[#38BDF8]">
          CONSULTATIONS
        </p>

        <h1 className="mb-10 text-5xl font-black tracking-[-0.05em]">
          상담 예약 관리
        </h1>

        {items.length === 0 ? (
          <div className="rounded-[30px] border border-zinc-200 bg-white p-10 text-center">
            예약 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[30px] border border-zinc-200">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-white">
                <tr className="text-left text-sm text-zinc-500">
                  <th className="px-5 py-4">상태</th>
                  <th className="px-5 py-4">이름</th>
                  <th className="px-5 py-4">전화번호</th>
                  <th className="px-5 py-4">지점</th>
                  <th className="px-5 py-4">예약일</th>
                  <th className="px-5 py-4">시간</th>
                  <th className="px-5 py-4">신청일</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer border-t border-zinc-200 bg-white transition hover:bg-white"
                    onClick={() => openDetail(item)}
                  >
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status || "예약접수"} />
                    </td>

                    <td className="px-5 py-4 font-black text-zinc-900">
                      {item.name}
                    </td>

                    <td className="px-5 py-4 text-[#FC5230]">
                      {item.phone}
                    </td>

                    <td className="px-5 py-4">{item.branch || "-"}</td>

                    <td className="px-5 py-4">
                      {item.reservation_date
                        ? new Date(item.reservation_date).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-5 py-4">
                      {item.reservation_time || "-"}
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[34px] border border-zinc-200 bg-white p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm font-black text-[#38BDF8]">
                    상담 예약 상세
                  </p>

                  <h2 className="text-4xl font-black">{selected.name}</h2>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-zinc-200 px-4 py-2 font-black"
                >
                  닫기
                </button>
              </div>

              <div className="space-y-4">
                <Info label="전화번호" value={selected.phone} onCopy={copy} />
                <Info label="지점" value={selected.branch} />
                <Info
                  label="예약일"
                  value={
                    selected.reservation_date
                      ? new Date(selected.reservation_date).toLocaleDateString()
                      : "-"
                  }
                />
                <Info label="예약시간" value={selected.reservation_time || "-"} />
                <Info label="운동목적" value={selected.goal || "-"} />
                <Info label="문의사항" value={selected.message || "-"} />
              </div>

              <div className="mt-7 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <label className="mb-3 block text-sm font-black text-zinc-900">
                  상태 변경
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mb-4 w-full rounded-2xl border border-zinc-200 bg-black p-4"
                >
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <button
                  onClick={saveStatus}
                  className="w-full rounded-full bg-[#38BDF8] px-6 py-4 font-black text-black"
                >
                  상태 저장
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${selected.phone}`}
                  className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black"
                >
                  전화 걸기
                </a>

                <button
                  onClick={() =>
                    copy(
                      `${selected.name}\n${selected.phone}\n${selected.branch}\n${selected.reservation_date || ""} ${selected.reservation_time || ""}`
                    )
                  }
                  className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-black"
                >
                  예약정보 복사
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "등록완료"
      ? "bg-green-500/20 text-green-400"
      : status === "상담완료"
      ? "bg-blue-500/20 text-blue-400"
      : status === "확인완료"
      ? "bg-cyan-500/20 text-cyan-300"
      : status === "노쇼" || status === "취소"
      ? "bg-red-500/20 text-red-400"
      : "bg-yellow-500/20 text-yellow-300";

  return (
    <span className={`rounded-full px-4 py-2 text-sm font-black ${style}`}>
      {status}
    </span>
  );
}

function Info({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy?: (text: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-[#38BDF8]">{label}</p>

        {onCopy && (
          <button
            onClick={() => onCopy(value)}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black"
          >
            복사
          </button>
        )}
      </div>

      <p className="whitespace-pre-wrap break-words text-zinc-300">
        {value || "-"}
      </p>
    </div>
  );
}