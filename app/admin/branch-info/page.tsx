"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  branch_name: "철산점",
  phone: "",
  address: "",
  instagram_url: "",
  naver_booking_url: "",
  naver_map_url: "",
  naver_blog_url: "",
  kakao_map_url: "",
  business_hours: "",
  hashtags: "",
  memo: "",
};

export default function BranchInfoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const res = await fetch("/api/branch-info");
    const data = await res.json();
    if (data.ok) setItems(data.items);
  }

  async function saveItem() {
    const res = await fetch("/api/branch-info", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...form }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("저장 실패");
      return;
    }

    alert(editingId ? "수정 완료" : "저장 완료");
    setEditingId(null);
    setForm(emptyForm);
    loadItems();
  }

  async function deleteItem(id: number) {
    if (!confirm("삭제할까요?")) return;

    await fetch("/api/branch-info", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadItems();
  }

  function editItem(item: any) {
    setEditingId(item.id);
    setForm({
      branch_name: item.branch_name || "철산점",
      phone: item.phone || "",
      address: item.address || "",
      instagram_url: item.instagram_url || "",
      naver_booking_url: item.naver_booking_url || "",
      naver_map_url: item.naver_map_url || "",
      naver_blog_url: item.naver_blog_url || "",
      kakao_map_url: item.kakao_map_url || "",
      business_hours: item.business_hours || "",
      hashtags: item.hashtags || "",
      memo: item.memo || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text || "");
    alert("복사 완료!");
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#60A5FA]">
          BRANCH INFO
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          지점 정보
        </h1>

        <p className="mb-10 text-zinc-400">
          전화번호 · 주소 · 지도 · 예약 링크 · 해시태그 관리
        </p>

        <section className="grid gap-5 rounded-[30px] border border-white/10 bg-[#171719] p-6 md:grid-cols-2">
          <select
            value={form.branch_name}
            onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>철산점</option>
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>영등포점</option>
          </select>

          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="전화번호"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="주소"
            className="rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <input
            value={form.instagram_url}
            onChange={(e) =>
              setForm({ ...form, instagram_url: e.target.value })
            }
            placeholder="인스타 URL"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            value={form.naver_booking_url}
            onChange={(e) =>
              setForm({ ...form, naver_booking_url: e.target.value })
            }
            placeholder="네이버 예약 URL"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            value={form.naver_map_url}
            onChange={(e) =>
              setForm({ ...form, naver_map_url: e.target.value })
            }
            placeholder="네이버 지도 URL"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            value={form.naver_blog_url}
            onChange={(e) =>
              setForm({ ...form, naver_blog_url: e.target.value })
            }
            placeholder="네이버 블로그 URL"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            value={form.kakao_map_url}
            onChange={(e) =>
              setForm({ ...form, kakao_map_url: e.target.value })
            }
            placeholder="카카오맵 URL"
            className="rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <textarea
            value={form.business_hours}
            onChange={(e) =>
              setForm({ ...form, business_hours: e.target.value })
            }
            placeholder="운영시간"
            className="h-28 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <textarea
            value={form.hashtags}
            onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
            placeholder="해시태그"
            className="h-28 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <textarea
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            placeholder="메모"
            className="h-28 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <button
            onClick={saveItem}
            className="rounded-full bg-[#60A5FA] px-8 py-5 font-black text-black md:col-span-2"
          >
            {editingId ? "수정 저장" : "저장"}
          </button>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[30px] border border-white/10 bg-[#171719] p-6"
            >
              <p className="text-sm font-black text-[#60A5FA]">
                {item.branch_name}
              </p>

              <h2 className="mt-1 text-3xl font-black">{item.phone}</h2>

              <pre className="mt-4 whitespace-pre-wrap text-zinc-300">
                {item.address}
              </pre>

              <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-400">
                {item.business_hours}
              </pre>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => copy(item.phone)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                >
                  전화 복사
                </button>

                <button
                  onClick={() => copy(item.address)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                >
                  주소 복사
                </button>

                <button
                  onClick={() => copy(item.hashtags)}
                  className="rounded-full bg-[#60A5FA] px-4 py-2 text-sm font-black text-black"
                >
                  해시태그 복사
                </button>

                <button
                  onClick={() => editItem(item)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-black"
                >
                  수정
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="rounded-full border border-red-500 px-4 py-2 text-sm font-black text-red-400"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}