"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  category: "해시태그",
  branch_name: "공통",
  title: "",
  content: "",
  memo: "",
};

export default function MarketingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const res = await fetch("/api/marketing-templates");
    const data = await res.json();
    if (data.ok) setItems(data.items);
  }

  async function saveItem() {
    if (!form.title || !form.content) {
      alert("제목과 내용을 입력해줘.");
      return;
    }

    const res = await fetch("/api/marketing-templates", {
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

    await fetch("/api/marketing-templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadItems();
  }

  function editItem(item: any) {
    setEditingId(item.id);
    setForm({
      category: item.category || "해시태그",
      branch_name: item.branch_name || "공통",
      title: item.title || "",
      content: item.content || "",
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

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FACC15]">
          MARKETING
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          마케팅 템플릿
        </h1>

        <p className="mb-10 text-zinc-400">
          해시태그 · 릴스 문구 · 광고 문구 · 이벤트 문구 관리
        </p>

        <section className="grid gap-5 rounded-[30px] border border-white/10 bg-[#171719] p-6 md:grid-cols-2">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>해시태그</option>
            <option>릴스 문구</option>
            <option>광고 문구</option>
            <option>이벤트 문구</option>
            <option>블로그 문구</option>
            <option>인스타 글</option>
            <option>기타</option>
          </select>

          <select
            value={form.branch_name}
            onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>공통</option>
            <option>철산점</option>
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>영등포점</option>
          </select>

          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="제목"
            className="rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="내용"
            className="h-60 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <textarea
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            placeholder="메모"
            className="h-24 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <button
            onClick={saveItem}
            className="rounded-full bg-[#FACC15] px-8 py-5 font-black text-black md:col-span-2"
          >
            {editingId ? "수정 저장" : "저장"}
          </button>
        </section>

        <div className="mt-10">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색: 철산, 해시태그, 이벤트, 릴스..."
            className="w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FACC15]"
          />
        </div>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          {items
            .filter((item) => {
                const q = search.trim().toLowerCase();

                if (!q) return true;

                return (
                item.category?.toLowerCase().includes(q) ||
                item.branch_name?.toLowerCase().includes(q) ||
                item.title?.toLowerCase().includes(q) ||
                item.content?.toLowerCase().includes(q) ||
                item.memo?.toLowerCase().includes(q)
                );
            })
            .map((item) => (
            <div
              key={item.id}
              className="rounded-[30px] border border-white/10 bg-[#171719] p-6"
            >
              <p className="text-sm font-black text-[#FACC15]">
                {item.branch_name} · {item.category}
              </p>

              <h2 className="mt-2 text-2xl font-black">{item.title}</h2>

              <pre className="mt-4 whitespace-pre-wrap text-zinc-300">
                {item.content}
              </pre>

              {item.memo && (
                <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-500">
                  {item.memo}
                </pre>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => copy(item.content)}
                  className="rounded-full bg-[#FACC15] px-4 py-2 text-sm font-black text-black"
                >
                  전체 복사
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